import { getTranslations } from "next-intl/server";
import { PricingCards } from "@/components/PricingCards";

type Props = {
  searchParams: Promise<{ limit?: string }>;
};

export default async function PricingPage({ searchParams }: Props) {
  const { limit } = await searchParams;
  const t = await getTranslations("pricing");

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          💎 {t("title")}
        </h1>
        <p className="mt-2 text-slate-600">{t("subtitle")}</p>
      </div>
      <PricingCards hitLimit={limit === "1"} />
    </div>
  );
}
