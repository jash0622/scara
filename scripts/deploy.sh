#!/usr/bin/env bash
# ============================================================================
# SCARA — EC2 Deploy Script
# Usage:
#   First time server setup:  bash deploy.sh --setup
#   Deploy / redeploy:        bash deploy.sh
#   Backend only:             bash deploy.sh --backend
#   Frontend only:            bash deploy.sh --frontend
#   Admin only:               bash deploy.sh --admin
# ============================================================================

set -euo pipefail

APP_DIR="/home/ubuntu/scara"
REPO_URL="https://github.com/YOUR_GITHUB_USERNAME/scara.git"   # <-- change this
LOG_DIR="/home/ubuntu/.pm2/logs"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Colour

info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ── First-time server setup ───────────────────────────────────────────────────
setup_server() {
    info "=== SCARA Server Setup ==="

    # 1. System packages
    info "Installing system packages..."
    sudo apt-get update -q
    sudo apt-get install -y -q git nginx certbot python3-certbot-nginx

    # 2. Node.js 20
    if ! command -v node &>/dev/null || [[ "$(node -v)" != v20* ]]; then
        info "Installing Node.js 20..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        info "Node.js $(node -v) already installed."
    fi

    # 3. PM2
    if ! command -v pm2 &>/dev/null; then
        info "Installing PM2..."
        sudo npm install -g pm2
    else
        info "PM2 already installed."
    fi

    # 4. Swap (1 GB — critical for t3.micro builds)
    if ! swapon --show | grep -q /swapfile; then
        info "Creating 1 GB swap file..."
        sudo fallocate -l 1G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        info "Swap enabled."
    else
        info "Swap already active."
    fi

    # 5. Clone repo
    if [ ! -d "$APP_DIR" ]; then
        info "Cloning repository to $APP_DIR..."
        git clone "$REPO_URL" "$APP_DIR"
    else
        info "Repository already cloned at $APP_DIR."
    fi

    # 6. Nginx config
    if [ ! -f /etc/nginx/sites-available/scara ]; then
        info "Installing Nginx config..."
        sudo cp "$APP_DIR/nginx.conf" /etc/nginx/sites-available/scara
        sudo ln -sf /etc/nginx/sites-available/scara /etc/nginx/sites-enabled/scara
        sudo rm -f /etc/nginx/sites-enabled/default
        sudo nginx -t && sudo systemctl reload nginx
    else
        info "Nginx config already installed."
    fi

    # 7. PM2 startup
    info "Configuring PM2 startup on boot..."
    pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | sudo bash

    # 8. Log directory
    mkdir -p "$LOG_DIR"

    info ""
    info "=== Setup complete! ==="
    info ""
    info "NEXT STEPS:"
    info "  1. Create Backend .env:   nano $APP_DIR/Backend/.env"
    info "     Copy from:             $APP_DIR/Backend/.env.production"
    info "     Fill in: SUPABASE_SERVICE_ROLE_KEY, AWS keys, JWT_SECRET, RESEND_API_KEY"
    info ""
    info "  2. Seed admin password:   cd $APP_DIR/Backend && npm run seed:admin"
    info "     Then paste ADMIN_PASSWORD_HASH back into .env"
    info ""
    info "  3. Point DNS to this IP:  $(curl -s ifconfig.me)"
    info "     A  @        → this IP"
    info "     A  www      → this IP"
    info "     A  api      → this IP"
    info "     A  admin    → this IP"
    info ""
    info "  4. Get SSL certificates after DNS propagates:"
    info "     sudo certbot --nginx -d scara.gg -d www.scara.gg -d api.scara.gg -d admin.scara.gg"
    info ""
    info "  5. Deploy the apps:   bash $APP_DIR/scripts/deploy.sh"
}

# ── Build and start Backend ───────────────────────────────────────────────────
deploy_backend() {
    info "--- Deploying Backend ---"
    cd "$APP_DIR/Backend"

    [ ! -f .env ] && error "Backend .env not found! Copy .env.production → .env and fill in values."

    info "Installing dependencies..."
    npm ci --omit=dev

    info "Building TypeScript..."
    npm run build

    info "Restarting via PM2..."
    if pm2 describe scara-backend &>/dev/null; then
        pm2 restart scara-backend --update-env
    else
        pm2 start "$APP_DIR/ecosystem.config.cjs" --only scara-backend --env production
    fi

    info "Backend deployed. ✓"
}

# ── Build and start Frontend ──────────────────────────────────────────────────
deploy_frontend() {
    info "--- Deploying Frontend ---"
    cd "$APP_DIR/Frontend"

    info "Installing dependencies..."
    npm ci

    info "Building Next.js (standalone)..."
    npm run build

    # Standalone mode requires static files to be copied manually
    info "Copying static assets into standalone build..."
    cp -r .next/static .next/standalone/.next/static
    cp -r public        .next/standalone/public  2>/dev/null || true

    info "Restarting via PM2..."
    if pm2 describe scara-frontend &>/dev/null; then
        pm2 restart scara-frontend --update-env
    else
        pm2 start "$APP_DIR/ecosystem.config.cjs" --only scara-frontend --env production
    fi

    info "Frontend deployed. ✓"
}

# ── Build and start Admin ─────────────────────────────────────────────────────
deploy_admin() {
    info "--- Deploying Admin ---"
    cd "$APP_DIR/Admin"

    info "Installing dependencies..."
    npm ci

    info "Building Next.js admin (standalone)..."
    # Use more memory for the Nitro/admin build on t3.micro
    NODE_OPTIONS="--max-old-space-size=768" npm run build

    # Copy static assets into standalone build
    info "Copying static assets into standalone build..."
    cp -r .next/static .next/standalone/.next/static

    info "Restarting via PM2..."
    if pm2 describe scara-admin &>/dev/null; then
        pm2 restart scara-admin --update-env
    else
        pm2 start "$APP_DIR/ecosystem.config.cjs" --only scara-admin --env production
    fi

    info "Admin deployed. ✓"
}

# ── Full deploy (pull + all three) ───────────────────────────────────────────
deploy_all() {
    info "=== SCARA Full Deploy ==="

    # Pull latest code
    info "Pulling latest code from git..."
    cd "$APP_DIR"
    git pull origin main

    deploy_backend
    deploy_frontend
    deploy_admin

    # Save PM2 process list so it survives reboots
    pm2 save

    info ""
    info "=== Deploy complete! ==="
    pm2 list
    info ""
    info "Health check:"
    sleep 2
    curl -sf http://localhost:4000/api/health && echo " ← Backend OK" || warn "Backend health check failed — check: pm2 logs scara-backend"
    curl -sf http://localhost:3000 > /dev/null && echo "Frontend port 3000 OK" || warn "Frontend not responding — check: pm2 logs scara-frontend"
    curl -sf http://localhost:3001 > /dev/null && echo "Admin port 3001 OK"    || warn "Admin not responding — check: pm2 logs scara-admin"
}

# ── Argument routing ──────────────────────────────────────────────────────────
case "${1:-}" in
    --setup)    setup_server  ;;
    --backend)  deploy_backend ;;
    --frontend) deploy_frontend ;;
    --admin)    deploy_admin ;;
    "")         deploy_all ;;
    *)          error "Unknown argument: $1. Use --setup, --backend, --frontend, --admin, or no args for full deploy." ;;
esac
