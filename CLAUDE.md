@AGENTS.md

# Project summary (session history)

KidsCode — a mobile-friendly web app teaching kids to think like programmers
through mini-games, built from scratch in this repo. English + Bahasa
Indonesia. **Everything is free** and every world is unlocked (subject only to
sequential progression). Current scale (post-trim #14 + 3D revamp #15):
**1 world × 3 levels × 5 games = 15 games, all 3D** (three.js) — Precise
Commands (robot-on-grid programming), Pattern Power (what comes next), and
Robo Says (watch-and-repeat memory), each with an in-level difficulty ramp.

**Current architecture (post-revamp — see decision #12):** a **static export**
(`output: 'export'`) deployed on the **Firebase free (Spark) plan**. Google
sign-in via **Firebase Authentication**, progress synced to **Cloud Firestore**
(`users/{uid}`), all client-side. **No server, no Postgres/Prisma, no `/api`
routes, no pricing.** Decision-log entries #1–#11 below describe the ORIGINAL
server-rendered build; the pieces they mention that no longer exist (NextAuth,
Prisma/Postgres, the `/api/*` routes, next-intl middleware, and the entire
pricing/pass/invoice/master-account system) were removed in #12.

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
4. **World map**: levels grouped into 20 themed worlds of 3 levels × 3 games
   each (Robo Basics, Logic Land, Builder Bay, Puzzle Peaks, Data Depths,
   Robot Rally, Detective District, Pattern Palace, Logic Legends, Box
   Warehouse, Spy Academy, Game Studio, Pixel Painter, Treasure Hunters,
   Melody Makers, Robot Brains, Sorting Station, Number Ninjas, Nesting Nook,
   Code Castle — the real-code finale always stays last; insert new worlds
   before it) so the learn page scales to 100+ levels: continue-card,
   sequential unlock ("finish previous world to enter"), and paginated world
   chips + cards (see #11).
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
   badge + expiry date, XP/ranks (10 named ranks in `src/lib/ranks.ts`, +10 XP
   per game; thresholds spread evenly across all 180 games — 200 XP/rank — so
   the top rank lands on the final game; rescale when the game count changes).
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
11. **World-list UX at 20 worlds** (avoid one giant scroll): on the learn page
    the world chips AND the world cards below now paginate TOGETHER, 5 worlds
    per page (`WORLDS_PER_PAGE` in `LearnPath.tsx`; both slice by
    `visibleChipPage`, which defaults to the page holding the active world).
    Home page's "learning path" is a compact responsive grid of world tiles
    (was 20 tall descriptive rows). Profile "My progress" pager is a compact
    `‹ 3 / 10 ›` (prev/next + "current / total"), not a button-per-page row.
    "Back to my path" from a game returns to the world you were PLAYING, not
    the first-unfinished one: `GameView` links to `/learn?world=<id>` and
    `LearnPath` reads it via `useSearchParams` (learn page wraps `LearnPath`
    in `<Suspense>`) to focus + scroll to that world.
12. **Firebase free-plan revamp + remove pricing + unlock all games** (owner
    asked to deploy on the Firebase free/Spark plan, which serves STATIC assets
    only — SSR needs the paid Blaze plan). The app became a static export and
    all server logic moved to Firebase client SDKs:
    - **Build**: `next.config.ts` → `output: 'export'`, `images.unoptimized`.
      `next build` emits `out/`. Deploy with `npm run deploy`
      (`next build && firebase deploy`). Config: `firebase.json`
      (hosting `public: out`, `cleanUrls`), `.firebaserc` (project id
      placeholder), `firestore.rules` (owner-only `users/{uid}`),
      `firestore.indexes.json`.
    - **Auth**: NextAuth/Prisma/Postgres **deleted**. Google sign-in now via
      Firebase Auth client SDK — `src/lib/firebase.ts` (config-optional: no env
      → sign-in hidden, anonymous play still works), `src/components/AuthProvider.tsx`
      (`useAuth()` → `{ enabled, user, loading, signInWithGoogle, signOut }`).
    - **Data**: Firestore `users/{uid} = { completed: string[] }` via
      `src/lib/cloudProgress.ts` (`arrayUnion`). Replaces `/api/me` +
      `/api/progress`. `useAccess` merges Firestore (signed-in) with the
      per-account localStorage store; still adopts anonymous progress at sign-in
      then clears it. Owner-scope key is now the Firebase `uid`.
    - **i18n**: middleware (`proxy.ts`) and the whole `src/i18n/` routing layer
      **deleted**; `[locale]` route segment flattened into `src/app/*`. Locale
      is now fully client-side: `src/components/LocaleProvider.tsx` imports both
      message bundles and swaps them in-memory (no reload), stored in
      `localStorage` (`kidscode-locale`), default `en`, `timeZone` set to
      `Asia/Jakarta` (silences next-intl's ENVIRONMENT_FALLBACK). Clean URLs
      kept (no `/en` `/id`). `@/i18n/navigation` imports replaced with plain
      `next/link` + `next/navigation`. Translation-using server components
      (home, learn page, `LegalDoc`, layout footer→`Footer.tsx`) became client
      components so they react to the toggle.
    - **Pricing removed / games unlocked**: deleted `PricingCards`,
      `TrialBanner`, `src/lib/pricing.ts`, `src/lib/invoice.ts`,
      the pricing/refund pages, and the `pricing`/`trial`
      message namespaces + `legal.refund`. `useAccess.worldLockReason` returns
      only `"progress" | null` — no premium paywall, no subscription concept.
      Legal copy reworded to "free, no payments".
13. **Master account for testing** (re-added after #12): `src/lib/config.ts`
    (`MASTER_EMAILS` = `ctlvechocolatoz@gmail.com`, `isMasterEmail()`).
    `useAccess` computes `isMaster` from the signed-in Firebase email and
    `worldLockReason` returns `null` for it — every world/game is immediately
    playable, bypassing the sequential progression lock. Profile shows a
    `👑 Master` badge (`profile.master`). Requires signing in as that Google
    account (needs Firebase configured); regular players still unlock worlds
    one at a time.
14. **Curriculum trim for the games revamp** (owner likes the robot + pattern
    game styles and wants to rework how games work): deleted world files 02–20
    and Robo Basics' "Step by Step" order level, keeping only "Precise
    Commands" (3 robot games) + "Pattern Power" (3 pattern games) — 6 games
    total. Ranks rescaled to 4 (0/20/40/60 XP: Curious Egg, Robot Rookie,
    Pattern Pro, True Programmer) per the "top rank lands on the final game"
    convention. Home feature copy made count-agnostic. The 6 game ENGINES and
    curriculum types were deliberately kept (order/choice/debug/CodeRunner are
    currently unused) so the revamp can reuse them; deleted worlds are
    recoverable from git history (last full commit before trim: `ede158e`).
15. **3D games revamp** (owner asked for 3D + animation, fun for ~5-year-olds,
    minimal reading, no typing): added `three` + `@react-three/fiber` (client
    canvas only, works in the static export). Levels grew to 5 games each with
    an in-level difficulty ramp:
    - **RobotGameView** (level 1): 3D tile board, crate walls, voxel Robo that
      hops cell-to-cell facing its direction; bump-shake on crash, wobble on
      miss, confetti + dance on win. Games ramp to a 6×4 labyrinth whose
      7-block limit forces the ×2/×3 repeat blocks (first loops).
    - **PatternGameView** (level 2): "pattern parade" — emoji sprites (canvas
      textures) bob on pedestals; the picked answer drops in with a bounce
      (right → confetti + staggered wave; wrong → head-shake + tumble away).
      Ramp: AB → AAB → ABB → ABC → ABAC.
    - **MemoryGameView** (level 3, NEW `memory` game kind in
      `curriculum/types.ts` + GameHost case): Simon-style "Robo Says" — Robo
      drums a song on glowing pads, kid taps it back. Zero-reading design:
      demo IS the instruction, emoji-only hints (👀👉🙈🎉) + progress dots
      (2 tiny i18n strings `game.watch`/`yourTurn`/`watchAgain`). Wrong tap
      just replays the song. Ramp: 2 pads/2 beats → 4 pads/6 beats with a
      double beat.
    - **ARCHITECTURE RULE for all 3D engines**: game outcomes are committed by
      wall-clock `setTimeout`s in the React layer; `useFrame` renders poses as
      pure functions of `performance.now()` elapsed. Never gate outcomes on
      rAF — throttled/background tabs suspend it and would wedge the game.
    - Shared module `src/components/games/three-shared.tsx`: `Confetti`
      (instanced, time-parametric), `RobotMeshes` (the Robo character),
      `getTextTexture` (cached canvas emoji sprites), `lerpAngle`,
      `useCanvasReady` (SSR guard + resize nudge for embedded webviews).
    - Ranks rescaled to 6 (0..150 XP, 30/rank): Egg, Hatchling, Robot Rookie,
      Pattern Pro, 🧠 Memory Wizard, True Programmer.

16. **Full-screen game pages + win popup** (owner: next-button below the game
    forced scrolling; game screen should fit the viewport): game routes
    (`/learn/<gameId>`) are now "app mode" — `Navbar`/`Footer` return `null`
    when `usePathname()` matches `/^\/learn\/[^/]+/`, and `GameView` renders a
    `fixed inset-0` overlay with a compact one-row header (back arrow button,
    emoji, level+title, and — once the game is done — an always-visible
    Next/Back pill). Winning opens a celebration modal (🎉 + success + "+10 XP"
    + primary Next-game button) after a 1.6 s `setTimeout` so the in-game
    confetti/dance plays first; Escape/backdrop/✕ dismiss it (new `lesson.close`
    string EN/ID). The 3D canvas containers use viewport-relative heights
    (`h-[clamp(...,30-40dvh,...)]` per engine) so all games fit without
    scrolling down to 375×667. Gotchas fixed along the way: client-side nav
    between games REUSES the GameView/engine component instances, so per-game
    UI state resets on `gameId` change and `GameHost` is keyed by `game.id`
    (engines get fresh state on Next).

17. **Robot-game themes + Robo evolution + modern blocks** (owner: arrows too
    plain; wants a fresh look per game and a robot that VISIBLY evolves, not a
    palette swap; wide boards looked too small): command blocks are SVG arrows
    (`ArrowIcon`/`BlockFace` in `RobotGameView.tsx`) on gradient tiles —
    violet→fuchsia for single steps, amber→orange for ×2/×3 repeat blocks so
    loops read as special. Each robot game has a world `Theme` (frame gradient
    + canvas-generated tile/wall TEXTURES via `getPatternTexture` in
    `three-shared.tsx` — grass/waves/sand/ice/candy tiles, wood/coral/brick/
    ice/stripe walls — plus a ground disc, 4 emoji corner `Decorations`, and
    animated `SkySprites`: drifting clouds / rising bubbles / falling snow /
    twinkling stars; positions are pure functions of wall time). THEMES:
    meadow → ocean → desert → snow → candy night. `RobotMeshes` `stage` (0–4)
    is a structural evolution — silhouette changes and Robo grows
    (`ROBOT_SCALE`): 0 treads+1 antenna → 1 jetpack+twin antennas+smile →
    2 LEGS+helmet dome+claw hands+badge → 3 HOVERS on a glow disc, glowing
    visor face, back fins, shoulder lights → 4 bigger gold champion with wide
    wings, crown, pulsing chest core (float/pulse animate off the render
    clock, visual only). Stage/theme = the game's index among robot games, so
    finishing a game always reveals a new world + upgraded Robo. `CameraRig`
    frames the board for the canvas' CURRENT aspect (tilt-foreshortened depth
    vs width), so the 6×4 labyrinth fills a wide canvas instead of shrinking.
    All hand-rolled three.js — no new deps.

18. **Themes extended to levels 2–3** (owner: same treatment for pattern +
    memory): the theme system moved to `three-shared.tsx` as `WorldTheme` /
    `WORLD_THEMES` / `SkySprites` / `Decorations` (generalized to
    `width`/`depth` props instead of the robot game's cols/rows) and all three
    engines consume it. Theme index = the game's position among games of its
    kind, so every level replays the meadow → ocean → desert → snow → candy
    night arc. `PatternGameView` themes its frame, floor (pattern texture),
    pedestals, and ground disc; `MemoryGameView` does the same and passes the
    game index as the `stage` prop to `RoboBuddy`/`RobotMeshes`, so the
    drummer Robo evolves through level 3 (rookie → champion) just like the
    robot level.

## Working conventions & gotchas

- **Verify in the browser** after changes (preview tools); the owner tests on
  their side and asked that the dev server be SHUT DOWN when Claude finishes —
  they run `npm run dev` themselves. (The old Postgres container is now unused;
  there is no database.)
- **Static-export constraints**: no server. No cookies, middleware, rewrites,
  `/api` route handlers reading the request, `next/image` default loader, or
  `dynamicParams: true`. Every dynamic route needs `generateStaticParams`
  (`learn/[gameId]` prebuilds one page per game). Build with `npm run build`
  (emits `out/`); a build error is the main signal you broke a constraint.
- **Firebase is config-optional**: without `NEXT_PUBLIC_FIREBASE_*` set, sign-in
  is hidden and the app is anonymous localStorage-only — so most work is
  verifiable in dev without credentials. Testing the live Auth/Firestore path
  needs a real Firebase project + those env vars.
- Trial/test residue: bump the localStorage key version
  (`src/lib/progress.ts`) if test data must be invalidated for all browsers.
- **After adding/renaming game ids**: a running dev server keeps the old
  `generateStaticParams` list (`dynamicParams: false`) and 404s new
  `/learn/<id>` routes — `touch src/app/learn/[gameId]/page.tsx` (or restart)
  to force a recompile.
- **Testing the 3D games in the embedded preview pane**: the pane suspends
  `requestAnimationFrame` (≈1 tick) and `computer screenshot` times out, so
  verify BEHAVIORALLY via javascript_tool (click → wait wall-clock duration →
  assert DOM/localStorage). Synthetic clicks in one JS task hit stale React
  closures — space them with `await sleep(80+)` between clicks.
- PowerShell eats `[brackets]` in paths (use `-LiteralPath`); prefer the Bash
  tool (Git Bash) for globby paths like `src/app/learn/[gameId]`.
- Messages: every UI string lives in `messages/en.json` + `messages/id.json`;
  game/lesson content is bilingual inline in `src/lib/curriculum/worlds/*.ts` (`L10n` type).

## Outstanding work

- Deploy prerequisites the owner must do in the Firebase console: create a
  Spark-plan project, enable the Google auth provider (+ add hosting domain and
  `localhost` to Authorized domains), create Firestore, fill `.env.local` and
  the project id in `.firebaserc`.
- Move the code runner into a Web Worker with a timeout (an output-less
  `while(true)` can freeze the tab).
- Games revamp in progress: levels 1–3 are done (3D robot / pattern / memory,
  5 games each). Owner may want a level 4 next — proposed idea: sorting/
  conditionals ("feed the right monster"). New levels go in
  `src/lib/curriculum/worlds/01-robo-basics.ts`; new worlds = a file in
  `worlds/` inserted in `index.ts` (the world-map UI scales to 20+ worlds).
  Remember to rescale `src/lib/ranks.ts` when the game count changes.
- Polish ideas for the 3D games: sound (WebAudio blips on pad flashes/taps —
  no assets needed, must start after a user gesture), camera/color tuning.
