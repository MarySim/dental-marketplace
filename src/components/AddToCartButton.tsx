"use client";

import { useActionState } from "react";
import { addToCart } from "@/app/shopping-actions";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function AddToCartButton({ slug, inCart }: { slug: string; inCart: boolean }) {
  const copy = messages[useLocale()].product;
  const [result, action, pending] = useActionState(addToCart.bind(null, slug), null);

  return (
    <form action={action} aria-live="polite">
      <button
        type="submit"
        disabled={inCart || pending}
        className={`rounded-full px-5 py-2.5 text-sm font-medium ${
          inCart
            ? "border border-emerald-200 bg-emerald-100 text-emerald-900"
            : "bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60"
        }`}
      >
        {inCart ? copy.inCart : pending ? copy.adding : copy.add}
      </button>
      {!inCart && result && <p role="alert" className="mt-2 text-sm text-red-700">{copy[result]}</p>}
    </form>
  );
}
