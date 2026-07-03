import { notFound } from "next/navigation";
import { GameView } from "@/components/GameView";
import { allGames, findGame } from "@/lib/curriculum";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allGames.map((game) => ({ locale, gameId: game.id }))
  );
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
