"use client";

import { useTranslations } from "next-intl";

type Section = { heading: string; body: string[] };

/** Renders a legal document (terms/privacy) from the `legal.<key>` message
 *  namespace. Content is bilingual via next-intl, so a single component serves
 *  both locales and reacts to the client-side language toggle. */
export function LegalDoc({ docKey }: { docKey: "terms" | "privacy" }) {
  const t = useTranslations(`legal.${docKey}`);
  const sections = t.raw("sections") as Section[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <div>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{t("updated")}</p>
        <p className="mt-4 text-slate-600">{t("intro")}</p>
      </div>
      <div className="space-y-5">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-lg font-semibold text-slate-800">
              {section.heading}
            </h2>
            {section.body.map((paragraph, j) => (
              <p key={j} className="mt-1 text-slate-600">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
