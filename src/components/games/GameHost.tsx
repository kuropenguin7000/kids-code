"use client";

import type { Game } from "@/lib/curriculum";
import { CodeRunner } from "../CodeRunner";
import { OrderGameView } from "./OrderGameView";
import { RobotGameView } from "./RobotGameView";
import { PatternGameView } from "./PatternGameView";
import { MemoryGameView } from "./MemoryGameView";
import { SortGameView } from "./SortGameView";
import { ChoiceGameView } from "./ChoiceGameView";
import { DebugGameView } from "./DebugGameView";

export function GameHost({
  game,
  onSuccess,
}: {
  game: Game;
  onSuccess: () => void;
}) {
  switch (game.kind) {
    case "order":
      return <OrderGameView game={game} onSuccess={onSuccess} />;
    case "robot":
      return <RobotGameView game={game} onSuccess={onSuccess} />;
    case "pattern":
      return <PatternGameView game={game} onSuccess={onSuccess} />;
    case "memory":
      return <MemoryGameView game={game} onSuccess={onSuccess} />;
    case "sort":
      return <SortGameView game={game} onSuccess={onSuccess} />;
    case "choice":
      return <ChoiceGameView game={game} onSuccess={onSuccess} />;
    case "debug":
      return <DebugGameView game={game} onSuccess={onSuccess} />;
    case "code":
      return (
        <CodeRunner
          starterCode={game.starterCode}
          expectedOutput={game.expectedOutput}
          onSuccess={onSuccess}
        />
      );
  }
}
