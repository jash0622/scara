# SCARA Admin Panel

Internal Master Admin Panel for managing the SCARA marketing website's dynamic content.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · TanStack Query · dnd-kit · React Hook Form · Zod · Sonner

Runs on **port 3001** by default (frontend on 3000, backend on 4000).

---

## Quick Start

### 1. Install dependencies

```bash
cd Admin
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Only one variable is strictly required for local dev:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
API_BASE_URL=http://localhost:4000
```

Make sure the SCARA Backend (`d:\Scara\Backend`) is running before starting the admin panel.

### 3. Start the dev server

```bash
npm run dev
# → http://localhost:3001
```

### 4. Sign in

Use the credentials created by the backend seed script:
- **Username:** `scara-admin`
- **Password:** `Scara@Admin2026!`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Backend API base URL — used by client-side fetch calls |
| `API_BASE_URL` | ✅ | Backend API base URL — used by Next.js Route Handlers (server-side proxy) |

For production, both point to the deployed backend URL (e.g. `https://api.scara.gg`).

---

## Auth Architecture

The admin panel uses an **httpOnly-cookie relay pattern** to keep the JWT off client-side JavaScript:

```
Browser → POST /api/login (Next.js Route Handler)
             ↓
         Proxies to Backend POST /api/auth/login
             ↓
         Receives JWT, sets httpOnly cookie (scara_admin_token)
             ↓
         Returns { success: true, admin: { username } } to browser
```

1. `src/app/api/login/route.ts` — proxies credentials to backend, sets `scara_admin_token` as `httpOnly; Secure; SameSite=Strict`
2. `src/app/api/logout/route.ts` — clears the cookie with `Max-Age: 0`
3. `src/middleware.ts` — checks cookie presence on every `/dashboard/*` request, redirects to `/login` if missing
4. `src/lib/api-client.ts` — reads the JWT from the cookie on the client side to attach `Authorization: Bearer` header for API calls

**Why not full server-side proxy for every call?**
The simpler approach (reading JWT from cookie client-side and attaching it as a Bearer header) is used here. Since this is an internal tool accessed only by trusted team members on known devices, the minor XSS exposure tradeoff is acceptable. For a higher-security requirement, route all mutation calls through Next.js Route Handlers that read the `httpOnly` cookie server-side and forward it — the login/logout route handlers already demonstrate this pattern and can be extended.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── login/route.ts       # httpOnly cookie relay
│   │   └── logout/route.ts      # clears cookie
│   ├── login/page.tsx           # sign-in screen
│   ├── (dashboard)/
│   │   ├── layout.tsx           # sidebar + topbar shell
│   │   ├── page.tsx             # dashboard home (stat cards)
│   │   ├── case-studies/        # list, new, [id] edit
│   │   ├── insights/            # list, new, [id] edit
│   │   └── enquiries/           # list, [id] detail
│   ├── layout.tsx               # root layout (fonts, providers)
│   ├── providers.tsx            # QueryClient + Sonner
│   └── globals.css              # design system CSS variables + utility classes
├── components/
│   ├── Sidebar.tsx              # collapsible nav (240 ↔ 64px rail)
│   ├── Topbar.tsx               # breadcrumb + page title
│   ├── CaseStudyForm.tsx        # shared create/edit form for case studies
│   ├── InsightForm.tsx          # shared create/edit form for insights
│   ├── TagInput.tsx             # pill-chip tag input
│   ├── ImageUploader.tsx        # S3 presigned-URL upload (single + multi)
│   ├── ParagraphListEditor.tsx  # add/remove/edit fullDesc paragraph array
│   ├── PressOutletsEditor.tsx   # repeatable name+url outlet rows
│   ├── ReorderableTable.tsx     # dnd-kit drag-to-reorder table
│   ├── StatusBadge.tsx          # enquiry status + category badges
│   └── ConfirmDeleteDialog.tsx  # accessible delete confirmation modal
├── lib/
│   ├── api-client.ts            # typed fetch wrapper + S3 upload helper
│   ├── types.ts                 # shared TypeScript types
│   └── queries/
│       ├── caseStudies.queries.ts
│       ├── insights.queries.ts
│       └── enquiries.queries.ts
└── middleware.ts                # route guard: /dashboard/* → /login if no cookie
```

---

## Image Upload Flow

Images never pass through this server. The flow is:

```
1. Admin selects file in <ImageUploader />
2. POST /api/upload/presign → backend returns { uploadUrl, publicUrl }
3. Browser PUTs file bytes directly to S3 via uploadUrl (presigned, valid 5 min)
4. publicUrl is stored in the form field and saved to DB on form submit
```

To remove an image, the admin clicks × which calls `DELETE /api/upload` on the backend, which deletes the S3 object.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Sidebar collapse persisted in `localStorage` | No server round-trip needed; survives page refresh |
| TanStack Query with optimistic updates on reorder/status | Instant UI feedback; rollback on error with toast |
| Server-paginated enquiries | Potentially large dataset; never fetch all client-side |
| `date-fns` for relative timestamps | Lightweight, tree-shakeable |
| Unread badge polls every 60s | Low-cost way to keep the team informed without WebSockets |
| `author` shown as "Author Name" in UI | The backend field is `author` but the old frontend reads `date` — the API emits both; the admin always uses the correctly-named field |
| Design tokens as CSS variables | Allows runtime theming and avoids Tailwind purge issues with dynamic color values |

---

## Production Deployment Notes

1. Set `NEXT_PUBLIC_API_BASE_URL` and `API_BASE_URL` to your production backend URL
2. The backend's `.env` `ADMIN_PANEL_URL` must match the admin panel's deployed origin for CORS
3. Set `NODE_ENV=production` — this enables `Secure` flag on the auth cookie
4. Deploy as a standard Next.js app (Vercel, Railway, EC2 + PM2, etc.)
5. The admin panel has `robots: noindex, nofollow` in its metadata — ensure it's not publicly discoverable
