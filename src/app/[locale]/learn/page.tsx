import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { LearnPath } from "@/components/LearnPath";
import { TrialBanner } from "@/components/TrialBanner";

export default function LearnPage() {
  const t = useTranslations("learn");

  return (
    <div className="space-y-6 py-2">
      <TrialBanner />
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          🗺️ {t("title")}
        </h1>
        <p className="mt-2 text-slate-600">{t("subtitle")}</p>
      </div>
      <Suspense>
        <LearnPath />
      </Suspense>
    </div>
  );
}
