"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { requireBuyer } from "@/lib/buyer-auth";
import { withBuyerCart } from "@/lib/buyer-cart";
import { cartSubtotal } from "@/lib/cart-total";
import { shippingRegions } from "@/lib/data";
import { getDatabasePool } from "@/lib/database";
import { listBuyerCart } from "@/lib/products";
import { quoteShipping } from "@/lib/shipping";
import type { MockOrder } from "@/lib/types";

export async function addToCart(slug: string) {
  if (typeof slug !== "string" || !slug || slug.length > 200) return "unavailable" as const;
  const buyer = await requireBuyer(`/products/${slug}`);

  const added = await withBuyerCart(buyer.id, async (db) => {
    const result = await db.query(
      `WITH item AS (SELECT id FROM products WHERE slug = $2 AND kind = 'goods'),
       added AS (
         INSERT INTO buyer_cart (buyer_id, product_id, quantity)
         SELECT $1, id, 1 FROM item
         ON CONFLICT (buyer_id, product_id) DO NOTHING
       )
       SELECT id FROM item`,
      [buyer.id, slug],
    );
    return result.rowCount === 1;
  });
  if (!added) return "unavailable" as const;
  refresh();
  return null;
}

export async function setFavorite(slug: string, selected: boolean) {
  if (typeof slug !== "string" || !slug || slug.length > 200 || typeof selected !== "boolean") {
    return "favoriteUnavailable" as const;
  }
  const buyer = await requireBuyer(`/products/${slug}`, "favorite");
  const db = getDatabasePool();
  if (selected) {
    const result = await db.query(
      `WITH item AS (SELECT id FROM products WHERE slug = $2 AND kind = 'goods'),
       saved AS (
         INSERT INTO buyer_favorite (buyer_id, product_id)
         SELECT $1, id FROM item
         ON CONFLICT (buyer_id, product_id) DO NOTHING
       )
       SELECT id FROM item`,
      [buyer.id, slug],
    );
    if (result.rowCount !== 1) return "favoriteUnavailable" as const;
  } else {
    await db.query(
      `DELETE FROM buyer_favorite USING products
       WHERE buyer_favorite.buyer_id = $1 AND products.id = buyer_favorite.product_id AND products.slug = $2`,
      [buyer.id, slug],
    );
  }
  refresh();
  return null;
}

export async function changeCart(data: FormData) {
  const buyer = await requireBuyer("/cart");
  const slug = data.get("slug");
  if (typeof slug !== "string" || !slug || slug.length > 200) return;

  const quantity = Number(data.get("quantity"));
  if (data.get("operation") !== "remove" && (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)) return;

  await withBuyerCart(buyer.id, async (db) => {
    if (data.get("operation") === "remove") {
      await db.query(
        `DELETE FROM buyer_cart USING products
         WHERE buyer_cart.buyer_id = $1 AND products.id = buyer_cart.product_id AND products.slug = $2`,
        [buyer.id, slug],
      );
    } else {
      await db.query(
        `UPDATE buyer_cart SET quantity = $3 FROM products
         WHERE buyer_cart.buyer_id = $1 AND products.id = buyer_cart.product_id
         AND products.slug = $2 AND products.kind = 'goods'`,
        [buyer.id, slug, quantity],
      );
    }
  });
  refresh();
}

export async function placeDemoOrder(_previous: "invalid" | "empty" | null, data: FormData) {
  const buyer = await requireBuyer("/checkout");
  const region = shippingRegions.find((entry) => entry.id === data.get("region"));
  const name = data.get("name");
  const city = data.get("city");
  if (!region || typeof name !== "string" || !name.trim() || name.trim().length > 100 ||
      typeof city !== "string" || city.trim().length > 100) return "invalid" as const;

  const orderId = await withBuyerCart(buyer.id, async (db) => {
    const lines = await listBuyerCart(buyer.id, db);
    if (!lines.length) return null;

    const quote = quoteShipping(region.id, lines, (slug) => lines.find((line) => line.slug === slug));
    const shippingRub = quote.amountRub ?? 0;
    const subtotalRub = cartSubtotal(lines);
    const order: MockOrder = {
      id: `KR-${randomUUID().toUpperCase()}`,
      createdAt: new Date().toISOString(),
      regionId: region.id,
      city: city.trim(),
      recipient: name.trim(),
      items: lines.map(({ slug, name, names, quantity, priceRub }) => ({ slug, name, names, quantity, unitPriceRub: priceRub })),
      shippingRub,
      subtotalRub,
      totalRub: subtotalRub + shippingRub,
    };
    await db.query("INSERT INTO buyer_demo_order (id, buyer_id, details) VALUES ($1, $2, $3)", [order.id, buyer.id, order]);
    await db.query("DELETE FROM buyer_cart WHERE buyer_id = $1", [buyer.id]);
    return order.id;
  });
  if (!orderId) return "empty" as const;
  refresh();
  redirect(`/orders/${orderId}`);
}
