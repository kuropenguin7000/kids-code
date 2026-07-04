import { useLocale, useTranslations } from "next-intl";
import { HomeCtas } from "@/components/HomeCtas";
import { LogoMark } from "@/components/Logo";
import { worlds } from "@/lib/curriculum";

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale() as "en" | "id";

  const features = [
    { emoji: "⌨️", title: t("feature1Title"), text: t("feature1Text") },
    { emoji: "🗺️", title: t("feature2Title"), text: t("feature2Text") },
    { emoji: "⚡", title: t("feature3Title"), text: t("feature3Text") },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Hero */}
      <section className="text-center">
        <div className="mx-auto mb-6 w-fit animate-bounce">
          <LogoMark size={96} />
        </div>
        <h1 className="mx-auto max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {t("heroTitle")}{" "}
          <span className="bg-gradient-to-r from-brand to-pink-500 bg-clip-text text-transparent">
            {t("heroHighlight")}
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          {t("heroSubtitle")}
        </p>
        <HomeCtas variant="hero" />
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-6 text-center font-display text-3xl font-semibold">
          {t("featuresTitle")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border-4 border-violet-100 bg-white p-6 text-center shadow-sm"
            >
              <span className="text-4xl">{feature.emoji}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning path preview */}
      <section>
        <h2 className="text-center font-display text-3xl font-semibold">
          {t("pathTitle")}
        </h2>
        <p className="mt-2 text-center text-slate-600">{t("pathSubtitle")}</p>
        <ol className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {worlds.map((world) => (
            <li
              key={world.id}
              className="flex items-center gap-2.5 rounded-2xl border-2 border-violet-100 bg-white p-3 shadow-sm"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: `${world.color}22` }}
              >
                {world.emoji}
              </span>
              <div className="min-w-0">
                <p
                  className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color: world.color }}
                >
                  {t("worldLabel", { number: world.number })}
                </p>
                <p className="truncate font-display text-sm font-semibold">
                  {world.title[locale]}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 text-center">
          <HomeCtas variant="bottom" />
        </div>
      </section>
    </div>
  );
}
