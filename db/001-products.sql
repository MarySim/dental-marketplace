CREATE TABLE IF NOT EXISTS products (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL UNIQUE CHECK (char_length(slug) BETWEEN 1 AND 200),
  name text NOT NULL CHECK (btrim(name) <> ''),
  kind text NOT NULL CHECK (kind IN ('goods', 'treatment')),
  category text NOT NULL CHECK (
    category IN ('prosthetics', 'orthodontics', 'prevention', 'clinical-supplies', 'home-care')
  ),
  unit text NOT NULL,
  price_rub numeric(12, 2) NOT NULL CHECK (price_rub >= 0 AND price_rub <> 'NaN'::numeric),
  rating numeric(2, 1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  ships_worldwide boolean NOT NULL,
  accent text NOT NULL DEFAULT '#d8edf7' CHECK (accent ~ '^#[0-9a-fA-F]{6}$'),
  summary text NOT NULL,
  description text NOT NULL,
  highlights text[] NOT NULL DEFAULT ARRAY[]::text[]
);
