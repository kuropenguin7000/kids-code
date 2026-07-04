import type { Game, Level, World, WorldDef } from "./types";
import { world as roboBasics } from "./worlds/01-robo-basics";
import { world as logicLand } from "./worlds/02-logic-land";
import { world as builderBay } from "./worlds/03-builder-bay";
import { world as puzzlePeaks } from "./worlds/04-puzzle-peaks";
import { world as dataDepths } from "./worlds/05-data-depths";
import { world as robotRally } from "./worlds/06-robot-rally";
import { world as detectiveDistrict } from "./worlds/07-detective-district";
import { world as patternPalace } from "./worlds/08-pattern-palace";
import { world as logicLegends } from "./worlds/09-logic-legends";
import { world as boxWarehouse } from "./worlds/10-box-warehouse";
import { world as spyAcademy } from "./worlds/11-spy-academy";
import { world as gameStudio } from "./worlds/12-game-studio";
import { world as pixelPainter } from "./worlds/13-pixel-painter";
import { world as treasureHunters } from "./worlds/14-treasure-hunters";
import { world as melodyMakers } from "./worlds/15-melody-makers";
import { world as robotBrains } from "./worlds/16-robot-brains";
import { world as sortingStation } from "./worlds/17-sorting-station";
import { world as numberNinjas } from "./worlds/18-number-ninjas";
import { world as nestingNook } from "./worlds/19-nesting-nook";
import { world as codeCastle } from "./worlds/20-code-castle";

export type {
  L10n,
  Game,
  OrderGame,
  RobotGame,
  PatternGame,
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
 * `worlds/` and insert it in this list BEFORE Code Castle — the real-code
 * finale always stays the last world. World and level numbers are assigned
 * from position here, so nothing needs renumbering.
 */
const worldDefs: WorldDef[] = [
  roboBasics,
  logicLand,
  builderBay,
  puzzlePeaks,
  dataDepths,
  robotRally,
  detectiveDistrict,
  patternPalace,
  logicLegends,
  boxWarehouse,
  spyAcademy,
  gameStudio,
  pixelPainter,
  treasureHunters,
  melodyMakers,
  robotBrains,
  sortingStation,
  numberNinjas,
  nestingNook,
  codeCastle, // keep last
];

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
