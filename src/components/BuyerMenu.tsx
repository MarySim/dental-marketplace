"use client";

import Link from "next/link";
import { useRef } from "react";
import { signOutBuyer } from "@/app/buyer-actions";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function BuyerMenu() {
  const { buyer, favorites } = messages[useLocale()];
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={menu} className="relative ml-auto" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
    }} onKeyDown={(event) => {
      if (event.key === "Escape" && event.currentTarget.open) {
        event.currentTarget.open = false;
        event.currentTarget.querySelector("summary")?.focus();
      }
    }}>
      <summary
        aria-label={buyer.profile}
        title={buyer.profile}
        className="relative size-10 cursor-pointer list-none overflow-hidden rounded-full border border-slate-300 bg-slate-200 hover:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden="true" className="absolute left-1/2 top-1.5 size-3 -translate-x-1/2 rounded-full bg-slate-500" />
        <span aria-hidden="true" className="absolute bottom-1.5 left-1/2 h-3.5 w-6 -translate-x-1/2 rounded-t-full rounded-b-md bg-slate-500" />
      </summary>
      <div className="absolute right-0 z-40 mt-2 min-w-40 rounded-2xl border border-sky-100 bg-white p-1.5 text-sm shadow-lg">
        <Link href="/favorites" prefetch={false} className="block rounded-lg px-3 py-2 text-sky-950 hover:bg-sky-50"
          onClick={() => { if (menu.current) menu.current.open = false; }}>
          {favorites.title}
        </Link>
        <form action={signOutBuyer}>
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sky-950 hover:bg-sky-50">
            {buyer.signOut}
          </button>
        </form>
      </div>
    </details>
  );
}
