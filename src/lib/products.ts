import "server-only";

import { io } from "next/cache";
import { cache } from "react";
import type { PoolClient } from "pg";
import { getDatabasePool } from "./database";
import type { Locale } from "./i18n";
import type { CartLine, Product } from "./types";

const cartColumns = `p.slug, p.kind, p.price_rub::float8 AS "priceRub",
  p.ships_worldwide AS "shipsWorldwide"`;
const productColumns = `${cartColumns}, p.category, p.rating::float8 AS rating,
  p.review_count AS "reviewCount", p.accent,
  COALESCE(t.name, p.name) AS name, COALESCE(t.unit, p.unit) AS unit,
  COALESCE(t.summary, p.summary) AS summary, COALESCE(t.description, p.description) AS description,
  COALESCE(t.highlights, p.highlights) AS highlights`;

export async function listProducts(locale: Locale, category?: string) {
  await io();
  const { rows } = await getDatabasePool().query<Product>(
    `SELECT ${productColumns} FROM products p
     LEFT JOIN product_translations t ON t.product_id = p.id AND t.locale = $1
     WHERE p.kind = 'goods' AND ($2::text IS NULL OR p.category = $2)
     ORDER BY p.id`,
    [locale, category],
  );
  return rows;
}

export const getProduct = cache(async (slug: string, locale: Locale) => {
  await io();
  const { rows } = await getDatabasePool().query<Product>(
    `SELECT ${productColumns} FROM products p
     LEFT JOIN product_translations t ON t.product_id = p.id AND t.locale = $2
     WHERE p.slug = $1 AND p.kind = 'goods'`,
    [slug, locale],
  );
  return rows[0];
});

export async function listBuyerCart(buyerId: string, db: PoolClient | ReturnType<typeof getDatabasePool> = getDatabasePool()) {
  const { rows } = await db.query<CartLine>(
    `SELECT ${cartColumns}, p.name, p.unit, c.quantity,
       jsonb_build_object('ru', COALESCE(ru.name, p.name), 'en', COALESCE(en.name, p.name)) AS names,
       jsonb_build_object('ru', COALESCE(ru.unit, p.unit), 'en', COALESCE(en.unit, p.unit)) AS units
     FROM buyer_cart c INNER JOIN products p ON p.id = c.product_id
     LEFT JOIN product_translations ru ON ru.product_id = p.id AND ru.locale = 'ru'
     LEFT JOIN product_translations en ON en.product_id = p.id AND en.locale = 'en'
     WHERE c.buyer_id = $1 AND p.kind = 'goods'
     ORDER BY p.id`,
    [buyerId],
  );
  return rows;
}
