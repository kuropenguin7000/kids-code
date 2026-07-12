"use client";

import { useLocaleSwitcher, type Locale } from "./LocaleProvider";

const labels: Record<Locale, string> = { en: "EN", id: "ID" };
const locales: Locale[] = ["en", "id"];

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocaleSwitcher();

  return (
    <div className="flex items-center gap-1 rounded-full bg-violet-100 p-1">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
            l === locale
              ? "bg-brand text-white shadow"
              : "text-violet-700 hover:bg-violet-200"
          }`}
          aria-pressed={l === locale}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
