"use client";

import { useActionState } from "react";
import { setFavorite } from "@/app/shopping-actions";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function FavoriteButton({ slug, selected }: { slug: string; selected: boolean }) {
  const copy = messages[useLocale()].product;
  const [error, action, pending] = useActionState(setFavorite.bind(null, slug, !selected), null);

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        aria-pressed={selected}
        className={`rounded-full border px-5 py-2.5 text-sm font-medium disabled:opacity-60 ${
          selected ? "border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100"
            : "border-sky-200 bg-white text-sky-800 hover:bg-sky-50"
        }`}
      >
        <span aria-hidden="true" className="mr-1.5">{selected ? "♥" : "♡"}</span>
        {selected ? copy.favorited : copy.addFavorite}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{copy[error]}</p>}
    </form>
  );
}
