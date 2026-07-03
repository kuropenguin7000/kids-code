"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAccess } from "@/lib/useAccess";

/**
 * Home page call-to-action buttons. Subscribers (and master accounts) get a
 * plain "keep playing" button — no "free" wording, no pricing links.
 */
export function HomeCtas({ variant }: { variant: "hero" | "bottom" }) {
  const t = useTranslations("home");
  const { subscribed } = useAccess();

  const startLabel = subscribed ? t("ctaStartMember") : t("ctaStart");

  if (variant === "bottom") {
    return (
      <Link
        href="/learn"
        className="inline-block rounded-full bg-accent px-8 py-4 font-display text-lg font-semibold text-white shadow-xl shadow-amber-200 transition hover:brightness-110"
      >
        🎮 {startLabel}
      </Link>
    );
  }

  return (
    <>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/learn"
          className="w-full rounded-full bg-brand px-8 py-4 font-display text-lg font-semibold text-white shadow-xl shadow-violet-200 transition hover:brightness-110 sm:w-auto"
        >
          🚀 {startLabel}
        </Link>
        {!subscribed && (
          <Link
            href="/pricing"
            className="w-full rounded-full border-4 border-violet-200 bg-white px-8 py-3.5 font-display text-lg font-semibold text-brand transition hover:border-brand-light sm:w-auto"
          >
            {t("ctaPricing")}
          </Link>
        )}
      </div>
      {!subscribed && (
        <p className="mt-4 text-sm font-bold text-emerald-600">
          ✨ {t("trialNote")}
        </p>
      )}
    </>
  );
}
