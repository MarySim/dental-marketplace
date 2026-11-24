"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { BuyerMenu } from "./BuyerMenu";
import { useLocale } from "@/app/providers";
import { setLanguage } from "@/app/language";
import { locales, messages } from "@/lib/i18n";

export function Header({ signedIn, itemCount }: { signedIn: boolean; itemCount: number }) {
  const locale = useLocale();
  const { nav } = messages[locale];
  const accountButton = "ml-auto rounded-full bg-sky-700 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-800";

  return (
    <header className="sticky top-0 z-30 border-b border-sky-100/80 bg-[#f7fbfe]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/catalog" className="min-w-0">
          <Logo store={nav.store} brand={nav.brand} />
        </Link>
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
        </div>
        <nav className="order-last flex w-full items-center gap-2 sm:order-none sm:ml-auto sm:w-auto">
          <Link
            href="/catalog"
            className="rounded-full px-3 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-100"
          >
            {nav.catalog}
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-sky-900 hover:bg-sky-50"
          >
            {nav.cart}
            <span className="min-w-5 rounded-full bg-sky-100 px-1.5 text-center text-xs">
              {itemCount}
            </span>
          </Link>
          {signedIn ? (
            <BuyerMenu />
          ) : (
            <Link href="/login" prefetch={false} className={accountButton}>{nav.signIn}</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
