"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { DebugGame } from "@/lib/curriculum";

export function DebugGameView({
  game,
  onSuccess,
}: {
  game: DebugGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const locale = useLocale() as "en" | "id";
  const [phase, setPhase] = useState<"find" | "fix" | "fixed">("find");
  const [wrongTap, setWrongTap] = useState<number | null>(null);
  const [wrongFix, setWrongFix] = useState<number | null>(null);

  function tapStep(index: number) {
    if (phase !== "find") return;
    if (index === game.wrongIndex) {
      setPhase("fix");
      setWrongTap(null);
    } else {
      setWrongTap(index);
      setTimeout(() => setWrongTap(null), 600);
    }
  }

  function pickFix(index: number) {
    if (phase !== "fix") return;
    if (index === game.correctFixIndex) {
      setPhase("fixed");
      onSuccess();
    } else {
      setWrongFix(index);
      setTimeout(() => setWrongFix(null), 600);
    }
  }

  const fix = game.fixOptions[game.correctFixIndex];

  return (
    <div className="space-y-4">
      <p className="text-center font-display text-lg font-semibold">
        {phase === "find" ? `🔍 ${t("findBug")}` : phase === "fix" ? `🔧 ${t("pickFix")}` : `✨ ${t("bugFixed")}`}
      </p>

      <ol className="space-y-2">
        {game.steps.map((step, i) => {
          const isBug = i === game.wrongIndex;
          const showFixed = phase === "fixed" && isBug;
          const found = phase !== "find" && isBug;
          return (
            <li key={i}>
              <button
                onClick={() => tapStep(i)}
                disabled={phase !== "find"}
                className={`flex w-full items-center gap-3 rounded-2xl border-4 px-4 py-3 text-left text-sm font-bold shadow-sm transition active:scale-[0.98] ${
                  showFixed
                    ? "border-emerald-400 bg-emerald-50"
                    : found
                      ? "border-rose-400 bg-rose-50"
                      : wrongTap === i
                        ? "animate-pulse border-amber-300 bg-amber-50"
                        : "border-violet-100 bg-white hover:border-brand-light"
                }`}
              >
                <span className="font-display text-base text-slate-400">
                  {i + 1}.
                </span>
                <span className="text-2xl">
                  {showFixed ? fix.emoji : step.emoji}
                </span>
                <span className={found && !showFixed ? "line-through" : ""}>
                  {showFixed ? fix.text[locale] : step.text[locale]}
                </span>
                {found && !showFixed && <span className="ml-auto text-xl">🐞</span>}
                {showFixed && <span className="ml-auto text-xl">✅</span>}
              </button>
            </li>
          );
        })}
      </ol>

      {wrongTap !== null && (
        <p className="text-center text-sm font-bold text-amber-600">
          {t("notTheBug")}
        </p>
      )}

      {phase === "fix" && (
        <div className="grid gap-3 sm:grid-cols-3">
          {game.fixOptions.map((option, i) => (
            <button
              key={i}
              onClick={() => pickFix(i)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-4 p-4 text-center text-sm font-bold shadow-sm transition active:scale-95 ${
                wrongFix === i
                  ? "animate-pulse border-rose-300 bg-rose-50"
                  : "border-violet-200 bg-white hover:-translate-y-0.5 hover:border-brand-light hover:shadow-md"
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
              {option.text[locale]}
            </button>
          ))}
        </div>
      )}
      {wrongFix !== null && (
        <p className="text-center text-sm font-bold text-rose-600">
          {t("tryAgain")}
        </p>
      )}
    </div>
  );
}
