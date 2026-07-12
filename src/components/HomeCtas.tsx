"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * Home page call-to-action button. Every world is free now, so this is just a
 * single "start playing" link into the learning path.
 */
export function HomeCtas({ variant }: { variant: "hero" | "bottom" }) {
  const t = useTranslations("home");

  if (variant === "bottom") {
    return (
      <Link
        href="/learn"
        className="inline-block rounded-full bg-accent px-8 py-4 font-display text-lg font-semibold text-white shadow-xl shadow-amber-200 transition hover:brightness-110"
      >
        🎮 {t("ctaStart")}
      </Link>
    );
  }

  return (
    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href="/learn"
        className="w-full rounded-full bg-brand px-8 py-4 font-display text-lg font-semibold text-white shadow-xl shadow-violet-200 transition hover:brightness-110 sm:w-auto"
      >
        🚀 {t("ctaStart")}
      </Link>
    </div>
  );
}
