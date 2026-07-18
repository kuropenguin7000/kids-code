# Graph Report - .  (2026-07-17)

## Corpus Check
- 14 files · ~21,609 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 274 nodes · 446 edges · 14 communities (9 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.91)
- Token cost: 76,041 input · 0 output

## Community Hubs (Navigation)
- 3D Game Engines
- App Shell & Auth UI
- Learn Pages & Progression
- TypeScript Config
- Curriculum & Legacy Engines
- Runtime Dependencies
- Dev Dependencies & Tooling
- Architecture Decisions
- Progress Store
- Legal Pages
- Code Runner
- Static Export Config
- ESLint Config
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `useAccess()` - 22 edges
2. `compilerOptions` - 16 edges
3. `findGame()` - 9 edges
4. `getTextTexture()` - 8 edges
5. `include` - 7 edges
6. `useCanvasReady()` - 7 edges
7. `KidsCode App` - 7 edges
8. `LearnPath()` - 6 edges
9. `read()` - 6 edges
10. `clearProgress()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Static-export Constraints` --references--> `nextConfig`  [INFERRED]
  AGENTS.md → next.config.ts
- `useAccess()` --shares_data_with--> `Cloud Firestore Progress Sync (users/{uid})`  [EXTRACTED]
  src/lib/useAccess.ts → CLAUDE.md
- `useAccess()` --implements--> `Master Account Testing Bypass`  [EXTRACTED]
  src/lib/useAccess.ts → CLAUDE.md
- `useAccess()` --implements--> `Sequential Progression Lock`  [EXTRACTED]
  src/lib/useAccess.ts → CLAUDE.md
- `Robo Says (MemoryGameView, memory game kind)` --references--> `RobotMeshes()`  [INFERRED]
  CLAUDE.md → src/components/games/three-shared.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **3D Game Engines Sharing the Wall-Clock Architecture** — claude_robot_game, claude_pattern_game, claude_memory_game, claude_wall_clock_outcome_rule [EXTRACTED 1.00]
- **Firebase Free-Plan Client-Only Stack** — claude_firebase_spark_plan, claude_static_export, claude_firebase_auth, claude_cloud_firestore [EXTRACTED 1.00]
- **three-shared.tsx Shared 3D Utilities** — src_components_games_three_shared_confetti, src_components_games_three_shared_robotmeshes, src_components_games_three_shared_gettexttexture, src_components_games_three_shared_lerpangle, src_components_games_three_shared_usecanvasready [EXTRACTED 1.00]

## Communities (14 total, 5 thin omitted)

### Community 0 - "3D Game Engines"
Cohesion: 0.09
Nodes (33): 3D Games Revamp (three.js + react-three-fiber), Robo Says (MemoryGameView, memory game kind), Pattern Power (PatternGameView), Precise Commands (RobotGameView), Wall-Clock Outcome Architecture Rule, GameHost(), demoActivePad(), MemoryGameView() (+25 more)

### Community 1 - "App Shell & Auth UI"
Cohesion: 0.07
Nodes (28): fredoka, metadata, nunito, AuthButton(), AuthContext, AuthContextValue, AuthProvider(), AuthUser (+20 more)

### Community 2 - "Learn Pages & Progression"
Cohesion: 0.11
Nodes (24): Master Account Testing Bypass, Sequential Progression Lock, GamePage(), Props, GameView(), LearnPath(), WorldState, ProfileView() (+16 more)

### Community 3 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 4 - "Curriculum & Legacy Engines"
Cohesion: 0.14
Nodes (18): OrderGameView(), shuffled(), worldDefs, ChoiceGame, CodeGame, DebugGame, Game, GameBase (+10 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.08
Nodes (24): firebase, next, next-intl, dependencies, firebase, next, next-intl, react (+16 more)

### Community 6 - "Dev Dependencies & Tooling"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 7 - "Architecture Decisions"
Cohesion: 0.13
Nodes (18): Per-Account localStorage Progress Isolation, Client-Side i18n (LocaleProvider), Cloud Firestore Progress Sync (users/{uid}), CodeRunner (sandboxed JS engine), Config-Optional Firebase, Data-Driven Curriculum (worlds/ + auto-numbering), Firebase Authentication (Google Sign-in), Firebase Free (Spark) Plan Constraint (+10 more)

### Community 8 - "Progress Store"
Cohesion: 0.27
Nodes (14): clearProgress(), emitChange(), EMPTY, getProgress(), listeners, markCompleted(), markStarted(), parseProgress() (+6 more)

## Knowledge Gaps
- **90 isolated node(s):** `eslintConfig`, `config`, `fredoka`, `nunito`, `metadata` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAccess()` connect `Learn Pages & Progression` to `Progress Store`, `App Shell & Auth UI`, `Architecture Decisions`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Cloud Firestore Progress Sync (users/{uid})` connect `Architecture Decisions` to `Learn Pages & Progression`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `KidsCode App` connect `Architecture Decisions` to `3D Game Engines`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `config`, `fredoka` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `3D Game Engines` be split into smaller, more focused modules?**
  _Cohesion score 0.09413067552602436 - nodes in this community are weakly interconnected._
- **Should `App Shell & Auth UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06968641114982578 - nodes in this community are weakly interconnected._
- **Should `Learn Pages & Progression` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._