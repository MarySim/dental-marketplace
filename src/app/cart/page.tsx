"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRub } from "@/lib/format";
import { CartProductsStatus } from "@/components/CartProductsStatus";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export default function CartPage() {
  const { items, setQuantity, remove, subtotalRub, getProduct, isLoading, hasError } = useCart();
  const locale = useLocale();
  const { nav, common, cart } = messages[locale];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-sky-950">{nav.cart}</h1>
      {isLoading || hasError ? (
        <CartProductsStatus />
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-sky-100 bg-white p-8">
          <p className="text-slate-600">{cart.empty}</p>
          <Link
            href="/catalog"
            className="mt-4 inline-block rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white"
          >
            {common.browse}
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => {
              const product = getProduct(item.slug);
              if (!product) return null;
              return (
                <li
                  key={item.slug}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sky-100 bg-white p-4"
                >
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-medium text-sky-950"
                    >
                      {product.names[locale]}
                    </Link>
                    <p className="text-sm text-slate-500">
                      {formatRub(product.priceRub, locale)} · {product.units[locale]} ·{" "}
                      {product.shipsWorldwide ? common.goods : common.treatment}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-500">
                      {cart.qty}
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={item.quantity}
                        onChange={(event) =>
                          setQuantity(item.slug, Number(event.target.value))
                        }
                        className="ml-2 w-16 rounded-lg border border-sky-200 px-2 py-1"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="text-sm text-sky-700"
                    >
                      {cart.remove}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sky-50 p-5">
            <p className="text-lg font-semibold text-sky-950">
              {common.subtotal} {formatRub(subtotalRub, locale)}
            </p>
            <Link
              href="/checkout"
              className="rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white"
            >
              {cart.checkout}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
