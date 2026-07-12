# KidsCode 🚀

A mobile-friendly web app that trains kids to **think like programmers** through
mini-games — in **English** and **Bahasa Indonesia**. Writing real code is the
grand finale, after the logic foundations are in place.

Deploys as a **fully static site** on the **Firebase free (Spark) plan**:
Firebase Hosting serves the static export, Firebase Authentication handles
Google sign-in, and Cloud Firestore syncs progress — all from the browser, no
server.

## The journey

Levels are grouped into themed **worlds** (Duolingo-style chapters). The learn
page shows a "continue where you left off" card, paginated world jump chips
(5 per page, opening on the active world), and an accordion of world cards —
finished worlds collapse to a 🏆 row, only the active world is expanded,
future worlds show a locked header. The layout stays short no matter how many
worlds are added.

| World | Theme | Levels (concepts) |
|-------|-------|-------------------|
| 1 🤖 Robo Basics | First steps | Sequencing · Precise commands · Patterns |
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

Everything is **free** — there is no pricing, no paywall, no accounts required
to play.

- **Anonymous play**: everything is playable without an account. Progress lives
  in localStorage with a "start over" reset button.
- **Progression lock**: a world only opens once the previous one is 100%
  finished — gentle pacing for everyone, so the map reads like a learning path.

## Accounts & progress sync

Google sign-in is **optional**, via **Firebase Authentication** (client SDK,
`signInWithPopup`). Signing in lets progress sync across devices: completed
games are stored in **Cloud Firestore** at `users/{uid}`, guarded by security
rules so a user can only touch their own document. Local progress is scoped
**per account** in localStorage, so multiple accounts on one browser never leak
into each other; progress made before signing in is adopted by the account once
at sign-in, then cleared locally.

If the `NEXT_PUBLIC_FIREBASE_*` env vars aren't set, sign-in is simply hidden
and the app runs as anonymous localStorage-only play.

## Tech stack

| Concern        | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router) + TypeScript, **static export**       |
| Styling        | Tailwind CSS v4 (mobile-first)                                |
| i18n           | next-intl, **client-side** locale (localStorage), no URL prefix, EN/ID toggle |
| Auth           | Firebase Authentication + Google (client SDK)                 |
| Data           | Cloud Firestore (`users/{uid}` progress doc)                  |
| Hosting        | Firebase Hosting (free/Spark plan)                            |

## Getting started

```bash
npm install
cp .env.example .env.local     # optional: fill in Firebase config (see below)
npm run dev
```

Open http://localhost:3000. Without Firebase config the app runs fine as
anonymous play; add the config to enable Google sign-in + cross-device sync.

### Environment

Public Firebase web config, from the Firebase console → Project settings →
General → "Your apps" (see [.env.example](.env.example)). These `NEXT_PUBLIC_*`
values ship to the browser by design; access is guarded by Firestore security
rules, not by keeping them secret.

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Deploying to Firebase (free plan)

1. Create a Firebase project (free/Spark plan) at https://console.firebase.google.com.
2. **Authentication** → enable the **Google** sign-in provider. Under
   Authentication → Settings → Authorized domains, add your hosting domain and
   `localhost`.
3. **Firestore Database** → create a database (production mode).
4. Put the web config values into `.env.local` (see above).
5. Set your project id in [.firebaserc](.firebaserc) (replace
   `your-firebase-project-id`).
6. Install the CLI and log in: `npm i -g firebase-tools && firebase login`.
7. Deploy:

   ```bash
   npm run deploy            # = next build && firebase deploy
   # or, rules only:
   firebase deploy --only firestore:rules
   ```

`next build` emits the static site to `out/`; `firebase.json` points Hosting at
it (`cleanUrls` for prefix-less routes) and ships the Firestore rules.

## Production TODOs

- **Runner hardening** — the code runner guards against output floods, but an
  output-less `while(true)` can still freeze the tab; move execution into a Web
  Worker with a timeout.

## Project structure

```
firebase.json            Hosting (public: out, cleanUrls) + Firestore config
firestore.rules          users/{uid}: owner-only read/write
messages/                en.json, id.json — all UI strings (bilingual)
src/
  app/                   pages: home, learn, learn/[gameId], profile, terms, privacy
  components/games/      Order/Robot/Pattern/Choice/Debug game engines + GameHost
  components/            Navbar, HomeCtas, LearnPath (world map), GameView, CodeRunner,
                         ProfileView, ResetProgress, Footer,
                         LocaleProvider (client i18n), AuthProvider (Firebase auth)
  lib/curriculum/        types + index (auto-numbering) + worlds/*.ts (one file per world)
  lib/ranks.ts           XP + rank thresholds
  lib/firebase.ts        Firebase app/auth/Firestore init (config-optional)
  lib/cloudProgress.ts   Firestore progress read/write helpers
  lib/useAccess.ts       access rules: progression lock, Firestore + local merge
  lib/progress.ts        per-account localStorage progress store
```
