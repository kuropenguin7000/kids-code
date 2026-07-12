"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-violet-100 bg-white px-4 py-3 text-center text-xs text-slate-500">
      <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link href="/terms" className="hover:text-brand hover:underline">
          {t("terms")}
        </Link>
        <span aria-hidden className="text-violet-200">
          •
        </span>
        <Link href="/privacy" className="hover:text-brand hover:underline">
          {t("privacy")}
        </Link>
      </nav>
      <p className="mt-1.5">{t("rights", { year: new Date().getFullYear() })}</p>
    </footer>
  );
}
