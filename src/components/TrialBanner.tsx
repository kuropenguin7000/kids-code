"use client";

import { useTranslations } from "next-intl";
import { worlds } from "@/lib/curriculum";
import { useAccess } from "@/lib/useAccess";

export function TrialBanner() {
  const t = useTranslations("trial");
  const { hydrated, subscribed } = useAccess();

  if (!hydrated || subscribed) return null;

  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm font-bold text-amber-800">
      ⏳ {t("banner", { total: worlds.length })}
    </div>
  );
}
