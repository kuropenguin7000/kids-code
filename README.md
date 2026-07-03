# KidsCode 🚀

A mobile-friendly web app that trains kids to **think like programmers** through
mini-games — in **English** and **Bahasa Indonesia**. Writing real code is the
grand finale, after the logic foundations are in place.

## The journey

Levels are grouped into themed **worlds** (Duolingo-style chapters). The learn
page shows a "continue where you left off" card, world jump chips, and an
accordion of world cards — finished worlds collapse to a 🏆 row, only the
active world is expanded, future worlds show a locked header. The layout stays
short no matter how many worlds are added.

| World | Theme | Levels (concepts) |
|-------|-------|-------------------|
| 1 🤖 Robo Basics *(free)* | First steps | Sequencing · Precise commands · Patterns |
| 2 🧠 Logic Land | Thinking tools | Loops · Conditionals (if/then) · Debugging |
| 3 🏗️ Builder Bay | Building blocks | Variables · Decomposition · Functions |
| 4 🏰 Code Castle | The finale | Real JavaScript in an in-browser editor |

30 games total across 6 game engines: tap-in-order, robot-on-a-grid (arrow +
repeat blocks), pattern completion, if/then scenarios, find-the-bug, and a
kid-friendly JS code runner. Each completed game gives **+10 XP**; ranks climb
from 🥚 Curious Egg to 👑 True Programmer (10 ranks, one per 30 XP).

## Access model

- **Free**: World 1 (9 games) is fully playable, no account needed. Anonymous
  progress lives in localStorage with a "start over" reset button.
- **Progression lock**: a world only opens once the previous one is 100%
  finished — pacing for everyone, not a paywall.
- **Subscription** (Rp 49.000/month or Rp 399.000/year, shown in Rupiah in both
  languages): unlocks Worlds 2+. Subscriptions carry an expiry date
  (`currentPeriodEnd`); once past it the account automatically behaves as a
  free account again (checked on every request, no cron needed). Subscribers
  don't see the Pricing menu or "play free" wording.
- **Master account**: emails in `MASTER_EMAILS`
  ([src/lib/config.ts](src/lib/config.ts)) — currently
  `ctlvechocolatoz@gmail.com` — bypass both lock types and get a 👑 badge.

The profile page (`/profile`) shows the account, plan badge with its expiry
date, rank/XP, and per-level progress. Signing in redirects to the home page.

## Accounts & progress sync

Google sign-in (NextAuth v5, Prisma adapter, database sessions). Signed-in
progress is stored in PostgreSQL; local progress is scoped **per account** in
localStorage, so multiple accounts on one browser never leak into each other.
Progress made before signing in is adopted by the account once at sign-in,
then cleared locally.

## Tech stack

| Concern        | Choice                                          |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 16 (App Router) + TypeScript            |
| Styling        | Tailwind CSS v4 (mobile-first)                  |
| i18n           | next-intl — locale in a cookie, no `/en` URL prefix, EN/ID toggle |
| Auth           | NextAuth v5 + Google, Prisma adapter            |
| Database       | PostgreSQL 16 (Docker) + Prisma 7               |

## Getting started

```bash
npm install
docker compose up -d          # PostgreSQL on host port 5434
npx prisma migrate dev        # create/update tables (also regenerates client)
npm run dev
```

Open http://localhost:3000.

### Environment

- `.env` — `DATABASE_URL` (already points at the Docker Postgres on port 5434)
- `.env.local` — `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`

### Google sign-in setup

1. Create OAuth credentials at https://console.cloud.google.com/apis/credentials
   (type: Web application).
2. Add redirect URI `http://localhost:3000/api/auth/callback/google`.
3. Fill `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` in `.env.local` and restart the
   dev server.

## Production TODOs

- **Payments** — `/api/subscribe` records the plan and stamps
  `currentPeriodEnd` directly (demo checkout). Replace with Midtrans/Xendit/
  Stripe; their payment/renewal webhooks should be what sets
  `currentPeriodEnd`.
- **Runner hardening** — the code runner guards against output floods, but an
  output-less `while(true)` can still freeze the tab; move execution into a Web
  Worker with a timeout.

## Project structure

```
docker-compose.yml       PostgreSQL 16 (host port 5434)
prisma/schema.prisma     NextAuth tables + Subscription (plan, expiry) + GameProgress
messages/                en.json, id.json — all UI strings
src/
  app/[locale]/          pages: home, learn, learn/[gameId], pricing, profile
  app/api/               auth, me, progress, subscribe route handlers
  components/games/      Order/Robot/Pattern/Choice/Debug game engines + GameHost
  components/            Navbar, HomeCtas, LearnPath (world map), GameView, CodeRunner,
                         PricingCards, ProfileView, TrialBanner, ResetProgress, ...
  lib/curriculum.ts      worlds → levels → games (bilingual content)
  lib/ranks.ts           XP + rank thresholds
  lib/config.ts          FREE_WORLDS, MASTER_EMAILS
  lib/useAccess.ts       access rules: premium/progression locks, DB + local merge
  lib/progress.ts        per-account localStorage progress store
  proxy.ts               locale-routing middleware (cookie-based, no URL prefix)
```
