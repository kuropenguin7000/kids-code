export type L10n = {
  en: string;
  id: string;
};

type GameBase = {
  id: string;
  emoji: string;
  title: L10n;
  /** Short, kid-friendly explanation of what to do. */
  instructions: L10n;
};

/** Tap the cards in the correct order (sequencing). */
export type OrderGame = GameBase & {
  kind: "order";
  /** Items listed in the CORRECT order; the UI shuffles them. */
  items: { emoji: string; text: L10n }[];
};

/** Program a robot with movement blocks to reach the goal (commands/loops). */
export type RobotGame = GameBase & {
  kind: "robot";
  cols: number;
  rows: number;
  start: { x: number; y: number };
  goal: { x: number; y: number };
  walls: { x: number; y: number }[];
  /** Available command blocks; times > 1 makes it a "repeat" block. */
  palette: { dx: number; dy: number; times: number }[];
  /** Max number of blocks allowed (forces precision / loop use). */
  maxBlocks: number | null;
};

/** Pick what comes next in the sequence (patterns). */
export type PatternGame = GameBase & {
  kind: "pattern";
  sequence: string[];
  options: string[];
  answer: string;
};

/** "If this, then that" scenario with one correct choice (conditionals). */
export type ChoiceGame = GameBase & {
  kind: "choice";
  scenario: L10n;
  options: { emoji: string; text: L10n }[];
  correctIndex: number;
};

/** Find the wrong step, then pick the fix (debugging). */
export type DebugGame = GameBase & {
  kind: "debug";
  steps: { emoji: string; text: L10n }[];
  wrongIndex: number;
  fixOptions: { emoji: string; text: L10n }[];
  correctFixIndex: number;
};

/** Type and run real JavaScript (final level). */
export type CodeGame = GameBase & {
  kind: "code";
  intro: L10n;
  hint: L10n;
  starterCode: string;
  /** If set, completed when trimmed output matches; if null, any error-free run wins. */
  expectedOutput: string | null;
};

export type Game =
  OrderGame | RobotGame | PatternGame | ChoiceGame | DebugGame | CodeGame;

export type Level = {
  id: string;
  number: number;
  emoji: string;
  color: string;
  title: L10n;
  description: L10n;
  games: Game[];
};

/** A themed chapter grouping a handful of levels (Duolingo-style unit). */
export type World = {
  id: string;
  number: number;
  emoji: string;
  color: string;
  title: L10n;
  description: L10n;
  levels: Level[];
};

/**
 * Authoring shapes for the files in `worlds/`: identical to Level/World but
 * WITHOUT `number` — world and level numbers are assigned automatically from
 * position when `index.ts` assembles the curriculum, so inserting a world
 * never requires renumbering anything.
 */
export type LevelDef = Omit<Level, "number">;

export type WorldDef = Omit<World, "number" | "levels"> & {
  levels: LevelDef[];
};
