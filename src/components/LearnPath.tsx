"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  allGames,
  findGame,
  isWorldCompleted,
  worlds,
  type World,
} from "@/lib/curriculum";
import { rankForXp, XP_PER_GAME } from "@/lib/ranks";
import { useAccess } from "@/lib/useAccess";
import { ResetProgress } from "./ResetProgress";

type WorldState = {
  world: World;
  done: number;
  total: number;
  finished: boolean;
  lock: "progress" | null;
};

const WORLDS_PER_PAGE = 5;

export function LearnPath() {
  const t = useTranslations("learn");
  const locale = useLocale() as "en" | "id";
  const { completed, started, hydrated, worldLockReason, canPlay } =
    useAccess();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chipPage, setChipPage] = useState<number | null>(null);

  // Focus a specific world when arriving via "back to my path" (?world=<id>),
  // so you return to the world you were playing — not the first unfinished one.
  // Read from the URL in an effect (not useSearchParams) so this page needs no
  // Suspense boundary and renders straight into the static export.
  const [focusWorldId, setFocusWorldId] = useState<string | null>(null);
  useEffect(() => {
    const w = new URLSearchParams(window.location.search).get("world");
    if (w && worlds.some((x) => x.id === w)) setFocusWorldId(w);
  }, []);

  const xp = completed.size * XP_PER_GAME;
  const { current, next } = rankForXp(xp);

  const states: WorldState[] = worlds.map((world) => {
    const games = world.levels.flatMap((level) => level.games);
    const done = games.filter((g) => completed.has(g.id)).length;
    return {
      world,
      done,
      total: games.length,
      finished: isWorldCompleted(world, completed),
      lock: worldLockReason(world),
    };
  });

  // The world the kid is currently working through (first playable,
  // unfinished one); it starts expanded unless the user toggled another.
  const activeWorld =
    states.find((s) => !s.finished && s.lock === null) ??
    states[states.length - 1];
  const openId = expandedId ?? focusWorldId ?? activeWorld.world.id;

  // Chip pagination: until the user flips pages, follow the active world.
  const chipPageCount = Math.ceil(states.length / WORLDS_PER_PAGE);
  const activeChipIndex = states.findIndex((s) => s.world.id === openId);
  const visibleChipPage =
    chipPage ?? Math.max(0, Math.floor(activeChipIndex / WORLDS_PER_PAGE));

  // First uncompleted, playable game — powers the "continue" card.
  const nextGame = allGames.find(
    (game) => !completed.has(game.id) && canPlay(game.id)
  );
  const nextGameWorld = nextGame ? findGame(nextGame.id)?.world : null;
  const everythingDone = completed.size === allGames.length;

  function toggleWorld(state: WorldState) {
    if (state.lock !== null) return;
    setExpandedId(openId === state.world.id ? "" : state.world.id);
    setTimeout(() => {
      document
        .getElementById(`world-${state.world.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  // On arrival via ?world=, scroll its card into view once the layout settles.
  useEffect(() => {
    if (!focusWorldId || !hydrated) return;
    document
      .getElementById(`world-${focusWorldId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusWorldId, hydrated]);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          🗺️ {t("title")}
        </h1>
        <p className="mt-2 text-slate-600">{t("subtitle")}</p>
      </div>

      {/* First-load placeholders: same size as the rank header and continue
          card below, so the page doesn't jump when the data arrives. */}
      {!hydrated && (
        <>
          <section className="animate-pulse rounded-3xl border-4 border-violet-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-violet-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 rounded-full bg-slate-100" />
                <div className="h-5 w-36 rounded-full bg-slate-200" />
                <div className="h-4 w-14 rounded-full bg-violet-100" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-3 rounded-full bg-violet-100" />
              <div className="ml-auto mt-1 h-4 w-44 rounded-full bg-slate-100" />
            </div>
          </section>
          <div className="animate-pulse rounded-3xl border-4 border-violet-100 bg-white p-4">
            <div className="h-14 rounded-2xl bg-violet-100" />
          </div>
        </>
      )}

      {/* Rank / XP header */}
      {hydrated && (
        <section className="rounded-3xl border-4 border-violet-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
              {current.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                {t("rank")}
              </p>
              <p className="font-display text-xl font-semibold">
                {current.title[locale]}
              </p>
              <p className="text-sm font-bold text-brand">{xp} XP</p>
            </div>
          </div>
          {next && (
            <div className="mt-3">
              <div className="h-3 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-pink-500 transition-all"
                  style={{
                    width: `${Math.min(100, Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100))}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-right text-xs font-bold text-slate-400">
                {t("nextRank", { xp: next.xp - xp, rank: next.title[locale] })}{" "}
                {next.emoji}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Continue where you left off */}
      {hydrated && everythingDone && (
        <section className="rounded-3xl border-4 border-amber-300 bg-amber-50 p-6 text-center">
          <p className="font-display text-2xl font-semibold text-amber-900">
            👑 {t("allDone")}
          </p>
        </section>
      )}
      {hydrated && !everythingDone && nextGame && nextGameWorld && (
        <Link
          href={`/learn/${nextGame.id}`}
          className="flex items-center gap-4 rounded-3xl border-4 border-brand bg-white p-4 shadow-lg shadow-violet-100 transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
            {nextGame.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold text-slate-400">
              {completed.size > 0 ? t("continueTitle") : t("startTitle")}
            </span>
            <span className="block truncate font-display text-lg font-semibold">
              {t("world", { number: nextGameWorld.number })} ·{" "}
              {nextGame.title[locale]}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-brand px-5 py-2.5 font-display font-semibold text-white">
            ▶ {t("start")}
          </span>
        </Link>
      )}

      {/* World chips: paginated row, starting on the active world's page */}
      <nav className="flex items-center justify-center gap-1.5">
        <button
          onClick={() => setChipPage(Math.max(0, visibleChipPage - 1))}
          disabled={visibleChipPage === 0}
          aria-label={t("prevWorlds")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-white pb-0.5 text-lg font-black text-brand transition enabled:hover:border-brand disabled:opacity-40"
        >
          ‹
        </button>
        {states
          .slice(
            visibleChipPage * WORLDS_PER_PAGE,
            (visibleChipPage + 1) * WORLDS_PER_PAGE
          )
          .map((state) => {
          const isOpen = openId === state.world.id;
          const chipContent = state.finished
            ? "✓"
            : state.lock !== null
              ? "🔒"
              : state.world.number;
          const chip = (
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition ${
                state.finished
                  ? "bg-emerald-100 text-emerald-700"
                  : state.lock !== null
                    ? "border-2 border-slate-200 bg-white text-slate-400"
                    : isOpen
                      ? "bg-brand text-white shadow-lg shadow-violet-200"
                      : "border-2 border-violet-300 bg-white text-brand"
              }`}
            >
              {chipContent}
            </span>
          );
          const label = `${t("world", { number: state.world.number })} · ${state.world.title[locale]}`;
          return (
            <button
              key={state.world.id}
              onClick={() => toggleWorld(state)}
              disabled={state.lock !== null}
              aria-label={label}
            >
              {chip}
            </button>
          );
        })}
        <button
          onClick={() =>
            setChipPage(Math.min(chipPageCount - 1, visibleChipPage + 1))
          }
          disabled={visibleChipPage === chipPageCount - 1}
          aria-label={t("nextWorlds")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-white pb-0.5 text-lg font-black text-brand transition enabled:hover:border-brand disabled:opacity-40"
        >
          ›
        </button>
      </nav>

      {/* World cards — only the visible page (paginated with the chips above,
          so 20+ worlds never turn into one giant scroll). */}
      {states
        .slice(
          visibleChipPage * WORLDS_PER_PAGE,
          (visibleChipPage + 1) * WORLDS_PER_PAGE
        )
        .map((state) => {
        const { world } = state;
        const isOpen = state.lock === null && openId === world.id;
        const pct = Math.round((state.done / state.total) * 100);

        const header = (
          <div className="flex w-full items-center gap-3 text-left">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: `${world.color}22` }}
            >
              {state.lock !== null ? "🔒" : world.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-black uppercase tracking-wider"
                style={{ color: world.color }}
              >
                {t("world", { number: world.number })}
              </p>
              <h2 className="truncate font-display text-xl font-semibold">
                {world.title[locale]}
              </h2>
              <p className="truncate text-xs font-bold text-slate-400">
                {state.lock === "progress"
                  ? t("finishToEnter", {
                      world: t("world", { number: world.number - 1 }),
                    })
                  : t("gamesCompleted", {
                      completed: state.done,
                      total: state.total,
                    })}
              </p>
            </div>
            {state.finished && <span className="text-2xl">🏆</span>}
            {state.lock === null && !state.finished && (
              <span className="hidden h-2 w-20 shrink-0 overflow-hidden rounded-full bg-slate-100 sm:block">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: world.color }}
                />
              </span>
            )}
            {state.lock === null && (
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                style={{ backgroundColor: `${world.color}22`, color: world.color }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 9.5l7 7 7-7" />
                </svg>
              </span>
            )}
          </div>
        );

        return (
          <section
            key={world.id}
            id={`world-${world.id}`}
            className={`scroll-mt-20 rounded-3xl border-4 bg-white shadow-sm ${
              state.lock !== null ? "opacity-75" : ""
            }`}
            style={{ borderColor: isOpen ? `${world.color}88` : `${world.color}33` }}
          >
            <button
              onClick={() => toggleWorld(state)}
              disabled={state.lock !== null}
              className="block w-full p-4"
            >
              {header}
            </button>

            {isOpen && (
              <div className="space-y-5 px-4 pb-5">
                <p className="text-sm text-slate-600">
                  {world.description[locale]}
                </p>
                {world.levels.map((level) => {
                  const levelDone = level.games.filter((g) =>
                    completed.has(g.id)
                  ).length;
                  return (
                    <div
                      key={level.id}
                      className="rounded-2xl border-2 p-4"
                      style={{ borderColor: `${level.color}44` }}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xl">{level.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-semibold leading-tight">
                            {level.title[locale]}
                          </p>
                          <p className="text-xs font-bold text-slate-400">
                            {t("level", { number: level.number })} ·{" "}
                            {t("gamesCompleted", {
                              completed: levelDone,
                              total: level.games.length,
                            })}
                          </p>
                        </div>
                      </div>
                      <ul className="grid gap-3 sm:grid-cols-3">
                        {level.games.map((game) => {
                          const isDone = completed.has(game.id);
                          const isStarted = started.includes(game.id);
                          const label = isDone
                            ? t("done")
                            : isStarted
                              ? t("continue")
                              : t("start");
                          return (
                            <li key={game.id}>
                              <Link
                                href={`/learn/${game.id}`}
                                className={`flex h-full flex-col rounded-2xl border-2 p-3 transition hover:-translate-y-0.5 hover:shadow-md ${
                                  isDone
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-violet-100 bg-violet-50/50"
                                }`}
                              >
                                <span className="text-2xl">{game.emoji}</span>
                                <span className="mt-1 font-bold leading-tight">
                                  {game.title[locale]}
                                </span>
                                <span
                                  className={`mt-auto pt-2 text-xs font-black uppercase tracking-wide ${
                                    isDone ? "text-emerald-600" : "text-brand"
                                  }`}
                                >
                                  {isDone ? `⭐ ${label}` : label}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      <ResetProgress />
    </div>
  );
}
