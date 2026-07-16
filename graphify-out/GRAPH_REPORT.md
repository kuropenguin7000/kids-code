# Graph Report - .  (2026-07-16)

## Corpus Check
- Corpus is ~40,227 words - fits in a single context window. You may not need a graph.

## Summary
- 261 nodes · 480 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Curriculum & World Data
- Access, Progress & Learn Flow
- Layout, Nav & i18n Shell
- TypeScript Config
- Game Engines
- Runtime Dependencies
- Dev Dependencies & Tooling
- Firebase Auth & Static Export
- localStorage Progress Store
- Legal Pages
- ESLint Config
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `WorldDef` - 22 edges
2. `useAccess()` - 22 edges
3. `compilerOptions` - 16 edges
4. `findGame()` - 10 edges
5. `LearnPath()` - 8 edges
6. `include` - 7 edges
7. `Firestore Progress Sync` - 7 edges
8. `Six Game Engines` - 7 edges
9. `scripts` - 6 edges
10. `isWorldCompleted()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `XP & Ranks` --references--> `LearnPath()`  [INFERRED]
  README.md → src/components/LearnPath.tsx
- `Static-export Constraints` --references--> `nextConfig`  [INFERRED]
  AGENTS.md → next.config.ts
- `Sequential Progression Lock` --references--> `isWorldCompleted()`  [INFERRED]
  CLAUDE.md → src/lib/curriculum/index.ts
- `Per-account localStorage Progress` --references--> `getProgress()`  [INFERRED]
  CLAUDE.md → src/lib/progress.ts
- `XP & Ranks` --references--> `rankForXp()`  [EXTRACTED]
  README.md → src/lib/ranks.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Firebase Static Architecture** — claude_static_export, claude_firebase_auth, claude_firestore_sync, claude_client_i18n [INFERRED 0.85]

## Communities (12 total, 3 thin omitted)

### Community 0 - "Curriculum & World Data"
Cohesion: 0.10
Nodes (27): curriculum, worldDefs, CodeGame, GameBase, Level, LevelDef, WorldDef, world (+19 more)

### Community 1 - "Access, Progress & Learn Flow"
Cohesion: 0.10
Nodes (30): Firestore Progress Sync, Free Access (no pricing), Master Account (testing bypass), Sequential Progression Lock, Curriculum Data Model, XP & Ranks, GamePage(), Props (+22 more)

### Community 2 - "Layout, Nav & i18n Shell"
Cohesion: 0.09
Nodes (19): Client-side i18n, fredoka, metadata, nunito, AuthButton(), useAuth(), Footer(), HomeCtas() (+11 more)

### Community 3 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 4 - "Game Engines"
Cohesion: 0.11
Nodes (19): Six Game Engines, CodeRunner(), Props, RunState, ChoiceGameView(), DebugGameView(), GameHost(), OrderGameView() (+11 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (20): firebase, next, next-intl, dependencies, firebase, next, next-intl, react (+12 more)

### Community 6 - "Dev Dependencies & Tooling"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 7 - "Firebase Auth & Static Export"
Cohesion: 0.18
Nodes (13): Static-export Constraints, Firebase Authentication (Google), Static Firebase Export, nextConfig, AuthContext, AuthContextValue, AuthProvider(), AuthUser (+5 more)

### Community 8 - "localStorage Progress Store"
Cohesion: 0.25
Nodes (15): Per-account localStorage Progress, clearProgress(), emitChange(), EMPTY, getProgress(), listeners, markCompleted(), markStarted() (+7 more)

## Knowledge Gaps
- **74 isolated node(s):** `eslintConfig`, `name`, `version`, `private`, `dev` (+69 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAccess()` connect `Access, Progress & Learn Flow` to `localStorage Progress Store`, `Layout, Nav & i18n Shell`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `Static Firebase Export` connect `Firebase Auth & Static Export` to `Access, Progress & Learn Flow`, `Layout, Nav & i18n Shell`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `Firestore Progress Sync` connect `Access, Progress & Learn Flow` to `localStorage Progress Store`, `Firebase Auth & Static Export`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `name`, `version` to the rest of the system?**
  _74 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Curriculum & World Data` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Access, Progress & Learn Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.10253699788583509 - nodes in this community are weakly interconnected._
- **Should `Layout, Nav & i18n Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.09462365591397849 - nodes in this community are weakly interconnected._