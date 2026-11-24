import "server-only";

import type { PoolClient } from "pg";
import { getDatabasePool } from "./database";
import type { MockOrder } from "./types";

export async function getBuyerCartCount(buyerId: string) {
  const { rows } = await getDatabasePool().query<{ count: number }>(
    `SELECT COALESCE(sum(c.quantity), 0)::integer AS count
     FROM buyer_cart c INNER JOIN products p ON p.id = c.product_id
     WHERE c.buyer_id = $1 AND p.kind = 'goods'`,
    [buyerId],
  );
  return rows[0].count;
}

export async function withBuyerCart<T>(buyerId: string, operation: (db: PoolClient) => Promise<T>) {
  const db = await getDatabasePool().connect();
  try {
    await db.query("BEGIN");
    await db.query("SELECT id FROM buyer_user WHERE id = $1 FOR UPDATE", [buyerId]);
    const result = await operation(db);
    await db.query("COMMIT");
    return result;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  } finally {
    db.release();
  }
}

export async function getBuyerOrder(buyerId: string, id: string) {
  const { rows } = await getDatabasePool().query<{ details: MockOrder }>(
    "SELECT details FROM buyer_demo_order WHERE buyer_id = $1 AND id = $2",
    [buyerId, id],
  );
  return rows[0]?.details;
}
