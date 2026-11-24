"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { placeDemoOrder } from "@/app/shopping-actions";
import { cartSubtotal } from "@/lib/cart-total";
import { shippingRegions } from "@/lib/data";
import { formatRub } from "@/lib/format";
import { quoteShipping } from "@/lib/shipping";
import type { CartLine } from "@/lib/types";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export function CheckoutForm({ items, buyerName }: { items: CartLine[]; buyerName: string }) {
  const locale = useLocale();
  const { checkout, common, shipping } = messages[locale];
  const [regionId, setRegionId] = useState("ru");
  const [error, action, pending] = useActionState(placeDemoOrder, null);
  const quote = quoteShipping(regionId, items, (slug) => items.find((item) => item.slug === slug));
  const shippingRub = quote.amountRub ?? 0;
  const subtotalRub = cartSubtotal(items);
  const total = subtotalRub + shippingRub;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white p-8">
        <h1 className="text-3xl font-semibold text-sky-950">{checkout.title}</h1>
        <p className="mt-3 text-slate-600">{checkout.empty}</p>
        <Link href="/catalog" className="mt-4 inline-block text-sky-700">
          {common.browse}
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4 rounded-3xl border border-sky-100 bg-white/80 p-6">
        <h1 className="text-3xl font-semibold text-sky-950">{checkout.title}</h1>
        <p className="rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">
          {checkout.intro}
        </p>
        <label className="block text-sm font-medium text-slate-700">
          {checkout.name}
          <input
            required
            name="name"
            defaultValue={buyerName}
            maxLength={100}
            className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {checkout.region}
          <select
            name="region"
            value={regionId}
            onChange={(event) => setRegionId(event.target.value)}
            className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
          >
            {shippingRegions.map((region) => (
              <option key={region.id} value={region.id}>
                {shipping.regions[region.id]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {checkout.city}
          <input
            name="city"
            maxLength={100}
            className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
          />
        </label>
      </section>

      <aside className="h-fit space-y-4 rounded-3xl border border-sky-100 bg-white p-6">
        <h2 className="font-semibold text-sky-950">{checkout.summary}</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          {items.map((product) => (
            <li key={product.slug} className="flex justify-between gap-3">
              <span>
                {product.names[locale]} × {product.quantity}
              </span>
              <span>{formatRub(product.priceRub * product.quantity, locale)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-sky-100 pt-3 text-sm">
          <p className="flex justify-between">
            <span>{common.subtotal}</span>
            <span>{formatRub(subtotalRub, locale)}</span>
          </p>
          <p className="mt-1 flex justify-between">
            <span>{common.deliveryEstimate}</span>
            <span>{formatRub(shippingRub, locale)}</span>
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {quote.status === "parcel" && checkout.shippingDemo}
            {quote.status === "noParcel" && checkout.noParcel}
            {quote.status === "unknownRegion" && checkout.shippingUnknown}
          </p>
          {quote.status === "parcel" && shippingRub > 0 ? (
            <p className="mt-1 text-xs text-slate-500">
              {checkout.demoTransit} · {quote.region.transitDays} {shipping.days}
            </p>
          ) : null}
        </div>
        <p className="flex justify-between text-lg font-semibold text-sky-950">
          <span>{common.total}</span>
          <span>{formatRub(total, locale)}</span>
        </p>
        {error && <p role="alert" className="text-sm text-red-700">{checkout[error]}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-sky-700 py-3 text-sm font-medium text-white hover:bg-sky-800"
        >
          {pending ? messages[locale].buyer.pending : checkout.submit}
        </button>
        <p className="text-center text-xs text-slate-500">
          {checkout.noCharge}
        </p>
      </aside>
    </form>
  );
}
