# SCARA Backend API

Production-grade REST API powering the SCARA marketing website's dynamic content and admin panel.

**Stack:** Node.js (LTS) · Express · TypeScript · Supabase (Postgres) · AWS S3 · Resend · JWT

---

## Quick Start

### 1. Install dependencies

```bash
cd Backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in every value. The server **will not start** if any required variable is missing — it validates all env vars at boot via zod and exits immediately with a clear error message listing what's wrong.

Key values to set:
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — from Supabase Dashboard → Project Settings → API
- `JWT_SECRET` — generate with `openssl rand -hex 32`
- `AWS_*` — your S3 bucket credentials and region
- `RESEND_API_KEY` — from [resend.com/api-keys](https://resend.com/api-keys)
- `EMAIL_FROM` — must be a **verified domain** in Resend

### 3. Run database migration

Apply the schema to your Supabase project. Two options:

**Option A — Supabase CLI (recommended):**
```bash
# Requires supabase CLI: https://supabase.com/docs/guides/cli
supabase db push --db-url "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

**Option B — Supabase Dashboard:**
1. Go to your Supabase project → SQL Editor
2. Paste the contents of `supabase/migrations/001_init.sql`
3. Click Run

### 4. Create the admin account

The admin panel has a single account. There is no public signup endpoint — use the seed script:

```bash
npm run seed:admin -- scara-admin "YourStr0ngPassword!"
```

The script will:
- Hash the password with bcrypt (12 rounds)
- Upsert the record into `admin_users`
- Print the generated hash — copy `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` into your `.env`

### 5. Start the server

```bash
# Development (hot reload)
npm run dev

# Production build + start
npm run build
npm start
```

The server starts on `PORT` (default `4000`). Health check: `GET http://localhost:4000/api/health`

---

## API Reference

All responses follow a consistent shape:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "message": "...", "code": "..." } }
```

### Authentication

```
POST /api/auth/login        Public  — body: { username, password }
GET  /api/auth/me           Admin   — verifies JWT session
```

Protected endpoints require `Authorization: Bearer <token>` header.

Rate limit on login: **5 requests / 15 minutes / IP**

---

### Case Studies

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/case-studies` | Public | All case studies, sorted by `display_order` |
| `GET` | `/api/case-studies/:id` | Public | Single case study (by UUID or slug) |
| `POST` | `/api/case-studies` | Admin | Create — auto-generates slug from title |
| `PUT` | `/api/case-studies/:id` | Admin | Full update |
| `DELETE` | `/api/case-studies/:id` | Admin | Delete + best-effort S3 cleanup |
| `PATCH` | `/api/case-studies/reorder` | Admin | Bulk reorder: `{ order: [{ id, display_order }] }` |

---

### Insights / Press

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/insights` | Public | All articles, sorted by `display_order` |
| `GET` | `/api/insights/:id` | Public | Single article |
| `POST` | `/api/insights` | Admin | Create |
| `PUT` | `/api/insights/:id` | Admin | Update |
| `DELETE` | `/api/insights/:id` | Admin | Delete |
| `PATCH` | `/api/insights/reorder` | Admin | Bulk reorder |

**Note:** The public response includes both `author` (correct name) and `date` (alias, same value) for backward compatibility with the existing frontend component that reads `article.date`.

---

### Enquiries (Contact Form)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/enquiries` | Public | Submit form — saves to DB + sends 2 emails |
| `GET` | `/api/enquiries` | Admin | Paginated list — query params below |
| `GET` | `/api/enquiries/:id` | Admin | Single enquiry |
| `PATCH` | `/api/enquiries/:id/status` | Admin | Update status: `new \| read \| archived` |
| `DELETE` | `/api/enquiries/:id` | Admin | Hard delete |

Rate limit on POST: **3 requests / 10 minutes / IP**

