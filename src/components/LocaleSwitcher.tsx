"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = { en: "EN", id: "ID" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full bg-violet-100 p-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
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
