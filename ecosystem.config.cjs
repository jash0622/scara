// ============================================================================
// SCARA — PM2 Ecosystem Config
// Usage:
//   Start all:   pm2 start ecosystem.config.cjs
//   Restart all: pm2 restart scara
//   Stop all:    pm2 stop scara
//   Logs:        pm2 logs
//   Status:      pm2 list
// ============================================================================

module.exports = {
  apps: [
    // ── Backend — Express API ─────────────────────────────────────────────────
    {
      name: "scara-backend",
      script: "./Backend/dist/server.js",
      cwd: "/home/ubuntu/scara",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "300M",
      env_production: {
        NODE_ENV: "production",
        PORT: 4000,
      },
      // Structured JSON logs → pino writes JSON in production
      error_file: "/home/ubuntu/.pm2/logs/scara-backend-error.log",
      out_file: "/home/ubuntu/.pm2/logs/scara-backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Auto-restart on crash with exponential backoff
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: "10s",
    },

    // ── Frontend — Next.js Public Site ───────────────────────────────────────
    {
      name: "scara-frontend",
      // Next.js standalone server — self-contained, no next CLI needed
      script: "./Frontend/.next/standalone/server.js",
      cwd: "/home/ubuntu/scara",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "400M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        // Hostname must be explicit for standalone mode
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_API_BASE_URL: "https://api.scara.gg",
      },
      error_file: "/home/ubuntu/.pm2/logs/scara-frontend-error.log",
      out_file: "/home/ubuntu/.pm2/logs/scara-frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: "10s",
    },

    // ── Admin — Next.js Admin Panel ───────────────────────────────────────────
    {
      name: "scara-admin",
      script: "./Admin/.next/standalone/server.js",
      cwd: "/home/ubuntu/scara",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "300M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
        // Admin calls backend via Next.js rewrites (same machine, no CORS)
        API_BASE_URL: "http://localhost:4000",
        NEXT_PUBLIC_API_BASE_URL: "",
      },
      error_file: "/home/ubuntu/.pm2/logs/scara-admin-error.log",
      out_file: "/home/ubuntu/.pm2/logs/scara-admin-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
