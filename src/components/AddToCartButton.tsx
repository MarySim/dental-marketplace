"use client";

import { useActionState } from "react";
import { addToCart } from "@/app/shopping-actions";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function AddToCartButton({ slug }: { slug: string }) {
  const copy = messages[useLocale()].product;
  const [result, action, pending] = useActionState(addToCart.bind(null, slug), null);

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
      >
        {pending ? copy.adding : copy.add}
      </button>
      {result && <p role="status" className="mt-2 text-sm text-slate-600">{copy[result]}</p>}
    </form>
  );
}
