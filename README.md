# PlacementPro

An AI-assisted campus placement management system for three user roles — **Students**, **TPOs** (Training & Placement Officers), and **Recruiters**.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS v4, Framer Motion, React Router |
| Backend | Node.js, Express |
| Database | MongoDB (via Mongoose), hosted on MongoDB Atlas |
| Auth | JWT (access + refresh tokens, with refresh rotation) |
| File storage | Cloudinary (resume PDFs) |
| PDF parsing | `pdf-parse` v2 |
| AI matching | OpenAI (`gpt-4o-mini`), via function-calling / structured output |
| Email | Resend (sandbox sender `onboarding@resend.dev`) |

## Project status

Built incrementally, phase by phase, with every piece manually tested and verified before moving to the next.

- ✅ **Phase 1 — Setup**
- ✅ **Phase 2 — Auth**: register/login, JWT access + refresh rotation, RBAC middleware
- ✅ **Phase 3 — Student profile + resume**: profile CRUD, Cloudinary upload, PDF text extraction
- ✅ **Phase 4 — Drives CRUD**
- ✅ **Phase 5 — Eligibility engine**
- ✅ **Phase 6 — Application status + audit trail**
- ✅ **Phase 7 — AI resume matching**: `aiService.js`, `matchBatchJob.js`, and the AI routes are fully built and verified — structured OpenAI function-calling output, batch scoring across a drive's applicants, and graceful per-applicant failure handling, all confirmed via direct script tests and live through the TPO Drive Detail page's "Run AI matching" button
- ✅ **Phase 8 — Notifications**: in-app + email (Resend), wired into the real status-change flow — bell icon with unread badge, mark-as-read
- ✅ **Phase 9 — Frontend**: landing page (role-differentiated hero, Features + How it works sections), auth pages, all three role dashboards, full dark mode + mobile responsiveness pass
- ✅ **Phase 10 — Testing + bug fixing**: full manual walkthrough completed as all three roles; every bug found was fixed and reverified
- ✅ **Phase 11 — Deployment**: backend and frontend hosting, production environment variables

## Folder structure

```
placementpro/
  server/
    config/          # db.js, cloudinary.js, upload.js
    controllers/       # auth, profile, resume, drive, application, ai, notification
    middleware/          # authMiddleware.js (protect + role-based authorize)
    models/                # User, StudentProfile, Drive, Application, AuditLog, Notification
    routes/
    services/                # eligibilityService, applicationStatusService, aiService, notificationService
    jobs/                      # matchBatchJob.js
    utils/                        # generateTokens.js
    server.js
    .env
  client/
    src/
      components/       # Navbar, Footer, ThemeToggle, NotificationBell, PipelineVisual,
                          # Features, HowItWorks, ProtectedRoute, LoadingState, EmptyState,
                          # StudentLayout, TPOLayout, RecruiterLayout
      pages/
        student/          # DrivesList, MyApplications, Profile
        tpo/               # PostDrive, DrivesList, DriveDetail
        recruiter/          # DrivesList, DriveDetail
        Landing.jsx, Login.jsx, Register.jsx
      context/            # AuthContextInstance.js, AuthContext.jsx, useAuth.js
      lib/                 # api.js (axios instance + auth interceptors)
      index.css             # Tailwind v4 design tokens (@theme), light + dark mode
    index.html
    .env
```

## Environment variables

### `server/.env`
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/placementpro?retryWrites=true&w=majority

JWT_ACCESS_SECRET=<long random hex string>
JWT_REFRESH_SECRET=<different long random hex string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

OPENAI_API_KEY=
AI_MODEL=gpt-4o-mini

RESEND_API_KEY=
EMAIL_FROM=onboarding@resend.dev
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## Setup — running locally

**Backend:**
```bash
cd server
npm install
node server.js
```
Visit `http://localhost:5000/api/health` — should return `{ "status": "ok" }`.

