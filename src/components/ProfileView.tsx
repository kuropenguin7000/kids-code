"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { curriculum } from "@/lib/curriculum";
import { rankForXp, XP_PER_GAME } from "@/lib/ranks";
import { formatRupiah, type PlanId } from "@/lib/pricing";
import { useAccess } from "@/lib/useAccess";

const LEVELS_PER_PAGE = 6;

type InvoiceRow = {
  number: string;
  plan: PlanId;
  amount: number;
  periodEnd: string;
  createdAt: string;
};

export function ProfileView() {
  const t = useTranslations("profile");
  const tPricing = useTranslations("pricing");
  const locale = useLocale() as "en" | "id";
  const { status } = useSession();
  const { hydrated, signedIn, isMaster, plan, planExpires, completed, me } =
    useAccess();
  const [progressPage, setProgressPage] = useState(0);
  const [invoices, setInvoices] = useState<InvoiceRow[] | null>(null);

  // Load the purchase history once signed in.
  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setInvoices(d.invoices ?? []);
      })
      .catch(() => {
        if (!cancelled) setInvoices([]);
      });
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const dateFmt = (d: string) =>
    new Date(d).toLocaleDateString(locale === "id" ? "id-ID" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (status === "loading" || (signedIn && !hydrated)) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-brand" />
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border-4 border-violet-100 bg-white p-8 text-center shadow-sm">
        <span className="text-5xl">🙋</span>
        <h1 className="mt-3 font-display text-2xl font-semibold">
          {t("signInTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{t("signInText")}</p>
        <button
          onClick={() => signIn("google", { redirectTo: "/" })}
          className="mt-5 rounded-full bg-brand px-6 py-3 font-display font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110"
        >
          {t("signInButton")}
        </button>
      </div>
    );
  }

  const xp = completed.size * XP_PER_GAME;
  const { current, next } = rankForXp(xp);

  const planBadge = isMaster
    ? { label: `👑 ${t("planMaster")}`, className: "bg-amber-100 text-amber-800 border-amber-300" }
    : plan === "lifetime"
      ? { label: `♾️ ${t("planLifetime")}`, className: "bg-amber-100 text-amber-800 border-amber-300" }
      : plan === "monthly"
        ? { label: `💎 ${t("planMonthly")}`, className: "bg-violet-100 text-brand border-violet-300" }
        : plan === "yearly"
          ? { label: `💎 ${t("planYearly")}`, className: "bg-violet-100 text-brand border-violet-300" }
          : { label: `⏳ ${t("planFree")}`, className: "bg-slate-100 text-slate-600 border-slate-300" };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Identity + plan */}
      <section className="rounded-3xl border-4 border-violet-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {me?.image ? (
            <Image
              src={me.image}
              alt={me.name ?? "avatar"}
              width={72}
              height={72}
              className="rounded-2xl border-4 border-violet-100"
            />
          ) : (
            <span className="flex h-18 w-18 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
              🙂
            </span>
          )}
          <div className="min-w-0 flex-1 basis-48">
            <h1 className="break-words font-display text-2xl font-semibold">
              {me?.name}
            </h1>
            <p className="break-all text-sm text-slate-500">{me?.email}</p>
          </div>
          <span
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-black ${planBadge.className}`}
          >
            {planBadge.label}
          </span>
        </div>
        {isMaster && (
          <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
            {t("masterNote")}
          </p>
        )}
        {!isMaster && plan === "lifetime" && (
          <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
            ♾️ {t("lifetimeNote")}
          </p>
        )}
        {!isMaster && plan !== null && plan !== "lifetime" && planExpires && (
          <p className="mt-3 rounded-2xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-800">
            📅{" "}
            {t("planUntil", {
              date: new Date(planExpires).toLocaleDateString(
                locale === "id" ? "id-ID" : "en-GB",
                { day: "numeric", month: "long", year: "numeric" }
              ),
            })}{" "}
            ·{" "}
            <Link href="/pricing" className="underline hover:text-brand">
              {t("extendPass")}
            </Link>
          </p>
        )}
        {!isMaster && plan === null && (
          <Link
            href="/pricing"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 font-display font-semibold text-white shadow-lg shadow-amber-200 transition hover:brightness-110"
          >
            {t("upgrade")}
          </Link>
        )}
      </section>

      {/* Rank + XP */}
      <section className="rounded-3xl border-4 border-violet-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-semibold">
          {t("xpTitle")}
        </h2>
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-4xl">
            {current.emoji}
          </span>
          <div className="flex-1">
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
                className="h-full rounded-full bg-gradient-to-r from-brand to-pink-500"
                style={{
                  width: `${Math.min(100, Math.round(((xp - current.xp) / (next.xp - current.xp)) * 100))}%`,
                }}
              />
            </div>
            <p className="mt-1 text-right text-xs font-bold text-slate-400">
              {next.emoji} {next.title[locale]} · {next.xp} XP
            </p>
          </div>
        )}
      </section>

      {/* Per-level progress */}
      <section className="rounded-3xl border-4 border-violet-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-semibold">
          {t("progressTitle")}
        </h2>
        <ul className="space-y-3">
          {curriculum
            .slice(
              progressPage * LEVELS_PER_PAGE,
              (progressPage + 1) * LEVELS_PER_PAGE
            )
            .map((level) => {
            const done = level.games.filter((g) => completed.has(g.id)).length;
            const pct = Math.round((done / level.games.length) * 100);
            return (
              <li key={level.id} className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: `${level.color}22` }}
                >
                  {level.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-bold">
                      {level.title[locale]}
                    </p>
                    <p className="shrink-0 text-xs font-bold text-slate-400">
                      {t("gamesDone", { done, total: level.games.length })}
                    </p>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: level.color }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {curriculum.length > LEVELS_PER_PAGE && (
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <button
              onClick={() => setProgressPage((p) => Math.max(0, p - 1))}
              disabled={progressPage === 0}
              aria-label={t("prevPage")}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-violet-200 bg-white pb-0.5 text-lg font-black text-brand transition enabled:hover:border-brand disabled:opacity-40"
            >
              ‹
            </button>
            <span className="min-w-[3.5rem] text-center text-sm font-bold text-slate-500">
              {progressPage + 1} / {Math.ceil(curriculum.length / LEVELS_PER_PAGE)}
            </span>
            <button
              onClick={() =>
                setProgressPage((p) =>
                  Math.min(
                    Math.ceil(curriculum.length / LEVELS_PER_PAGE) - 1,
                    p + 1
                  )
                )
              }
              disabled={
                progressPage ===
                Math.ceil(curriculum.length / LEVELS_PER_PAGE) - 1
              }
              aria-label={t("nextPage")}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-violet-200 bg-white pb-0.5 text-lg font-black text-brand transition enabled:hover:border-brand disabled:opacity-40"
            >
              ›
            </button>
          </div>
        )}
      </section>

      {/* Purchase history */}
      <section className="rounded-3xl border-4 border-violet-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-semibold">
          {t("historyTitle")}
        </h2>
        {invoices && invoices.length === 0 && (
          <p className="text-sm text-slate-500">{t("historyEmpty")}</p>
        )}
        {invoices && invoices.length > 0 && (
          <ul className="space-y-3">
            {invoices.map((inv) => (
              <li
                key={inv.number}
                className="flex items-center gap-3 rounded-2xl border-2 border-violet-100 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">
                    {tPricing(inv.plan)} · {formatRupiah(inv.amount)}
                  </p>
                  <p className="truncate text-xs font-bold text-slate-400">
                    {dateFmt(inv.createdAt)} · {inv.number}
                  </p>
                </div>
                <a
                  href={`/api/invoice/${inv.number}?locale=${locale}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full bg-violet-100 px-4 py-2 text-xs font-black text-brand transition hover:bg-violet-200"
                >
                  📄 {t("download")}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="text-center">
        <button
          onClick={() => signOut()}
          className="rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
        >
          {t("signOut")}
        </button>
      </div>
    </div>
  );
}
