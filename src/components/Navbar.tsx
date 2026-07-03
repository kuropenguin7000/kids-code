"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAccess } from "@/lib/useAccess";
import { LogoMark } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { AuthButton } from "./AuthButton";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { subscribed } = useAccess();

  const links = [
    { href: "/", label: t("home") },
    { href: "/learn", label: t("learn") },
    // Subscribers (and master accounts) have nothing left to buy
    ...(subscribed ? [] : [{ href: "/pricing", label: t("pricing") }]),
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-violet-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={34} />
          <span className="font-display text-lg font-semibold">
            <span className="text-brand">Kids</span>
            <span className="text-accent">Code</span>
          </span>
        </Link>

        <nav className="order-3 flex w-full justify-center gap-1 sm:order-none sm:ml-4 sm:w-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                pathname === link.href
                  ? "bg-violet-100 text-brand"
                  : "text-violet-900/70 hover:bg-violet-50 hover:text-brand"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
