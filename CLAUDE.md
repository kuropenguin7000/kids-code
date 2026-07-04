@AGENTS.md

# Project summary (session history)

KidsCode — a mobile-friendly web app teaching kids to think like programmers
through mini-games, built from scratch in this repo. English + Bahasa
Indonesia. Subscription business model with prices in Rupiah.

## How it was built (decision log)

1. **Scaffold**: Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4,
   next-intl for i18n, NextAuth v5 (beta) for Google sign-in.
2. **Curriculum pivot**: originally 6 levels of type-real-code lessons; the
   owner asked for logic games FIRST (sequencing, commands, patterns, loops,
   conditionals, debugging) with real code as the finale. Games are data-driven
   from `src/lib/curriculum/` (one file per world in `worlds/`, auto-numbered by `index.ts`) with 6 engines in `src/components/games/`:
   order, robot-on-grid (arrow + repeat blocks), pattern, choice, debug, plus
   the CodeRunner (sandboxed JS with `say()`).
3. **Persistence**: PostgreSQL 16 via `docker-compose.yml` (host port **5434**
   — 5432/5433 are taken by other dev stacks on this machine) + Prisma 7.
   NextAuth uses the Prisma adapter with database sessions.
4. **World map**: levels grouped into 10 themed worlds of 3 levels × 3 games
   each (Robo Basics, Logic Land, Builder Bay, Puzzle Peaks, Data Depths,
   Robot Rally, Detective District, Pattern Palace, Logic Legends, Code
   Castle — the real-code finale always stays last; insert new worlds before
   it) so the learn page scales to 100+ levels:
   continue-card, world chips, accordion (only active world expanded),
   sequential unlock ("finish previous world to enter").
5. **Access rules** (`src/lib/useAccess.ts`):
   - Free: World 1, no account needed (anonymous progress in localStorage).
   - Lock reasons: `"premium"` (Worlds 2+ without subscription → pricing page)
     vs `"progress"` (previous world unfinished → back to /learn).
   - Master account `ctlvechocolatoz@gmail.com` (see `MASTER_EMAILS` in
     `src/lib/config.ts`) bypasses all locks.
   - Access is a prepaid pass with `currentPeriodEnd`; `/api/me` treats an
     expired one as free — automatic downgrade, no cron.
6. **Account isolation fix**: localStorage progress is scoped per account
   (`kidscode-progress-v3:<email>`); the anonymous store is synced to an
   account once at sign-in and then cleared, so a second account on the same
   browser can never inherit the first one's progress.
7. **UX polish**: no `/en`/`/id` URL prefixes (`localePrefix: "never"`, cookie
   locale), plain EN/ID toggle, Next.js dev indicator disabled, sign-in
   redirects to home (`redirectTo: "/"`; pricing flow returns to /pricing),
   subscribers see no Pricing menu or "play free" wording, profile shows plan
   badge + expiry date, XP/ranks (10 ranks, +10 XP per game, one rank per
   finished world = 90 XP).
8. **Scale pass** (100+ level prep): curriculum split into
   `src/lib/curriculum/worlds/*.ts` (one file per world; `index.ts`
   auto-numbers worlds/levels from position — no manual numbering, no slice
   indexes). Profile per-level progress paginated (6/page); learn-page world
   chips paginated (5/page, follows the active world). Layout-shift fixes:
   `scrollbar-gutter: stable` on `html`, module-level `/api/me` cache in
   `useAccess` (survives client-side navigation; cleared on sign-out),
   server-fetched session passed to `SessionProvider` (no "loading" flash on
   locale-change remounts), skeleton placeholders on first learn-page load.
9. **Pricing pivot to prepaid passes** (owner asked for a better fit than
   subscriptions — auto-renew billing is card-only in Indonesia; QRIS/
   e-wallet/VA are one-shot rails): 30-day pass Rp 49.000, 1-year pass
   Rp 399.000, lifetime Rp 699.000, one-time payments, no auto-renewal. DB
   plan values stay `"monthly"`/`"yearly"` plus `"lifetime"` (30/365/36500
   days — lifetime is a 100-year pass, no migration); buying while active
   EXTENDS `currentPeriodEnd` instead of resetting it. Pricing page shows
   active-until + "extend" buttons for pass holders (grid hidden for
   lifetime); profile links to extend. All "subscribe" wording became "get a
   pass" in both locales. Buy click opens a confirmation modal before charging
   (Escape/backdrop dismiss, blocked mid-charge). Stored `plan` is a DISPLAY
   label derived from remaining days (>30 → "yearly", else "monthly"; lifetime
   sticky), not the last top-up's tier.
10. **In-app invoices (no email)**: purchase detail is delivered in-product,
    not by email — a better fit than SMTP for a web app (no domain, no
    deliverability, always available). Every purchase writes an `Invoice` row
    (`prisma migrate` `purchase_invoices`: added `Invoice`, dropped the
    short-lived reminder columns `Subscription.locale`/`renewalRemindedAt`).
    The invoice records the tier PURCHASED (what was charged), not the stacked
    display label. `GET /api/invoices` lists the account's history (profile
    "Purchase history" section); `GET /api/invoice/[number]` returns a
    standalone printable page (owner/master only, `?locale=` EN/ID) via
    `src/lib/invoice.ts` → `renderInvoiceHtml` (has a Save-as-PDF print
    button). The pricing success screen shows the invoice number + download +
    "see all purchases". `src/lib/pricing.ts` = canonical Rupiah amounts.
    (A prior nodemailer email + renewal-reminder cron approach was removed in
    favour of this — no `src/lib/email.ts`/`reminder.ts`, no SMTP/CRON env.)

## Working conventions & gotchas

- **Verify in the browser** after changes (preview tools); the owner tests on
  their side and asked that the dev server be SHUT DOWN when Claude finishes —
  they run `npm run dev` themselves. Postgres container stays up.
- Trial/test residue: bump the localStorage key version
  (`src/lib/progress.ts`) if test data must be invalidated for all browsers.
- Prisma 7: config lives in `prisma.config.ts` (no `url` in schema
  datasource); client is generated to `src/generated/prisma` (gitignored) —
  run `npx prisma generate` if types go stale after schema changes.
- PowerShell eats `[brackets]` in paths (use `-LiteralPath`) and mangles
  quoted SQL — pipe SQL files or use Git Bash heredocs into
  `docker exec -i kidscode-db psql -U kidscode -d kidscode`.
- NextAuth session cookie is httpOnly after refresh; for testing an account
  switch, repoint the `Session.userId` row in the DB instead of the cookie.
- Real accounts in the dev DB: `ctlvechocolatoz@gmail.com` (master) and
  `ctlveccc@gmail.com` (owner's email; has a yearly subscription and progress
  rows partly contaminated by the pre-fix leak — owner hasn't asked to wipe).
- Messages: every UI string lives in `messages/en.json` + `messages/id.json`;
  game/lesson content is bilingual inline in `src/lib/curriculum/worlds/*.ts` (`L10n` type).

## Outstanding work

- Real payments (Midtrans/Xendit/Stripe): webhooks should own
  `currentPeriodEnd` and write the `Invoice` row; `/api/subscribe` is a demo
  checkout.
- Move the code runner into a Web Worker with a timeout (an output-less
  `while(true)` can freeze the tab).
- Owner plans 100+ levels: add a file in `src/lib/curriculum/worlds/` and insert it in `index.ts` before Code Castle; the
  world-map UI already scales.