**GET query params:**
```
page     integer  default 1
limit    integer  default 20
status   new | read | archived
budget   < $50k | $50k - $100k | $100k - $250k | $250k+
from     ISO date string  (submitted_at >=)
to       ISO date string  (submitted_at <=)
```

---

### Upload (S3)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/upload/presign` | Admin | Get presigned PUT URL for direct browser→S3 upload |
| `DELETE` | `/api/upload` | Admin | Delete an S3 object by public URL |

**Presign flow:**

1. Admin panel calls `POST /api/upload/presign` with `{ fileName, contentType, folder }`
2. Backend returns `{ uploadUrl, publicUrl, key }`
3. Admin panel browser PUTs the file bytes directly to `uploadUrl` (S3 presigned URL)
4. After successful PUT, admin panel stores `publicUrl` in the case study / insight record
5. File bytes **never pass through this Express server** — keeps the API fast and stateless

Presigned URLs expire after **5 minutes**.

---

### Health Check

```
GET /api/health   → { "success": true, "data": { "status": "ok", "timestamp": "..." } }
```

---

## Project Structure

```
src/
├── config/         env.ts · supabase.ts · s3.ts · resend.ts
├── controllers/    auth · caseStudies · insights · enquiries · upload
├── emails/         ConfirmationEmail.tsx · InternalNotificationEmail.tsx
├── middleware/     auth · validate · errorHandler · rateLimiter
├── routes/         auth · caseStudies · insights · enquiries · upload
├── schemas/        zod validation schemas for all entities
├── services/       caseStudies · insights · enquiries · s3 · email
├── types/          shared TypeScript types + DB row interfaces
├── utils/          apiResponse · slugify · logger
├── app.ts          Express app setup
└── server.ts       Boot entrypoint + graceful shutdown

scripts/
└── seed-admin.ts   One-off admin account creation

supabase/
└── migrations/
    └── 001_init.sql  Full DB schema DDL
```

---

## Security Notes

- **Service role key** is only ever used server-side. Never expose it to the browser or commit it to git.
- **JWT tokens** are signed with `JWT_SECRET` and expire after `JWT_EXPIRES_IN` (default 7 days). Store tokens in memory or `httpOnly` cookies — never `localStorage`.
- **Passwords** are hashed with bcrypt at 12 rounds. The plaintext password is never stored or logged.
- **CORS** only allows requests from `FRONTEND_URL` and `ADMIN_PANEL_URL`. All other origins are rejected.
- **Rate limiting** is applied per-IP: login (5/15min), contact form (3/10min), general API (100/15min).
- **Input validation** via zod runs on every mutating request before the controller executes.
- **Stack traces** are never included in error responses in production — only logged server-side.
- **S3 uploads** go directly from the browser to S3 via presigned URLs — file bytes never pass through this server.

---

## S3 Bucket Setup

1. Create an S3 bucket (e.g. `scara-media`) in your chosen AWS region
2. Set a bucket policy allowing public `GetObject` on `case-studies/*` and `insights/*` prefixes only:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadCaseStudies",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::scara-media/case-studies/*",
        "arn:aws:s3:::scara-media/insights/*",
        "arn:aws:s3:::scara-media/general/*"
      ]
    }
  ]
}
```

3. Add a CORS policy allowing PUT from your admin panel origin:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT"],
    "AllowedOrigins": ["https://admin.scara.gg"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

4. Create an IAM user with `s3:PutObject` + `s3:DeleteObject` permissions scoped to the bucket — use those credentials as `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`.

---

## Resend Email Setup

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your sending domain (e.g. `scara.gg`)
3. Create an API key — add it as `RESEND_API_KEY`
4. Set `EMAIL_FROM` to a verified address on that domain (e.g. `SCARA <hello@scara.gg>`)

On new contact form submissions the API sends:
- **Confirmation email** → enquirer's address (branded dark template with CTA)
- **Internal notification** → `EMAIL_INTERNAL_TO` (key-value details + full message)

Email failures are logged but **never block the API response** — the DB row is always saved first.
