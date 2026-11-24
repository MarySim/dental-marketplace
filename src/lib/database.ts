import "server-only";

import { Pool } from "pg";

const database = globalThis as typeof globalThis & { catalogPool?: Pool };

export function getDatabasePool() {
  if (!database.catalogPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is required.");
    const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000 });
    pool.on("error", (error) => console.error("Idle PostgreSQL connection failed:", error.message));
    database.catalogPool = pool;
  }
  return database.catalogPool;
}
