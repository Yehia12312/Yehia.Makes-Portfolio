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
