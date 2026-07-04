"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FREE_WORLDS } from "@/lib/config";
import { useAccess } from "@/lib/useAccess";

type PlanId = "monthly" | "yearly" | "lifetime";

export function PricingCards({ hitLimit }: { hitLimit: boolean }) {
  const t = useTranslations("pricing");
  const tTrial = useTranslations("trial");
  const locale = useLocale() as "en" | "id";
  const {
    signedIn,
    subscribed,
    isMaster,
    plan: activePlan,
    planExpires,
    refresh,
  } = useAccess();
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  // The invoice returned by the last successful purchase (for the receipt).
  const [lastInvoice, setLastInvoice] = useState<{ number: string } | null>(
    null
  );
  // The plan awaiting confirmation in the modal (null = modal closed).
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const hasLifetime = activePlan === "lifetime";

  // A click on a buy/extend button: sign in first if needed, otherwise open
  // the confirmation modal before charging anything.
  function requestBuy(plan: PlanId) {
    if (!signedIn) {
      // Must have an account before buying a pass; come back here to finish.
      signIn("google", { redirectTo: "/pricing" });
      return;
    }
    setConfirmation(null);
    setLastInvoice(null);
    setPendingPlan(plan);
  }

  async function confirmBuy() {
    if (!pendingPlan) return;
    // Demo checkout: replace with a real one-time payment flow (Midtrans/
    // Xendit — QRIS, e-wallet, virtual account) verified server-side.
    setBusy(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: pendingPlan }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          plan: string;
          currentPeriodEnd: string;
          invoice?: { number: string };
        };
        setConfirmation(
          data.plan === "lifetime"
            ? t("purchaseSuccessLifetime")
            : t("purchaseSuccess", {
                date: new Date(data.currentPeriodEnd).toLocaleDateString(
                  locale === "id" ? "id-ID" : "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                ),
              })
        );
        setLastInvoice(data.invoice ?? null);
      }
      await refresh();
      setPendingPlan(null);
    } finally {
      setBusy(false);
    }
  }

  // Let Escape dismiss the modal (but not mid-charge).
  useEffect(() => {
    if (!pendingPlan) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) setPendingPlan(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingPlan, busy]);

  const plans = [
    {
      id: "monthly" as const,
      name: t("monthly"),
      price: t("monthlyPrice"),
      per: t("perMonth"),
      badge: null,
    },
    {
      id: "yearly" as const,
      name: t("yearly"),
      price: t("yearlyPrice"),
      per: t("perYear"),
      badge: `🏆 ${t("popular")} · ${t("yearlySave")}`,
    },
    {
      id: "lifetime" as const,
      name: t("lifetime"),
      price: t("lifetimePrice"),
      per: t("perLifetime"),
      badge: `♾️ ${t("lifetimeBadge")}`,
    },
  ];

  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  if (isMaster) {
    return (
      <div className="rounded-3xl border-4 border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-emerald-800">
          👑 {t("masterAccess")}
        </p>
        <Link
          href="/learn"
          className="mt-4 inline-block rounded-full bg-success px-6 py-3 font-display font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110"
        >
          {t("goLearn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {confirmation && (
        <div
          role="status"
          className="rounded-3xl border-4 border-emerald-300 bg-emerald-100 p-5 text-center text-emerald-900"
        >
          <p className="font-display text-lg font-semibold">{confirmation}</p>
          {lastInvoice && (
            <>
              <p className="mt-1 text-sm font-bold">
                {t("invoiceLabel")} {lastInvoice.number}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <a
                  href={`/api/invoice/${lastInvoice.number}?locale=${locale}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-emerald-600 px-5 py-2.5 font-display text-sm font-semibold text-white transition hover:brightness-110"
                >
                  📄 {t("downloadInvoice")}
                </a>
                <Link
                  href="/profile"
                  className="rounded-full border-2 border-emerald-400 bg-white px-5 py-2 font-display text-sm font-semibold text-emerald-700 transition hover:border-emerald-600"
                >
                  {t("viewPurchases")}
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {hitLimit && !subscribed && (
        <div className="rounded-3xl border-4 border-amber-200 bg-amber-50 p-5 text-center">
          <p className="font-display text-xl font-semibold text-amber-900">
            {tTrial("limitTitle")}
          </p>
          <p className="mt-1 text-sm text-amber-800">
            {tTrial("limitText", { freePlus: FREE_WORLDS + 1 })}
          </p>
        </div>
      )}

      {subscribed && (
        <div className="rounded-3xl border-4 border-emerald-200 bg-emerald-50 p-6 text-center">
          <p className="font-display text-2xl font-semibold text-emerald-800">
            {hasLifetime ? `♾️ ${t("lifetimeActive")}` : t("subscribed")}
          </p>
          {!hasLifetime && planExpires && (
            <p className="mt-1 text-sm font-bold text-emerald-700">
              📅{" "}
              {t("activeUntil", {
                date: new Date(planExpires).toLocaleDateString(
                  locale === "id" ? "id-ID" : "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                ),
              })}
            </p>
          )}
          {!hasLifetime && (
            <p className="mt-2 text-sm text-emerald-700">{t("extendHint")}</p>
          )}
          <Link
            href="/learn"
            className="mt-4 inline-block rounded-full bg-success px-6 py-3 font-display font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110"
          >
            {t("goLearn")}
          </Link>
        </div>
      )}

      {!hasLifetime && (
        <div className="grid gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border-4 bg-white p-6 shadow-sm ${
                plan.id === "yearly"
                  ? "border-brand"
                  : plan.id === "lifetime"
                    ? "border-amber-300"
                    : "border-violet-100"
              }`}
            >
              {plan.badge && (
                <span
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide text-white ${
                    plan.id === "lifetime" ? "bg-accent" : "bg-brand"
                  }`}
                >
                  {plan.badge}
                </span>
              )}
              <h2 className="font-display text-xl font-semibold">
                {plan.name}
              </h2>
              <p className="mt-2">
                <span className="font-display text-4xl font-bold text-brand">
                  {plan.price}
                </span>
                <span className="text-sm font-bold text-slate-500">
                  {plan.per}
                </span>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-emerald-500">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => requestBuy(plan.id)}
                disabled={busy}
                className={`mt-5 rounded-full px-5 py-3 font-display font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60 ${
                  plan.id === "monthly"
                    ? "bg-accent shadow-amber-200"
                    : "bg-brand shadow-violet-200"
                }`}
              >
                {subscribed
                  ? plan.id === "lifetime"
                    ? t("upgradeLifetime")
                    : t("extend")
                  : signedIn
                    ? t("subscribe")
                    : t("signInFirst")}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-slate-500">🛡️ {t("guarantee")}</p>

      {pendingPlan &&
        (() => {
          const plan = plans.find((p) => p.id === pendingPlan)!;
          const note =
            pendingPlan === "lifetime"
              ? t("confirmLifetimeNote")
              : subscribed
                ? t("confirmExtendNote")
                : t("confirmBuyNote");
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
              onClick={() => !busy && setPendingPlan(null)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-3xl border-4 border-violet-100 bg-white p-6 text-center shadow-xl"
              >
                <h2
                  id="confirm-title"
                  className="font-display text-xl font-semibold"
                >
                  {t("confirmTitle")}
                </h2>
                <p className="mt-4 font-display text-lg font-bold">
                  {plan.name}
                </p>
                <p>
                  <span className="font-display text-4xl font-bold text-brand">
                    {plan.price}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    {plan.per}
                  </span>
                </p>
                <p className="mt-3 text-sm text-slate-600">{note}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {t("confirmDemoNote")}
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={confirmBuy}
                    disabled={busy}
                    className="rounded-full bg-brand px-5 py-3 font-display font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110 disabled:opacity-60"
                  >
                    {busy ? t("processing") : t("confirmPay")}
                  </button>
                  <button
                    onClick={() => setPendingPlan(null)}
                    disabled={busy}
                    className="rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 disabled:opacity-60"
                  >
                    {t("confirmCancel")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
