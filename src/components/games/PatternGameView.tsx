"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PatternGame } from "@/lib/curriculum";

export function PatternGameView({
  game,
  onSuccess,
}: {
  game: PatternGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const [picked, setPicked] = useState<string | null>(null);
  const solved = picked === game.answer;

  function pick(option: string) {
    if (solved) return;
    setPicked(option);
    if (option === game.answer) onSuccess();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border-4 border-violet-100 bg-white p-5">
        {game.sequence.map((item, i) => (
          <span key={i} className="text-4xl sm:text-5xl">
            {item}
          </span>
        ))}
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl border-4 text-3xl sm:h-14 sm:w-14 sm:text-4xl ${
            solved
              ? "border-emerald-300 bg-emerald-50"
              : "border-dashed border-amber-400 bg-amber-50 font-display font-bold text-amber-500"
          }`}
        >
          {solved ? game.answer : "?"}
        </span>
      </div>

      <p className="text-center font-display text-lg font-semibold">
        {t("whatsNext")}
      </p>

      <div className="flex justify-center gap-4">
        {game.options.map((option) => (
          <button
            key={option}
            onClick={() => pick(option)}
            disabled={solved}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 text-4xl shadow-sm transition active:scale-90 sm:h-20 sm:w-20 sm:text-5xl ${
              solved && option === game.answer
                ? "border-emerald-400 bg-emerald-50"
                : picked === option && option !== game.answer
                  ? "border-rose-300 bg-rose-50"
                  : "border-violet-200 bg-white hover:-translate-y-1 hover:border-brand-light hover:shadow-md"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {picked !== null && !solved && (
        <p className="text-center text-sm font-bold text-rose-600">
          {t("tryAgain")}
        </p>
      )}
    </div>
  );
}
