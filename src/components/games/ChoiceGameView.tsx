"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { ChoiceGame } from "@/lib/curriculum";

export function ChoiceGameView({
  game,
  onSuccess,
}: {
  game: ChoiceGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const locale = useLocale() as "en" | "id";
  const [picked, setPicked] = useState<number | null>(null);
  const solved = picked === game.correctIndex;

  function pick(index: number) {
    if (solved) return;
    setPicked(index);
    if (index === game.correctIndex) onSuccess();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border-4 border-violet-100 bg-white p-5 text-center">
        <p className="font-display text-lg font-semibold leading-snug sm:text-xl">
          {game.scenario[locale]}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {game.options.map((option, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            disabled={solved}
            className={`flex flex-col items-center gap-2 rounded-2xl border-4 p-4 text-center text-sm font-bold shadow-sm transition active:scale-95 ${
              solved && i === game.correctIndex
                ? "border-emerald-400 bg-emerald-50"
                : picked === i && i !== game.correctIndex
                  ? "border-rose-300 bg-rose-50"
                  : "border-violet-200 bg-white hover:-translate-y-0.5 hover:border-brand-light hover:shadow-md"
            }`}
          >
            <span className="text-4xl">{option.emoji}</span>
            {option.text[locale]}
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
