CREATE TABLE IF NOT EXISTS buyer_user (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL,
  image text,
  "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buyer_session (
  id text PRIMARY KEY,
  "expiresAt" timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamptz NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES buyer_user (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS buyer_account (
  id text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES buyer_user (id) ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  scope text,
  password text,
  "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS buyer_verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "buyer_session_userId_idx" ON buyer_session ("userId");
CREATE INDEX IF NOT EXISTS "buyer_account_userId_idx" ON buyer_account ("userId");
CREATE INDEX IF NOT EXISTS buyer_verification_identifier_idx ON buyer_verification (identifier);

CREATE TABLE IF NOT EXISTS buyer_auth_limit (
  scope text PRIMARY KEY,
  attempt_count integer NOT NULL CHECK (attempt_count > 0),
  expires_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS buyer_cart (
  buyer_id text NOT NULL REFERENCES buyer_user (id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  PRIMARY KEY (buyer_id, product_id)
);

CREATE TABLE IF NOT EXISTS buyer_demo_order (
  id text PRIMARY KEY,
  buyer_id text NOT NULL REFERENCES buyer_user (id) ON DELETE CASCADE,
  details jsonb NOT NULL
);
