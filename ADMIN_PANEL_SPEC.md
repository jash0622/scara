# SCARA Admin Panel — Complete Specification

> **Purpose:** This document defines every field, data type, and UI behavior needed in the Master Admin Panel to make three sections of the SCARA website fully dynamic:
> 1. **Selected Work** (Case Studies)
> 2. **Insights & Media** (Press / Articles)
> 3. **Contact Form** (Enquiry Submissions)
>
> No code has been changed — this is purely a spec document.

---

## TABLE OF CONTENTS

1. [Section 1 — Selected Work (Case Studies)](#section-1--selected-work-case-studies)
2. [Section 2 — Insights & Media](#section-2--insights--media)
3. [Section 3 — Contact Form Submissions](#section-3--contact-form-submissions)
4. [Admin Panel General Requirements](#admin-panel-general-requirements)
5. [Unused Files to Clean Up](#unused-files-to-clean-up)

---

## SECTION 1 — Selected Work (Case Studies)

### Where It Appears in the Frontend

- **Card Stack** (`WorkCardStack.tsx`) — scrollable vertical card deck showing `heroImage`, `year`, `market`, `title`, optional `isFeaturedIP` badge
- **Modal Popup** (`CaseStudyModal.tsx`) — opens on card click, shows full campaign detail

---

### Data Model: `CaseStudy`

| Field | Type | Required | Admin Input Type | Where It Renders |
|---|---|---|---|---|
| `id` | `string` | ✅ | Auto-generated (slug from title) | React key + modal prev/next lookup |
| `slug` | `string` | ✅ | Auto-generated (same as id) | Reserved for future URL routing |
| `title` | `string` | ✅ | Text input | Card heading (bottom) · Modal h2 heading |
| `client` | `string` | ✅ | Text input | **Currently not rendered** — store for future use |
| `year` | `string` | ✅ | Number input / Year picker (e.g. `2025`, `2026`) | Card top-left pill · YearOdometer in left column · Modal hero pill |
| `market` | `string` | ✅ | Text input (e.g. `India`, `Turkey`, `Global`) | Card top-left pill ("2026 / India") · Modal hero pill |
| `category` | `enum` | ✅ | Dropdown select | Modal hero badge pill |
| `shortDesc` | `string` | ✅ | Textarea (1–2 lines) | **Currently not rendered** — store for future cards/SEO |
| `heroImage` | `string` (URL/path) | ✅ | Image upload | Card full-bleed background · Modal header image · First image in gallery carousel |
| `fullDesc` | `string[]` | ✅ | Rich text / multi-paragraph textarea | Modal "CAMPAIGN OVERVIEW" — each array item = one paragraph |
| `talent` | `string[]` | ✅ | Tag input (add/remove pills) | **Currently not rendered** — store for future display |
| `services` | `string[]` | ✅ | Tag input (add/remove pills) | Modal "CAPABILITIES & SERVICES" — bulleted list |
| `gallery` | `string[]` | ✅ | Multi-image upload | Modal "CAMPAIGN ASSETS GALLERY" — DepthCarousel (combined with heroImage as first slide) |
| `pressOutlets` | `string[]` + URL pairs | ✅ | Repeatable field: [outlet name + URL] | Modal "PRESS & MEDIA COVERAGE" — each item = clickable pill chip with ExternalLink icon |
| `isFeaturedIP` | `boolean` | ❌ optional | Toggle/checkbox | Card top-right "IP" sparkle badge · Modal hero "PROPRIETARY IP" badge |

---

### Category Enum Values (dropdown options)

```
Gaming
Sports
Live
Culture
```

---

### Press Outlets — Important Note

In the current data, `pressOutlets` is a `string[]` (just outlet name, e.g. `"IGN India"`).
The modal renders each outlet as a pill chip with an `ExternalLink` icon — but currently the icon is decorative (no actual link).

**Recommended admin field:** Make each press outlet a pair:

```json
{
  "name": "IGN India",
  "url": "https://in.ign.com/..."
}
```

This way the `ExternalLink` icon becomes a real clickable link. The frontend type would change to:
```typescript
pressOutlets: { name: string; url: string }[];
```

---

### Gallery — Important Note

The modal's `DepthCarousel` receives:
```js
[caseStudy.heroImage, ...caseStudy.gallery]
```
So `heroImage` is always the **first** carousel slide automatically. The `gallery` array holds additional campaign visuals. Admin should be able to upload multiple images here with drag-to-reorder.

---

### Admin Panel UI for Case Studies

```
┌─────────────────────────────────────────────────┐
│  CASE STUDIES                          [+ New]   │
├─────────────────────────────────────────────────┤
│  List view: Title | Client | Year | Market | Category | [Edit] [Delete]
│  Sortable by year (drag to reorder display order)
└─────────────────────────────────────────────────┘

CREATE / EDIT form:
──────────────────
SECTION A — IDENTITY
  [ Title* ]              text input
  [ Client* ]             text input
  [ Year* ]               number input (4 digits)
  [ Market* ]             text input
  [ Category* ]           dropdown: Gaming / Sports / Live / Culture
  [ Is Featured IP ]      toggle (default: off)

SECTION B — DESCRIPTIONS
  [ Short Description* ]  textarea (~150 chars)
  [ Campaign Overview* ]  rich text / paragraph editor
                          (each paragraph = one array item)

SECTION C — MEDIA
  [ Hero Image* ]         image upload (drag/drop)
                          — shown: cover card + modal header + gallery slide 1
  [ Gallery Images ]      multi-image upload with reorder
                          — shown: carousel slides 2, 3, 4...

SECTION D — METADATA
  [ Talent / Creators ]   tag input  (add/remove)
                          e.g. "Gurpreet Singh Sandhu", "Jonathan Gaming"
  [ Services Delivered ]  tag input  (add/remove)
                          e.g. "Influencer Management", "In-Game Cosmetics"

SECTION E — PRESS COVERAGE
  [ Press Outlets ]       repeatable field:
                          [Outlet Name] + [Article URL]
                          e.g. "IGN India" | "https://in.ign.com/..."
```

---

## SECTION 2 — Insights & Media

### Where It Appears in the Frontend

- `InsightsSection.tsx` — grid of article cards (3 per row), "View More" toggles to show all
- Each card links out to the original article URL in a new tab

---

### Data Model: `InsightArticle`

| Field | Type | Required | Admin Input Type | Where It Renders |
|---|---|---|---|---|
| `title` | `string` | ✅ | Text input | Card heading (h4), uppercase, line-clamp-3 |
| `outlet` | `string` | ✅ | Text input (e.g. `CNBC TV18`, `Times of India`) | Card top-left label in green |
| `category` | `enum` | ✅ | Dropdown select | **Currently NOT rendered** — store for future filtering |
| `url` | `string` | ✅ | URL input | Entire card is wrapped in `<a href={url} target="_blank">` |
| `date` | `string` | ✅ | Text input — **Note: this field currently stores author name** (e.g. `Manoj George`) — rename to `author` in DB | Card top-right label in grey |

---

### Category Enum Values

```
Interview
Authored Article
Campaign Coverage
```

---

### Important Note on `date` Field

In the current frontend code:
```tsx
<span className="font-sub text-[10px] text-scara-grey shrink-0">
  {article.date}
</span>
```

This field is labeled `date` in the TypeScript interface but is **actually used to store author names** in the data (e.g., `"Manoj George"`, `"Karan Khurana"`). In the admin panel, this should be **two separate fields**:

| Admin Field | Maps to | Renders As |
|---|---|---|
| Author Name | `date` (existing field) | Top-right grey label |
| Publish Date | (new field — not in UI yet) | Optional metadata |

---

### Admin Panel UI for Insights

```
┌─────────────────────────────────────────────────┐
│  INSIGHTS & MEDIA                      [+ New]   │
├─────────────────────────────────────────────────┤
│  List view: Title | Outlet | Category | [Edit] [Delete]
│  Drag to reorder (order = display order on website)
└─────────────────────────────────────────────────┘

CREATE / EDIT form:
──────────────────
  [ Article Title* ]      text input
  [ Outlet / Publication* ] text input  e.g. "Times of India"
  [ Author Name ]         text input  (maps to `date` field)
  [ Category* ]           dropdown: Interview / Authored Article / Campaign Coverage
  [ Article URL* ]        URL input   (must start with https://)
```

---

## SECTION 3 — Contact Form Submissions

### Current Behavior

The contact form **does not submit data anywhere** — it is pure frontend state with a confetti animation on submit. There is no API call, no database, no email notification.

### Form Fields to Capture

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | `string` | ✅ | Min 2 chars |
| `email` | `string` | ✅ | Valid email format |
| `company` | `string` | ❌ optional | — |
| `budget` | `enum` | ❌ optional (has default) | One of the 4 options |
| `message` | `string` | ✅ | Min 10 chars |

### Budget Enum Options

```
< $50k
$50k - $100k       ← default
$100k - $250k
$250k+
```

### What the Admin Panel Needs for Submissions

```
┌─────────────────────────────────────────────────┐
│  ENQUIRY SUBMISSIONS                             │
├─────────────────────────────────────────────────┤
│  List view (read-only):
│    Name | Email | Company | Budget | Date | [View] [Archive] [Delete]
│
│  Filter by: Budget range | Date range | Status (New / Read / Archived)
│
│  Detail view (read-only):
│    Name, Email, Company
│    Budget Range
│    Message (full text)
│    Submitted At (timestamp)
│    Status toggle: New → Read → Archived
└─────────────────────────────────────────────────┘
```

### Backend Requirements for Contact Form

To make the form functional you need:

1. **API Route** — `POST /api/contact`
   - Receives: `{ name, email, company, budget, message }`
   - Saves to DB with: `id`, `submittedAt`, `status: 'new'`
   - Returns: `{ success: true }` or error

2. **Email Notification** (optional but recommended)
   - On new submission, send email to `contact@scara.gg`
   - Tools: Resend / Nodemailer / SendGrid

3. **Database table** — `enquiries`
   ```
   id           UUID / auto-increment
   name         VARCHAR
   email        VARCHAR
   company      VARCHAR (nullable)
   budget       VARCHAR
   message      TEXT
   status       ENUM('new', 'read', 'archived') DEFAULT 'new'
   submitted_at TIMESTAMP DEFAULT NOW()
   ```

---

## ADMIN PANEL GENERAL REQUIREMENTS

### Authentication
- Single admin login (username + password)
- JWT session tokens
- No public registration

### Tech Stack Recommendations
| Option | Stack |
|---|---|
| Simple | **Payload CMS** (self-hosted, Next.js native, auto-generates admin UI from schema) |
| Custom | **Next.js App Router** + **Prisma** + **PostgreSQL** + custom admin pages under `/admin` |
| Hosted | **Sanity.io** (hosted CMS, schema-driven, excellent image handling) |

### Image Storage
- Upload to **Cloudinary** or **AWS S3**
- Store URL string in DB
- Replace local `/public/` paths with CDN URLs

### Display Order
- Case Studies: drag-to-reorder via `order` integer field (sorted ascending)
- Insights: same drag-to-reorder

---

## UNUSED FILES TO CLEAN UP

These files exist in the codebase but are **never imported or used** anywhere. Safe to delete — removing them will not affect any currently visible section.

### Components

| File Path | Reason Safe to Delete |
|---|---|
| `src/components/sections/ClientsSection.tsx` | Logos moved into `AboutSection.tsx` directly |
| `src/components/sections/ImpactSection.tsx` | Stats ticker now inline in `ContactSection.tsx` |
| `src/components/canvas/HeroCanvas.tsx` | Old canvas — replaced by `GlobeCanvas.tsx` |
| `src/components/hud/CornerHUD.tsx` | Never mounted in layout or any page |
| `src/components/hero/` *(entire folder)* | `ParticleHandScene.tsx` never mounted; all sub-files are only used by it |
| `src/components/ui/CircularGallery.tsx` + `.css` | Replaced by `CircularTeamGallery.tsx` |
| `src/components/ui/TeamCarousel.tsx` | Replaced by `CircularTeamGallery.tsx` |
| `src/components/ui/HaloReel.tsx` | Never imported |
| `src/components/ui/ScrollReveal.tsx` + `.css` | Never imported |
| `src/components/ui/ScrollStack.tsx` + `.css` | Never imported |
| `src/components/ui/StrokeText.tsx` + `.css` | Never imported |
| `src/components/ui/Lightning.tsx` + `.css` | Only used by `ParticleHandScene` (itself unused) |
| `src/components/ui/GradientWaves.tsx` + `.css` | Commented out in `AboutSection`, never imported |

### Data Exports (in `scaraData.ts`)

| Export | Reason Safe to Remove |
|---|---|
| `SCARA_ADVISORS` | Exported but never imported in any component |
| `SCARA_CLIENTS` | Text-only list — `SCARA_CLIENT_LOGOS` is used instead |
| `SCARA_PRESS` | Exported but never imported in any component |

---

*Document prepared: September 2026*
*Scope: SCARA Gaming Private Limited — Website Admin Panel*
