"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { RobotGame } from "@/lib/curriculum";

type Block = { dx: number; dy: number; times: number };

function blockLabel(block: Block) {
  const arrow =
    block.dx === 1 ? "➡️" : block.dx === -1 ? "⬅️" : block.dy === -1 ? "⬆️" : "⬇️";
  return block.times > 1 ? `${arrow} ×${block.times}` : arrow;
}

export function RobotGameView({
  game,
  onSuccess,
}: {
  game: RobotGame;
  onSuccess: () => void;
}) {
  const t = useTranslations("game");
  const [program, setProgram] = useState<Block[]>([]);
  const [pos, setPos] = useState(game.start);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "crash" | "miss" | "win">(
    "idle"
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const isWall = (x: number, y: number) =>
    game.walls.some((w) => w.x === x && w.y === y);

  function addBlock(block: Block) {
    if (running || status === "win") return;
    if (game.maxBlocks !== null && program.length >= game.maxBlocks) return;
    setProgram((p) => [...p, block]);
    setStatus("idle");
  }

  function removeBlock(index: number) {
    if (running || status === "win") return;
    setProgram((p) => p.filter((_, i) => i !== index));
    setStatus("idle");
  }

  function reset() {
    if (running) return;
    setProgram([]);
    setPos(game.start);
    setStatus("idle");
  }

  function run() {
    if (running || program.length === 0 || status === "win") return;
    const steps = program.flatMap((b) =>
      Array.from({ length: b.times }, () => ({ dx: b.dx, dy: b.dy }))
    );
    setRunning(true);
    setStatus("idle");
    setPos(game.start);

    let current = { ...game.start };
    let i = 0;
    timerRef.current = setInterval(() => {
      if (i >= steps.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setRunning(false);
        if (current.x === game.goal.x && current.y === game.goal.y) {
          setStatus("win");
          onSuccess();
        } else {
          setStatus("miss");
          setPos(game.start);
        }
        return;
      }
      const step = steps[i++];
      current = { x: current.x + step.dx, y: current.y + step.dy };
      const outside =
        current.x < 0 ||
        current.y < 0 ||
        current.x >= game.cols ||
        current.y >= game.rows;
      if (outside || isWall(current.x, current.y)) {
        if (timerRef.current) clearInterval(timerRef.current);
        setRunning(false);
        setStatus("crash");
        setPos(game.start);
        return;
      }
      setPos(current);
    }, 350);
  }

  const blocksFull =
    game.maxBlocks !== null && program.length >= game.maxBlocks;

  return (
    <div className="space-y-4">
      {/* Grid world */}
      <div className="flex justify-center">
        <div
          className="grid gap-1 rounded-2xl border-4 border-violet-100 bg-white p-2"
          style={{
            gridTemplateColumns: `repeat(${game.cols}, minmax(0, 1fr))`,
            width: `min(100%, ${game.cols * 60 + 24}px)`,
          }}
        >
          {Array.from({ length: game.rows }, (_, y) =>
            Array.from({ length: game.cols }, (_, x) => {
              const isRobot = pos.x === x && pos.y === y;
              const isGoal = game.goal.x === x && game.goal.y === y;
              return (
                <div
                  key={`${x}-${y}`}
                  className={`flex aspect-square items-center justify-center rounded-lg text-2xl sm:text-3xl ${
                    isWall(x, y)
                      ? "bg-slate-300"
                      : (x + y) % 2 === 0
                        ? "bg-violet-50"
                        : "bg-amber-50"
                  }`}
                >
                  {isWall(x, y) ? "🧱" : isRobot ? "🤖" : isGoal ? "⭐" : ""}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Program */}
      <div className="rounded-2xl border-4 border-violet-100 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wider text-brand">
            🧾 {t("yourPlan")}
          </p>
          {game.maxBlocks !== null && (
            <p
              className={`text-xs font-black ${blocksFull ? "text-amber-600" : "text-slate-400"}`}
            >
              {t("blocksUsed", {
                used: program.length,
                max: game.maxBlocks,
              })}
            </p>
          )}
        </div>
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl bg-slate-50 p-2">
          {program.length === 0 && (
            <span className="px-2 text-sm text-slate-400">
              {t("emptyProgram")}
            </span>
          )}
          {program.map((block, i) => (
            <button
              key={i}
              onClick={() => removeBlock(i)}
              className="rounded-lg border-2 border-violet-200 bg-white px-2.5 py-1.5 text-lg font-bold shadow-sm transition hover:border-rose-300 active:scale-90"
              title={t("removeBlock")}
            >
              {blockLabel(block)}
            </button>
          ))}
        </div>
      </div>

      {/* Palette */}
      <div className="flex flex-wrap justify-center gap-2">
        {game.palette.map((block, i) => (
          <button
            key={i}
            onClick={() => addBlock(block)}
            disabled={running || blocksFull || status === "win"}
            className="rounded-xl border-4 border-violet-200 bg-white px-3 py-2 text-xl font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-brand-light active:scale-90 disabled:opacity-40"
          >
            {blockLabel(block)}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={run}
          disabled={running || program.length === 0 || status === "win"}
          className="rounded-2xl bg-success px-6 py-3 font-display text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          {t("go")}
        </button>
        <button
          onClick={reset}
          disabled={running}
          className="rounded-2xl border-4 border-slate-200 bg-white px-5 py-2.5 font-display font-semibold text-slate-600 transition hover:border-slate-300 active:scale-95 disabled:opacity-50"
        >
          🔄 {t("reset")}
        </button>
      </div>

      {status === "crash" && (
        <p className="text-center font-bold text-rose-600">💥 {t("crash")}</p>
      )}
      {status === "miss" && (
        <p className="text-center font-bold text-amber-600">🧭 {t("miss")}</p>
      )}
    </div>
  );
}
