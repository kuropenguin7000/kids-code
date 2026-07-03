import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import "../globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "KidsCode — Coding for kids",
  description:
    "Fun, bite-sized coding lessons that turn kids into real programmers.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <html lang={locale}>
      <body
        className={`${fredoka.variable} ${nunito.variable} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider>
          <Providers>
            <Navbar />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
              {children}
            </main>
            <footer className="border-t border-violet-100 bg-white py-6 text-center text-sm text-slate-500">
              <p>{t("tagline")}</p>
              <p className="mt-1">
                {t("rights", { year: new Date().getFullYear() })}
              </p>
            </footer>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
