"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import id from "../../messages/id.json";

/**
 * Client-side internationalization. A static export can't run middleware or
 * read cookies on the server, so locale lives entirely on the client: both
 * message bundles are imported at build time and swapped in-memory when the
 * user toggles language — no page reload, no `/en` `/id` URL prefix.
 *
 * SSR/first paint always renders the default locale ("en") so the prerendered
 * HTML matches on hydration; the stored preference is applied in an effect.
 */

export type Locale = "en" | "id";

const MESSAGES = { en, id } as const;
const STORAGE_KEY = "kidscode-locale";
const DEFAULT_LOCALE: Locale = "en";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Adopt the stored preference after mount (avoids a hydration mismatch).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "id") {
      setLocaleState(stored);
    }
  }, []);

  // Keep <html lang> in sync for accessibility / correctness.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        window.localStorage.setItem(STORAGE_KEY, next);
        setLocaleState(next);
      },
    }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        timeZone="Asia/Jakarta"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleSwitcher() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleSwitcher must be used within a LocaleProvider");
  }
  return ctx;
}
