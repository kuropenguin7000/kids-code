"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { findGame } from "@/lib/curriculum";
import { useAccess } from "@/lib/useAccess";
import { GameHost } from "./games/GameHost";
import { TrialBanner } from "./TrialBanner";

export function GameView({ gameId }: { gameId: string }) {
  const t = useTranslations("lesson");
  const locale = useLocale() as "en" | "id";
  const router = useRouter();
  const [showHint, setShowHint] = useState(false);
  const { hydrated, gameLockReason, markStarted, markDone, completed } =
    useAccess();

  const found = findGame(gameId);
  const lockReason = hydrated && found ? gameLockReason(gameId) : null;
  const allowed = hydrated && found !== null && lockReason === null;

  useEffect(() => {
    if (!hydrated || !found) return;
    // Locked world: premium locks go to pricing, progression locks go back
    // to the path so the kid can finish the previous world first.
    if (!allowed) {
      router.replace(lockReason === "premium" ? "/pricing?limit=1" : "/learn");
      return;
    }
    markStarted(found.game.id);
  }, [hydrated, allowed, lockReason, found, router, markStarted]);

  if (!found) return null;
  const { game, level, next } = found;
  const isDone = completed.has(game.id);

  if (!allowed) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <TrialBanner />

      <div>
        <Link
          href="/learn"
          className="text-sm font-bold text-brand hover:underline"
        >
          {t("backToPath")}
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: `${level.color}22` }}
          >
            {game.emoji}
          </span>
          <div>
            <p
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: level.color }}
            >
              {level.title[locale]}
            </p>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">
              {game.title[locale]}
              {isDone && " ⭐"}
            </h1>
          </div>
        </div>
      </div>

      {game.kind === "code" && (
        <p className="rounded-2xl bg-white p-4 text-[15px] leading-relaxed shadow-sm">
          {game.intro[locale]}
        </p>
      )}

      <div className="rounded-2xl border-l-8 border-brand bg-violet-50 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-brand">
          🎯 {t("task")}
        </p>
        <p className="mt-1 font-bold">{game.instructions[locale]}</p>
      </div>

      <GameHost game={game} onSuccess={() => markDone(game.id)} />

      {isDone && (
        <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-center font-display text-lg font-semibold text-emerald-800">
          {t("success")} +10 XP
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {game.kind === "code" ? (
          <button
            onClick={() => setShowHint((v) => !v)}
            className="rounded-full border-2 border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100"
          >
            💡 {t("hint")}
          </button>
        ) : (
          <span />
        )}
        {isDone && (
          <Link
            href={next ? `/learn/${next.id}` : "/learn"}
            className="rounded-full bg-brand px-5 py-2.5 font-display font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110"
          >
            {next ? t("next") : t("backToPath")}
          </Link>
        )}
      </div>
      {showHint && game.kind === "code" && (
        <p className="rounded-2xl bg-amber-50 p-4 font-mono text-sm text-amber-900">
          {game.hint[locale]}
        </p>
      )}
    </div>
  );
}
