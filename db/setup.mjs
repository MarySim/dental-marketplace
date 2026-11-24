import { readFile } from "node:fs/promises";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL in .env.local before setting up the catalog.");
  process.exit(1);
}

const client = new pg.Client({ connectionString, connectionTimeoutMillis: 5000 });

try {
  const [schema, products, translationSchema, russianProducts, ownerSchema, buyerSchema] = await Promise.all([
    readFile(new URL("./001-products.sql", import.meta.url), "utf8"),
    readFile(new URL("./seed-products.json", import.meta.url), "utf8"),
    readFile(new URL("./002-product-translations.sql", import.meta.url), "utf8"),
    readFile(new URL("./seed-products-ru.json", import.meta.url), "utf8"),
    readFile(new URL("./003-owner-auth.sql", import.meta.url), "utf8"),
    readFile(new URL("./004-buyers.sql", import.meta.url), "utf8"),
  ]);

  await client.connect();
  await client.query("BEGIN");
  try {
    await client.query("SELECT pg_advisory_xact_lock(95641327)");
    await client.query(schema);
    const result = await client.query(
      `INSERT INTO products (
        slug, name, kind, category, unit, price_rub, rating, review_count,
        ships_worldwide, accent, summary, description, highlights
      )
      SELECT slug, name, kind, category, unit, "priceRub", rating, "reviewCount",
        "shipsWorldwide", accent, summary, description, highlights
      FROM jsonb_to_recordset($1::jsonb) AS entry (
        slug text, name text, kind text, category text, unit text, "priceRub" numeric,
        rating numeric, "reviewCount" integer, "shipsWorldwide" boolean,
        accent text, summary text, description text, highlights text[]
      )
      ON CONFLICT (slug) DO NOTHING`,
      [products],
    );
    await client.query(translationSchema);
    const translations = await client.query(
      `INSERT INTO product_translations (product_id, locale, name, unit, summary, description, highlights)
      SELECT products.id, 'ru', entry.name, entry.unit, entry.summary, entry.description, entry.highlights
      FROM jsonb_to_recordset($1::jsonb) AS entry (
        slug text, name text, unit text, summary text, description text, highlights text[]
      )
      INNER JOIN products ON products.slug = entry.slug
      ON CONFLICT (product_id, locale) DO NOTHING`,
      [russianProducts],
    );
    await client.query(ownerSchema);
    await client.query(buyerSchema);
    await client.query("COMMIT");
    console.log(`Catalog is ready. Inserted ${result.rowCount} demo products and ${translations.rowCount} Russian translations.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
} catch (error) {
  console.error(`Catalog setup failed (${error.code ?? "unknown"}): ${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
