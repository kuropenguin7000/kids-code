"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { findGame } from "@/lib/curriculum";
import { useAccess } from "@/lib/useAccess";
import { GameHost } from "./games/GameHost";

// Short beat after the engine commits the win (the engines already hold
// ~2s of in-game confetti/dance BEFORE onSuccess fires) so the modal's
// pop-in lands on a celebrating scene without feeling laggy.
const WIN_MODAL_DELAY_MS = 500;

export function GameView({ gameId }: { gameId: string }) {
  const t = useTranslations("lesson");
  const locale = useLocale() as "en" | "id";
  const router = useRouter();
  const [showHint, setShowHint] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const winTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { hydrated, gameLockReason, markStarted, markDone, completed } =
    useAccess();

  // Client-side nav between games reuses this component instance, so reset
  // per-game UI state whenever the game id changes.
  useEffect(() => {
    setShowHint(false);
    setShowWinModal(false);
    if (winTimer.current) clearTimeout(winTimer.current);
    return () => {
      if (winTimer.current) clearTimeout(winTimer.current);
    };
  }, [gameId]);

  useEffect(() => {
    if (!showWinModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWinModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showWinModal]);

  const found = findGame(gameId);
  const lockReason = hydrated && found ? gameLockReason(gameId) : null;
  const allowed = hydrated && found !== null && lockReason === null;

  useEffect(() => {
    if (!hydrated || !found) return;
    // Locked world: send the kid back to the path to finish the previous world.
    if (!allowed) {
      router.replace("/learn");
      return;
    }
    markStarted(found.game.id);
  }, [hydrated, allowed, found, router, markStarted]);

  if (!found) return null;
  const { game, level, world, next } = found;
  const isDone = completed.has(game.id);
  // Return to the path focused on THIS world, not the first unfinished one.
  const backHref = { pathname: "/learn", query: { world: world.id } } as const;

  function handleSuccess() {
    markDone(game.id);
    if (winTimer.current) clearTimeout(winTimer.current);
    winTimer.current = setTimeout(
      () => setShowWinModal(true),
      WIN_MODAL_DELAY_MS
    );
  }

  if (!allowed) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-brand" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-2.5 px-4 py-2.5">
        {/* Compact header: back, title, and (once done) an always-visible next button */}
        <div className="flex items-center gap-2.5">
          <Link
            href={backHref}
            aria-label={t("backToPath")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-white text-lg font-bold text-brand shadow-sm transition hover:border-brand-light active:scale-90"
          >
            ←
          </Link>
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${level.color}22` }}
          >
            {game.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[11px] font-black uppercase tracking-wider"
              style={{ color: level.color }}
            >
              {level.title[locale]}
            </p>
            <h1 className="truncate font-display text-lg font-semibold sm:text-xl">
              {game.title[locale]}
              {isDone && " ⭐"}
            </h1>
          </div>
          {isDone && (
            <Link
              href={next ? `/learn/${next.id}` : backHref}
              className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-display font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110"
            >
              {next ? t("next") : t("backToPath")}
            </Link>
          )}
        </div>

        <p className="rounded-xl border-l-4 border-brand bg-violet-50 px-3 py-2 text-sm font-bold">
          🎯 {game.instructions[locale]}
        </p>

        {game.kind === "code" && (
          <p className="rounded-2xl bg-white p-4 text-[15px] leading-relaxed shadow-sm">
            {game.intro[locale]}
          </p>
        )}

        <GameHost key={game.id} game={game} onSuccess={handleSuccess} />

        {game.kind === "code" && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowHint((v) => !v)}
              className="rounded-full border-2 border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100"
            >
              💡 {t("hint")}
            </button>
          </div>
        )}
        {showHint && game.kind === "code" && (
          <p className="rounded-2xl bg-amber-50 p-4 font-mono text-sm text-amber-900">
            {game.hint[locale]}
          </p>
        )}
      </div>

      {showWinModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            aria-label={t("close")}
            onClick={() => setShowWinModal(false)}
            className="absolute inset-0 cursor-default bg-violet-950/40 backdrop-blur-sm animate-modal-fade"
          />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl animate-modal-pop">
            <button
              aria-label={t("close")}
              onClick={() => setShowWinModal(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
            <p className="text-6xl animate-emoji-pop">🎉</p>
            <p className="mt-3 font-display text-2xl font-semibold">
              {t("success")}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-emerald-600 animate-rise">
              +10 XP
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={next ? `/learn/${next.id}` : backHref}
                className="rounded-full bg-brand px-5 py-3 font-display text-lg font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110"
              >
                {next ? t("next") : t("backToPath")}
              </Link>
              {next && (
                <Link
                  href={backHref}
                  className="rounded-full px-5 py-2 text-sm font-bold text-brand hover:underline"
                >
                  {t("backToPath")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
