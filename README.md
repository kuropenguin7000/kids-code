# KidsCode 🚀

A mobile-friendly web app that trains kids to **think like programmers** through
mini-games — in **English** and **Bahasa Indonesia**. Writing real code is the
grand finale, after the logic foundations are in place.

## The journey

Levels are grouped into themed **worlds** (Duolingo-style chapters). The learn
page shows a "continue where you left off" card, paginated world jump chips
(5 per page, opening on the active world), and an accordion of world cards —
finished worlds collapse to a 🏆 row, only the active world is expanded,
future worlds show a locked header. The layout stays short no matter how many
worlds are added.

| World | Theme | Levels (concepts) |
|-------|-------|-------------------|
| 1 🤖 Robo Basics *(free)* | First steps | Sequencing · Precise commands · Patterns |
| 2 🧠 Logic Land | Thinking tools | Loops · Conditionals (if/then) · Debugging |
| 3 🏗️ Builder Bay | Building blocks | Variables · Decomposition · Functions |
| 4 🏔️ Puzzle Peaks | Combining rules | AND/OR/NOT rules · Loop mastery · Algorithms |
| 5 🌊 Data Depths | Data wizardry | Sorting · Grouping · True/false |
| 6 🏎️ Robot Rally | Maze mastery | Harder mazes · Efficiency · The Grand Prix |
| 7 🕵️ Detective District | Bug hunting | Pattern clues · Plan inspection · Hidden rules |
| 8 🏛️ Pattern Palace | Deeper patterns | Double patterns · Number machines · Abstraction |
| 9 🦸 Logic Legends | Mental execution | Tracing loops/variables/ifs · Mixed challenges · Code thinking |
| 10 📦 Box Warehouse | Data structures | Stacks · Queues · Lists |
| 11 🕵️ Spy Academy | Ciphers | Secret symbols · Number codes · Cracking rules |
| 12 🎮 Game Studio | Events | When-then events · The game loop · Level design |
| 13 🎨 Pixel Painter | Nested loops | Rows of color · Grids · Pixel art |
| 14 🗺️ Treasure Hunters | Search & strategy | Smart search · Best path · Following clues |
| 15 🎵 Melody Makers | Music & loops | Note sequences · Looping beats · Composing |
| 16 🧠 Robot Brains | Decision trees | Sensors · Decision trees · If-else chains |
| 17 📊 Sorting Station | Sort algorithms | Compare two · Bubble sort · Sort master |
| 18 🥷 Number Ninjas | Math operators | Operators · Comparisons · Order of steps |
| 19 🪆 Nesting Nook | Recursion | Nesting · Repeat smaller · Fractals |
| 20 🏰 Code Castle | The finale | Real JavaScript in an in-browser editor |

New worlds are inserted before Code Castle — the real-code finale always stays
the last world.

180 games total (20 worlds × 3 levels × 3 games) across 6 game engines:
tap-in-order, robot-on-a-grid (arrow + repeat blocks), pattern completion,
if/then scenarios, find-the-bug, and a kid-friendly JS code runner. Each
completed game gives **+10 XP**; ranks climb from 🥚 Curious Egg to 👑 True
Programmer (10 ranks spread evenly across the journey).

## Access model

- **Free**: World 1 (9 games) is fully playable, no account needed. Anonymous
  progress lives in localStorage with a "start over" reset button.
- **Progression lock**: a world only opens once the previous one is 100%
  finished — pacing for everyone, not a paywall.
- **Prepaid passes** (30-day Rp 49.000 · 1-year Rp 399.000 · lifetime
  Rp 699.000, shown in Rupiah in both languages): one-time payments that
  unlock Worlds 2+ until an expiry date (`currentPeriodEnd`) — no
  auto-renewal. Buying a pass while one is active adds the days on top;
  lifetime is modelled as a 100-year pass so all expiry checks just work.
  Once expired the account automatically behaves as a free account again
  (checked on every request, no cron needed). Pass holders don't see the
  Pricing menu or "play free" wording; the profile links to extend (hidden
  for lifetime holders).
- **Master account**: emails in `MASTER_EMAILS`
  ([src/lib/config.ts](src/lib/config.ts)) — currently
  `ctlvechocolatoz@gmail.com` — bypass both lock types and get a 👑 badge.

Every successful purchase is saved as an **invoice** (persisted in the DB).
The purchase success screen shows the invoice number with a **Download
invoice** link, and the profile page lists the full **purchase history** —
each downloadable as a standalone printable page (`GET
/api/invoice/[number]`, owner-only) that renders localized (EN/ID) via
`src/lib/invoice.ts` and prints to PDF from the browser. No email is sent.

The profile page (`/profile`) shows the account, plan badge with its expiry
date, rank/XP, paginated per-level progress, and purchase history. Signing in
redirects to the home page.

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
cp .env.example .env          # then fill in the values (see below)
docker compose up -d          # PostgreSQL on host port 5434
npx prisma migrate dev        # create/update tables (also regenerates client)
npm run dev
```

Open http://localhost:3000.

### Environment

All variables live in a single `.env` file (see [.env.example](.env.example)):

- `DATABASE_URL` — the example value already points at the Docker Postgres on
  port 5434.
- `AUTH_SECRET` — generate with `npx auth secret`.
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — see below.

### Google sign-in setup

1. Create OAuth credentials at https://console.cloud.google.com/apis/credentials
   (type: Web application).
2. Add redirect URI `http://localhost:3000/api/auth/callback/google`.
3. Fill `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` in `.env` and restart the
   dev server.

## Production TODOs

- **Payments** — `/api/subscribe` records the purchased pass directly (demo
  checkout) and emails an invoice. Replace with a real one-time payment flow
  (Midtrans/Xendit — QRIS, e-wallets and virtual accounts all fit the
  prepaid-pass model); the verified payment webhook should be what extends
  `currentPeriodEnd` and writes the invoice.
- **Runner hardening** — the code runner guards against output floods, but an
  output-less `while(true)` can still freeze the tab; move execution into a Web
  Worker with a timeout.

## Project structure

```
docker-compose.yml       PostgreSQL 16 (host port 5434)
prisma/schema.prisma     NextAuth + Subscription (plan, expiry) + Invoice + GameProgress
messages/                en.json, id.json — all UI strings
src/
  app/[locale]/          pages: home, learn, learn/[gameId], pricing, profile
  app/api/               auth, me, progress, subscribe, invoices, invoice/[number]
  components/games/      Order/Robot/Pattern/Choice/Debug game engines + GameHost
  components/            Navbar, HomeCtas, LearnPath (world map), GameView, CodeRunner,
                         PricingCards, ProfileView, TrialBanner, ResetProgress, ...
  lib/curriculum/        types + index (auto-numbering) + worlds/*.ts (one file per world)
  lib/ranks.ts           XP + rank thresholds
  lib/pricing.ts         canonical pass amounts (Rupiah) + formatter
  lib/invoice.ts         bilingual printable invoice HTML builder (EN/ID)
  lib/config.ts          FREE_WORLDS, MASTER_EMAILS
  lib/useAccess.ts       access rules: premium/progression locks, DB + local merge
  lib/progress.ts        per-account localStorage progress store
  proxy.ts               locale-routing middleware (cookie-based, no URL prefix)
```
