"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function AddToCartButton({ slug }: { slug: string }) {
  const { add } = useCart();
  const copy = messages[useLocale()].product;
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(slug);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className="rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-800"
    >
      {added ? copy.added : copy.add}
    </button>
  );
}
