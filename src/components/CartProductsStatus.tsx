"use client";

import { useCart } from "@/context/CartContext";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function CartProductsStatus() {
  const { hasError, retry } = useCart();
  const copy = messages[useLocale()].cart;
  if (!hasError) return <p role="status">{copy.loading}</p>;

  return (
    <div className="rounded-2xl bg-white p-5">
      <p role="alert">{copy.error}</p>
      <button type="button" onClick={retry} className="mt-3 text-sky-700 underline">
        {copy.retry}
      </button>
    </div>
  );
}
