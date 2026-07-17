import type { Game, Level, World, WorldDef } from "./types";
import { world as roboBasics } from "./worlds/01-robo-basics";

export type {
  L10n,
  Game,
  OrderGame,
  RobotGame,
  PatternGame,
  MemoryGame,
  ChoiceGame,
  DebugGame,
  CodeGame,
  Level,
  World,
  LevelDef,
  WorldDef,
} from "./types";

/**
 * Themed chapters, one file per world. To add a world: create a new file in
 * `worlds/` and insert it in this list. World and level numbers are assigned
 * from position here, so nothing needs renumbering.
 *
 * (Trimmed to the robot + pattern levels of Robo Basics as the base for the
 * upcoming games revamp — the other 19 worlds were removed.)
 */
const worldDefs: WorldDef[] = [roboBasics];

let levelNumber = 0;
export const worlds: World[] = worldDefs.map((def, index) => ({
  ...def,
  number: index + 1,
  levels: def.levels.map((level) => ({ ...level, number: ++levelNumber })),
}));

/** Flat list of all levels across worlds. */
export const curriculum: Level[] = worlds.flatMap((world) => world.levels);

export const allGames: Game[] = curriculum.flatMap((level) => level.games);

export function findGame(gameId: string) {
  for (const world of worlds) {
    for (const level of world.levels) {
      const index = level.games.findIndex((g) => g.id === gameId);
      if (index !== -1) {
        const flatIndex = allGames.findIndex((g) => g.id === gameId);
        const next = allGames[flatIndex + 1] ?? null;
        return { game: level.games[index], level, world, next };
      }
    }
  }
  return null;
}

/** True when every game in the world is completed. */
export function isWorldCompleted(world: World, completed: Set<string>) {
  return world.levels.every((level) =>
    level.games.every((game) => completed.has(game.id)),
  );
}