**Frontend:**
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173`.

Both must be running simultaneously — the frontend proxies all API calls to the backend via `VITE_API_URL`.

**Testing multiple roles:** use separate browser contexts per role (a regular window, an incognito window, a different browser) rather than multiple tabs in the same browser. The refresh-token cookie is shared per browser, not per tab, so logging into a second role in another tab of the same browser will silently switch the session identity for every tab.

## Architecture notes worth knowing

- **Auth tokens**: access token lives in React memory only (never `localStorage`); refresh token is an httpOnly cookie. On app load, a silent `/api/auth/refresh` restores the session. Axios interceptors auto-attach the access token and auto-retry once on a `401` via silent refresh — except the refresh call itself is excluded from retry, to avoid an infinite loop with no valid session.
- **CORS**: backend uses exactly one `cors({ origin: CLIENT_URL, credentials: true })` config. A wildcard `cors()` is incompatible with credentialed requests — and critically, **only one `cors()` middleware may be registered at all**; a leftover duplicate earlier in the middleware chain will silently intercept preflight requests before the correct one ever runs.
- **Eligibility logic** lives in exactly one place (`eligibilityService.js`), reused by drive listing, the apply gate, and the TPO's eligible-students view.
- **Application status transitions** are enforced by a state machine (`applicationStatusService.js`): `applied → shortlisted → interview → selected`, with `rejected` reachable from any non-final state. Enforced server-side regardless of what the frontend shows.
- **Notifications** are triggered automatically from `updateApplicationStatus` (both in-app record + email), not just available as a standalone service — this wiring was a gap caught during the Phase 10 walkthrough and fixed then.
- **Resume PDFs**: uploaded via `multer-storage-cloudinary` (`resource_type: 'raw'`, filename must end in `.pdf` explicitly). Text extraction re-downloads the file via its Cloudinary URL and passes the buffer to `pdf-parse` v2's class-based API (`new PDFParse({ data: buffer }).getText()`).
- **Design tokens**: defined in `client/src/index.css` via Tailwind v4's `@theme` block. Dark mode is a manual `.dark` class toggle, applied once at the app root (`App.jsx`) on load — not only by the toggle button itself — so every page is correctly themed even before visiting a page that renders the toggle.
- **Responsive pattern for data tables**: pages with wide tables (TPO/Recruiter Drive Detail) render two versions — a stacked-card layout (`md:hidden`) and the full table (`hidden md:block`) — rather than trying to force a multi-column table into a narrow viewport.

## Role-based routing (frontend)

| Path prefix | Role required | Pages |
|---|---|---|
| `/student/*` | `student` | Drives, My Applications, Profile |
| `/tpo/*` | `tpo` | Drives, Post a drive, Drive detail (applicants, status, AI matching, CSV export) |
| `/recruiter/*` | `recruiter` | Drives, Drive detail (view + status changes, no AI matching/CSV/posting) |

All protected by `ProtectedRoute`, which redirects unauthenticated users to `/login` and wrong-role users to `/`.

## Design system

- **Palette**: deep indigo (`#2F2A60`, "ink"), cool off-white (`#F7F8FA`, "paper"), plus one accent per role — Student `#4E65FF`, TPO `#1F8A6F`, Recruiter `#7A2F52` — and a shared "milestone" gold (`#EEE0B7`) reserved for the `selected` status/end-of-pipeline state across all roles. Dark mode overrides four base tokens (`ink`, `paper`, `slate`, `line`) plus brighter dark-safe variants of `authority`, `professional`, and `milestone`, since the light-mode values had insufficient contrast on dark backgrounds.
- **Type pairing**: Newsreader (serif, headlines), IBM Plex Sans (body), IBM Plex Mono (data — CGPA, dates, status labels, the wordmark).
- **Signature element**: an animated node-and-line "pipeline" visual (`PipelineVisual.jsx`) representing `Applied → Shortlisted → Interview → Selected`, recolored per role on the landing hero and conceptually mirroring the real status-tracker UI. Has separate desktop (zigzag) and mobile (straight vertical) layouts, since the zigzag's diagonal labels don't fit a narrow viewport.
- **Loading/empty states**: unified via two small shared components, `LoadingState` (centered, pulsing dot) and `EmptyState` (centered message), used identically across every page instead of ad hoc per-page text.
- **Dark mode**: manual toggle, persisted to `localStorage`, applied at the app root on load so it's correct on every route immediately — not dependent on visiting a page that renders the toggle button itself.

## Bugs hit and fixed along the way

A record of real issues found during testing, kept here since the fixes weren't always obvious:

- **Mongoose `pre('save')` hook**: mixing `async function` with a `next` parameter caused `next is not a function` on register and login. Fix: drop `next` entirely from async hooks.
- **Cloudinary raw uploads missing `.pdf` extension**: `multer-storage-cloudinary` doesn't reliably honor `format` for `resource_type: 'raw'`. Fix: bake `.pdf` directly into the `public_id`.
- **`pdf-parse` v1 → v2 API break**: v2 replaced the function-call style with a `PDFParse` class.
- **Duplicate `require(...)` imports**: adding a new controller function repeatedly led to a second, separate `require` line instead of merging into the existing one — causes `Identifier ... has already been declared` crashes. Always merge new named exports into the single existing import line.
- **Infinite refresh loop**: the axios response interceptor retried failed requests via silent refresh but didn't exclude the `/auth/refresh` call itself, causing an infinite loop for logged-out users. Fixed by explicitly skipping retry when the failing request's URL is the refresh endpoint.
- **Duplicate `cors()` middleware**: an old wildcard `app.use(cors())` from Phase 1 was never removed when the credentialed, origin-specific version was added — Express matched the first (wildcard) one for preflight requests, silently breaking cookie-based login even with the "correct" config present further down the file.
- **React Fast Refresh + Context**: a single file exporting both a component and non-component values (a hook, a raw context object) breaks Vite's Fast Refresh. Resolved by splitting into three files: the raw `createContext()` instance, the provider component, and the `useAuth` hook.
- **Number input scroll-jack**: Chrome changes a focused `<input type="number">`'s value on mouse-wheel scroll, silently producing a `-27` backlog value during testing. Fixed with an `onWheel` handler that blurs the input, plus `min="0"` and a defensive `Math.max(0, ...)` clamp before submission.
- **Dark mode only applying on pages with the toggle mounted**: the `.dark` class was only ever set by `ThemeToggle`'s own effect, so pages without the toggle (Login/Register) never picked up a saved dark-mode preference on a fresh load. Fixed by applying the class once at the app root (`App.jsx`) on mount, independent of which page renders first.
- **Cross-tab session confusion**: logging into different roles in different tabs of the *same* browser overwrites the shared refresh-token cookie each time, causing a tab to appear logged in as the wrong role and get redirected once a silent refresh runs. Not a code bug — resolved by testing each role in a separate browser context.
- **Mobile nav links disappearing with no menu**: `hidden md:flex` on nav links with no mobile fallback meant links vanished entirely below the `md` breakpoint. Fixed by adding a hamburger menu + dropdown to every layout (`Navbar`, `StudentLayout`, `TPOLayout`, `RecruiterLayout`) — the landing page's `Navbar` also needed its `ThemeToggle` duplicated outside the collapsible menu, since it was originally only present in the desktop-only nav row.
- **Applicant table overflow on mobile**: a 4–5 column table has no good responsive behavior at narrow widths. Fixed by rendering a `md:hidden` stacked-card version alongside the `hidden md:block` table, both driven from the same data and (after a later fix) the same status-action rendering logic to avoid the two versions drifting out of sync.
- **`alert()` for apply/status-change feedback**: native browser alerts show `localhost:5173 says...`, look unpolished, and block interaction. Replaced with inline, scoped success/error messages matching the rest of the app's styling — also surfaced a related bug where successful actions had no confirmation shown at all (only failures triggered the old alert).
- **Notifications never actually triggered by real app events**: `notificationService.js` was built and tested standalone (Task 26) but never called from `updateApplicationStatus` — meaning notifications only ever existed if manually created via a test script, never through real usage. Found during the Phase 10 walkthrough; fixed by calling `notifyUser()` inside the real status-change flow, using the application's own stored `student` ID (avoiding the earlier "StudentProfile ID vs User ID" mix-up from Task 26's original testing).

## Useful references

- OpenAI billing (to unblock AI matching): https://platform.openai.com/settings/organization/billing
- Cloudinary dashboard: https://cloudinary.com/console
- MongoDB Atlas: https://cloud.mongodb.com
- Resend dashboard: https://resend.com