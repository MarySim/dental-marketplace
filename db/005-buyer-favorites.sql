CREATE TABLE IF NOT EXISTS buyer_favorite (
  buyer_id text NOT NULL REFERENCES buyer_user (id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  PRIMARY KEY (buyer_id, product_id)
);
