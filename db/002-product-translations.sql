CREATE TABLE IF NOT EXISTS product_translations (
  product_id integer NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('ru', 'en')),
  name text NOT NULL CHECK (btrim(name) <> ''),
  unit text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  highlights text[] NOT NULL DEFAULT ARRAY[]::text[],
  PRIMARY KEY (product_id, locale)
);
