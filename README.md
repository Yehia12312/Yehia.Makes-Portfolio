# Yehia.Makes — Portfolio

Next.js implementation of the `Yehia.Makes` portfolio design: nav, hero, filterable project grid, project detail overlay, and a contact section with a real contact form + real call scheduling.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Wiring up the contact form and scheduling

The contact form and schedule panel call real APIs (Resend for email, Cal.com for availability/booking). Copy `.env.example` to `.env.local` and fill in:

| Var | What it's for |
| --- | --- |
| `RESEND_API_KEY` | From your [Resend](https://resend.com) dashboard. |
| `RESEND_FROM_EMAIL` | Sender address. Must be on a domain verified in Resend, or use `onboarding@resend.dev` for testing. |
| `CONTACT_TO_EMAIL` | Inbox that receives project briefs. |
| `CAL_API_KEY` | From [Cal.com](https://cal.com) → Settings → Developer → API Keys. |
| `CAL_USERNAME` | Your Cal.com username, from `cal.com/<username>/<slug>`. |
| `CAL_EVENT_SLUG` | The slug of the 30-min event type, from `cal.com/<username>/<slug>`. |
| `CAL_TIMEZONE` | Timezone slots are shown/booked in (defaults to `Africa/Cairo`). |

Until these are set, the contact form shows a friendly "not configured yet" error and the schedule panel shows "temporarily unavailable" — the site still renders and works otherwise.

Selecting a call slot only *holds* it visually (matching the "HELD — confirm via brief" copy); the real Cal.com booking is created when the contact form is submitted, using the name/email from that form.

## Admin panel (add/edit projects, edit hero text and colors)

There's a password-protected admin panel at `/admin` for managing content without touching code: add/edit/delete/reorder projects (with real photo uploads), and edit the hero headline/stats and brand colors. It's backed by Supabase (Postgres + file storage).

### 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com), sign up, and create a new project (pick any name/region/password — you won't need that database password directly).
2. Once it's ready, go to **SQL Editor** → **New query**, paste in the contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates the `projects` and `settings` tables, seeds the 7 launch projects, sets up public read-only access, and creates the `project-photos` storage bucket.
3. Go to **Project Settings → Data API** and copy the **Project URL** → that's `SUPABASE_URL`.
4. On the same page, copy the **anon / public** key → that's `SUPABASE_ANON_KEY`.
5. Go to **Project Settings → API Keys**, reveal and copy the **service_role** key → that's `SUPABASE_SERVICE_ROLE_KEY`. Treat this like a password — it has full read/write access and bypasses all security rules. Never put it in a `NEXT_PUBLIC_*` variable or commit it.

### 2. Set the admin password

Pick a strong password for `ADMIN_PASSWORD`, and generate a random secret for `ADMIN_SESSION_SECRET` (used to sign your login session, not something you type in):

```bash
openssl rand -hex 32
```

### 3. Add all five to your environment

Same as the Resend/Cal.com vars: add them to `.env.local` for local dev, and to your Vercel project's **Environment Variables** for the live site:

| Var | What it's for |
| --- | --- |
| `ADMIN_PASSWORD` | The password you type in at `/admin/login`. |
| `ADMIN_SESSION_SECRET` | Random secret that signs your login session cookie. |
| `SUPABASE_URL` | Your Supabase project's URL. |
| `SUPABASE_ANON_KEY` | Public key the live site uses for read-only access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key the admin panel uses to save changes. Server-only. |

Until these are set, `/admin` still loads but shows a "Supabase isn't connected yet" banner, and the public site falls back to the same 7 built-in default projects and default hero text/colors it originally shipped with — nothing breaks, edits just won't have anywhere to save.

### Using it

Visit `yoursite.com/admin` and log in with `ADMIN_PASSWORD`. Everything lives behind a permanent sidebar, each area on its own page:
- **Dashboard** (`/admin`) — an overview of new leads, upcoming calls, and site traffic (see below).
- **Leads** (`/admin/leads`) and **Bookings** (`/admin/bookings`) — every contact form submission and confirmed call, in one inbox (see below).
- **Projects** (`/admin/projects`) — add, edit, delete, and reorder (↑/↓) projects, including a real photo gallery and an optional 3D model file per project (see below).
- **Site Sections** (`/admin/sections`) — toggle sections on/off and reorder them, and add new Testimonials / Stats Band / About-Text sections anywhere on the page (see below).
- **Nav, Hero & Colors** (`/admin/settings`) — the nav menu links + CTA button, the hero headline/subtext/stats, and all 7 brand colors (background, panels, text, accent orange, verified teal).

Changes save immediately and show up on the live site on the next page load — no redeploy needed.

### Site sections (add/remove/reorder page sections, edit the nav menu)

The page is built from a list of sections you control from admin, not a fixed layout:
- **Hero, Project Grid, Contact, Footer** are built-in — you can toggle them on/off and reorder them, but their content is edited in the "Projects" and "Navigation, Hero & Text" areas rather than as a section itself (there's only ever one of each, so there's nothing to "add").
- **Testimonials, Stats Band, About/Text** are types you can add as many of as you like, place anywhere in the order, and fully edit or delete.

Each section has an **anchor** (e.g. `work`, `about`) — that's what nav links point to. Edit the nav menu (add/remove links, each pointing to a section's anchor, plus the top-right CTA button) under **Navigation, Hero & Text → Navigation**.

**If you set up Supabase before this feature existed**, re-run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor again — safe to run any time, it only adds what's missing.

### Photos and 3D models per project

Each project supports multiple photos (the first one is the card thumbnail) and one optional 3D model file (`.glb` or `.gltf`), rendered with a real interactive viewer (drag to rotate, scroll to zoom) instead of the wireframe icon placeholder. If a project has a 3D model, it takes priority in the viewer, with any photos available underneath as a thumbnail strip you can click through; the "● 3D" badge on a card now means there's an actual model to view, not just a manual flag.

Photos and models upload directly from your browser to Supabase Storage (not through Vercel), so there's no practical size limit from the app's side — just keep GLB files reasonably optimized (well under 50MB) for fast loading on the live site. If you need to convert or compress a 3D model, [gltf.report](https://gltf.report) or Blender's glTF export are good free options.

**If you set up Supabase before this feature existed**, re-run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor — it's safe to run again any time (it only adds what's missing and migrates your existing photo into the new gallery format automatically).

### Dashboard, Leads, Bookings & basic analytics

The admin panel now works like a lightweight version of a Shopify-style dashboard for the site:
- **Leads** — every contact form submission lands here automatically, with the sender's name/email/brief and their requested call slot if they picked one. Mark a lead **REPLIED** once you've followed up, reply directly via the **REPLY** mailto link, or delete it.
- **Bookings** — every confirmed call (from the schedule panel + contact form flow) shows up here, marked **UPCOMING** or **PAST**, with a mailto link to the person who booked. These are also real events in your Cal.com calendar — this is just a browsable record alongside your other site data.
- **Dashboard** (the `/admin` home page) — an Overview with new-lead and upcoming-call counts (click through to the full list), site visits over the last 7/30 days, a 14-day daily traffic chart, and your 5 most-viewed projects.

Visit tracking is minimal and self-hosted — no cookies, no third-party analytics, just a page path and timestamp logged per page load (and per project detail view) into your own Supabase project.

**If you set up Supabase before this feature existed**, re-run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor again — it adds the new `leads`, `bookings`, and `page_views` tables and is safe to run any time.
