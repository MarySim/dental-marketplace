"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartProductsStatus } from "@/components/CartProductsStatus";
import { shippingRegions } from "@/lib/data";
import { formatRub } from "@/lib/format";
import { quoteShipping, treatmentItems } from "@/lib/shipping";
import type { MockOrder, ShippingRegionId } from "@/lib/types";
import { useLocale } from "@/app/providers";
import { messages } from "@/lib/i18n";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalRub, clear, getProduct, isLoading, hasError } = useCart();
  const locale = useLocale();
  const { checkout, common, shipping } = messages[locale];
  const [regionId, setRegionId] = useState<ShippingRegionId>("eu");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const quote = useMemo(
    () => quoteShipping(regionId, items, getProduct),
    [regionId, items, getProduct],
  );
  const treatments = treatmentItems(items, getProduct);
  const shippingRub = quote.amountRub ?? 0;
  const total = subtotalRub + shippingRub;

  function placeMockOrder(event: React.FormEvent) {
    event.preventDefault();
    if (items.length === 0) return;

    const order: MockOrder = {
      id: `KR-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items: items.flatMap((item) => {
        const product = getProduct(item.slug);
        if (!product) return [];
        return [
          {
            slug: product.slug,
            name: product.names[locale],
            names: product.names,
            quantity: item.quantity,
            unitPriceRub: product.priceRub,
          },
        ];
      }),
      regionId,
      city,
      hasTreatments: treatments.length > 0,
      shippingRub,
      subtotalRub,
      totalRub: total,
    };

    sessionStorage.setItem(`order:${order.id}`, JSON.stringify(order));
    clear();
    router.push(`/orders/${order.id}`);
  }

  if (isLoading || hasError) return <CartProductsStatus />;

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
    <form onSubmit={placeMockOrder} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4 rounded-3xl border border-sky-100 bg-white/80 p-6">
        <h1 className="text-3xl font-semibold text-sky-950">{checkout.title}</h1>
        <p className="rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">
          {checkout.intro}
        </p>
        <label className="block text-sm font-medium text-slate-700">
          {checkout.name}
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {checkout.region}
          <select
            value={regionId}
            onChange={(event) => setRegionId(event.target.value as ShippingRegionId)}
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
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {checkout.notes}
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2"
          />
        </label>
      </section>

      <aside className="h-fit space-y-4 rounded-3xl border border-sky-100 bg-white p-6">
        <h2 className="font-semibold text-sky-950">{checkout.summary}</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          {items.map((item) => {
            const product = getProduct(item.slug);
            if (!product) return null;
            return (
              <li key={item.slug} className="flex justify-between gap-3">
                <span>
                  {product.names[locale]} × {item.quantity}
                </span>
                <span>{formatRub(product.priceRub * item.quantity, locale)}</span>
              </li>
            );
          })}
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
            {quote.status === "clinicOnly" && checkout.shippingService}
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
        <button
          type="submit"
          className="w-full rounded-full bg-sky-700 py-3 text-sm font-medium text-white hover:bg-sky-800"
        >
          {checkout.submit}
        </button>
        <p className="text-center text-xs text-slate-500">
          {checkout.noCharge}
        </p>
      </aside>
    </form>
  );
}
