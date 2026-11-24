"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/app/providers";
import { setLanguage } from "@/app/language";
import { locales, messages } from "@/lib/i18n";

const links = [
  { href: "/", label: "home" },
  { href: "/catalog", label: "catalog" },
  { href: "/clinic", label: "clinic" },
  { href: "/shipping", label: "shipping" },
] as const;

export function Header() {
  const { itemCount } = useCart();
  const locale = useLocale();
  const { nav } = messages[locale];

  return (
    <header className="sticky top-0 z-30 border-b border-sky-100/80 bg-[#f7fbfe]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link href="/" className="min-w-0">
          <Logo store={nav.store} brand={nav.brand} />
        </Link>
        <Suspense fallback={<DesktopNavigation />}>
          <ActiveDesktopNavigation />
        </Suspense>
        <div className="flex shrink-0 items-center gap-2">
          <form action={setLanguage} aria-label={nav.language} className="flex rounded-full border border-sky-200 bg-white p-0.5">
            {locales.map((option) => (
              <button
                key={option}
                type="submit"
                name="locale"
                value={option}
                lang={option}
                aria-label={option === "ru" ? "Русский" : "English"}
                aria-pressed={locale === option}
                className={`rounded-full px-1.5 py-1 text-xs font-semibold sm:px-2 ${
                  locale === option ? "bg-sky-700 text-white" : "text-sky-800 hover:bg-sky-100"
                }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </form>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 rounded-full bg-sky-700 px-2.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-800 sm:px-4"
          >
            {nav.cart}
            <span className="min-w-5 rounded-full bg-white/20 px-1.5 text-center text-xs">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-900"
          >
            {nav[link.label]}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function ActiveDesktopNavigation() {
  const pathname = usePathname();
  return <DesktopNavigation pathname={pathname} />;
}

function DesktopNavigation({ pathname }: { pathname?: string }) {
  const { nav } = messages[useLocale()];
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-sky-700 text-white"
                : "text-slate-600 hover:bg-sky-100 hover:text-sky-900"
            }`}
          >
            {nav[link.label]}
          </Link>
        );
      })}
    </nav>
  );
}
