import { notFound } from "next/navigation";
import { GameView } from "@/components/GameView";
import { allGames, findGame } from "@/lib/curriculum";

// Prebuild one static page per game (required by `output: 'export'`), and
// reject any id not in this list rather than trying to render on the fly.
export const dynamicParams = false;

export function generateStaticParams() {
  return allGames.map((game) => ({ gameId: game.id }));
}

type Props = {
  params: Promise<{ gameId: string }>;
};

export default async function GamePage({ params }: Props) {
  const { gameId } = await params;
  if (!findGame(gameId)) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl py-2">
      <GameView gameId={gameId} />
    </div>
  );
}
