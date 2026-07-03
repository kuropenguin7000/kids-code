"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FREE_WORLDS } from "@/lib/config";
import { useAccess } from "@/lib/useAccess";

export function PricingCards({ hitLimit }: { hitLimit: boolean }) {
  const t = useTranslations("pricing");
  const tTrial = useTranslations("trial");
  const { signedIn, subscribed, isMaster, refresh } = useAccess();
  const [busy, setBusy] = useState(false);

  async function subscribe(plan: "monthly" | "yearly") {
    if (!signedIn) {
      // Must have an account before subscribing; come back here to finish.
      signIn("google", { redirectTo: "/pricing" });
      return;
    }
    // Demo checkout: replace with a real payment flow (Midtrans, Xendit,
    // Stripe, ...) that verifies the subscription server-side.
    setBusy(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  const plans = [
    {
      id: "monthly" as const,
      name: t("monthly"),
      price: t("monthlyPrice"),
      per: t("perMonth"),
      popular: false,
    },
    {
      id: "yearly" as const,
      name: t("yearly"),
      price: t("yearlyPrice"),
      per: t("perYear"),
      popular: true,
    },
  ];

  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <div className="space-y-6">
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

      {subscribed ? (
        <div className="rounded-3xl border-4 border-emerald-200 bg-emerald-50 p-8 text-center">
          <p className="font-display text-2xl font-semibold text-emerald-800">
            {isMaster ? `👑 ${t("masterAccess")}` : t("subscribed")}
          </p>
          <Link
            href="/learn"
            className="mt-4 inline-block rounded-full bg-success px-6 py-3 font-display font-semibold text-white shadow-lg shadow-emerald-200 transition hover:brightness-110"
          >
            {t("goLearn")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border-4 bg-white p-6 shadow-sm ${
                plan.popular ? "border-brand" : "border-violet-100"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                  🏆 {t("popular")} · {t("yearlySave")}
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
                onClick={() => subscribe(plan.id)}
                disabled={busy}
                className={`mt-5 rounded-full px-5 py-3 font-display font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60 ${
                  plan.popular
                    ? "bg-brand shadow-violet-200"
                    : "bg-accent shadow-amber-200"
                }`}
              >
                {signedIn ? t("subscribe") : t("signInFirst")}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-slate-500">🛡️ {t("guarantee")}</p>
    </div>
  );
}
