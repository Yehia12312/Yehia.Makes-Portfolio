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

Visit `yoursite.com/admin`, log in with `ADMIN_PASSWORD`, and you'll see:
- **Projects** — add, edit, delete, and reorder (↑/↓) projects, including uploading a real photo per project (replaces the wireframe icon on the card and in the detail view).
- **Hero & Text** — the headline, subtext, stats, and all 7 brand colors (background, panels, text, accent orange, verified teal).

Changes save immediately and show up on the live site on the next page load — no redeploy needed.
