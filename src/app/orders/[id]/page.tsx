import Link from "next/link";
import { requireBuyer } from "@/lib/buyer-auth";
import { getBuyerOrder } from "@/lib/buyer-cart";
import { formatRub } from "@/lib/format";
import { getLocale } from "@/lib/server-locale";
import { formatLocales, messages } from "@/lib/i18n";

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const [buyer, locale, { id }] = await Promise.all([requireBuyer("/cart"), getLocale(), params]);
  const { order: copy, shipping, common } = messages[locale];
  const order = await getBuyerOrder(buyer.id, id);

  if (!order) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white p-8">
        <h1 className="text-2xl font-semibold text-sky-950">{copy.missing}</h1>
        <p className="mt-2 text-slate-600">
          {copy.missingNote}
        </p>
        <Link href="/catalog" className="mt-4 inline-block text-sky-700">
          {common.browse}
        </Link>
      </div>
    );
  }

  const destination = [shipping.regions[order.regionId], order.city].filter(Boolean).join(" · ");

  return (
    <div className="rounded-3xl border border-sky-100 bg-white/90 p-8">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-sky-700">
        {copy.type}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-sky-950">{copy.title} {order.id}</h1>
      <p className="mt-2 text-slate-500">
        {copy.recorded} {new Date(order.createdAt).toLocaleString(formatLocales[locale], { timeZone: "Asia/Krasnoyarsk" })} · {destination || copy.unspecified}
      </p>
      <ul className="mt-6 divide-y divide-sky-100">
        {order.items.map((item) => (
          <li key={item.slug} className="flex justify-between py-3 text-sm">
            <span>
              {item.names[locale]} × {item.quantity}
            </span>
            <span>{formatRub(item.unitPriceRub * item.quantity, locale)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 text-sm">
        <p className="flex justify-between">
          <span>{common.subtotal}</span>
          <span>{formatRub(order.subtotalRub, locale)}</span>
        </p>
        <p className="flex justify-between">
          <span>{common.deliveryEstimate}</span>
          <span>{formatRub(order.shippingRub, locale)}</span>
        </p>
        <p className="flex justify-between text-lg font-semibold text-sky-950">
          <span>{common.total}</span>
          <span>{formatRub(order.totalRub, locale)}</span>
        </p>
      </div>
      <ul className="mt-6 space-y-2 rounded-2xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">
        <li>{copy.payment}</li>
        {order.shippingRub > 0 ? <li>{copy.shipping}</li> : null}
      </ul>
      <Link
        href="/catalog"
        className="mt-6 inline-block rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white"
      >
        {common.browse}
      </Link>
    </div>
  );
}
