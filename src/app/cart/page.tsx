import Link from "next/link";
import { requireBuyer } from "@/lib/buyer-auth";
import { listBuyerCart } from "@/lib/products";
import { cartSubtotal } from "@/lib/cart-total";
import { changeCart } from "@/app/shopping-actions";
import { CartQuantity } from "./CartQuantity";
import { formatRub } from "@/lib/format";
import { getLocale } from "@/lib/server-locale";
import { messages } from "@/lib/i18n";

export default async function CartPage() {
  const [buyer, locale] = await Promise.all([requireBuyer("/cart"), getLocale()]);
  const items = await listBuyerCart(buyer.id);
  const subtotalRub = cartSubtotal(items);
  const { nav, common, cart } = messages[locale];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-sky-950">{nav.cart}</h1>
      {items.length === 0 ? (
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
            {items.map((product) => (
              <li
                key={product.slug}
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
                    {formatRub(product.priceRub, locale)} · {product.units[locale]}
                    {product.shipsWorldwide ? ` · ${common.goods}` : null}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <CartQuantity
                    key={product.quantity}
                    slug={product.slug}
                    quantity={product.quantity}
                    label={cart.qty}
                    update={cart.update}
                  />
                  <form action={changeCart}>
                    <input type="hidden" name="slug" value={product.slug} />
                    <button name="operation" value="remove" className="text-sm text-sky-700">
                      {cart.remove}
                    </button>
                  </form>
                </div>
              </li>
            ))}
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
