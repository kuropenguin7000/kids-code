"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { OrderGame } from "@/lib/curriculum";

/** Deterministic shuffle that never accidentally keeps the solved order. */
function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.every((item, i) => item === items[i])) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

export function OrderGameView({
  game,
  onSuccess,
}: {
  game: OrderGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const locale = useLocale() as "en" | "id";
  const [placed, setPlaced] = useState<number[]>([]);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  const deck = useMemo(
    () => shuffled(game.items.map((_, i) => i)),
    [game.items]
  );

  function tap(itemIndex: number) {
    if (placed.includes(itemIndex)) return;
    if (itemIndex === placed.length) {
      const nextPlaced = [...placed, itemIndex];
      setPlaced(nextPlaced);
      if (nextPlaced.length === game.items.length) onSuccess();
    } else {
      setShakeIndex(itemIndex);
      setTimeout(() => setShakeIndex(null), 500);
    }
  }

  const done = placed.length === game.items.length;

  return (
    <div className="space-y-4">
      {/* The plan being built */}
      <div className="rounded-2xl border-4 border-violet-100 bg-white p-4">
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-brand">
          📋 {t("yourPlan")}
        </p>
        <ol className="space-y-2">
          {game.items.map((item, i) => (
            <li
              key={i}
              className={`flex min-h-11 items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm font-bold transition ${
                i < placed.length
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : "border-dashed border-slate-200 text-slate-300"
              }`}
            >
              <span className="font-display text-base">{i + 1}.</span>
              {i < placed.length ? (
                <>
                  <span className="text-xl">{item.emoji}</span>
                  {item.text[locale]}
                </>
              ) : (
                <span>· · ·</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Cards to tap */}
      {!done && (
        <div className="grid grid-cols-2 gap-3">
          {deck.map((itemIndex) => {
            const item = game.items[itemIndex];
            const used = placed.includes(itemIndex);
            return (
              <button
                key={itemIndex}
                onClick={() => tap(itemIndex)}
                disabled={used}
                className={`flex flex-col items-center gap-1 rounded-2xl border-4 p-4 text-center text-sm font-bold shadow-sm transition active:scale-95 ${
                  used
                    ? "border-slate-100 bg-slate-50 opacity-30"
                    : shakeIndex === itemIndex
                      ? "animate-pulse border-rose-300 bg-rose-50"
                      : "border-violet-200 bg-white hover:-translate-y-0.5 hover:border-brand-light hover:shadow-md"
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                {item.text[locale]}
              </button>
            );
          })}
        </div>
      )}
      {shakeIndex !== null && (
        <p className="text-center text-sm font-bold text-rose-600">
          {t("tryAgain")}
        </p>
      )}
    </div>
  );
}
