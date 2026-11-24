-- Better Auth schema for the dedicated owner account and its sessions.
CREATE TABLE IF NOT EXISTS owner_user (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL,
  image text,
  "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS owner_user_singleton_idx ON owner_user ((true));

CREATE TABLE IF NOT EXISTS owner_session (
  id text PRIMARY KEY,
  "expiresAt" timestamptz NOT NULL,
  token text NOT NULL UNIQUE,
  "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamptz NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES owner_user (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS owner_account (
  id text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES owner_user (id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS owner_verification (
  id text PRIMARY KEY,
  identifier text NOT NULL,
  value text NOT NULL,
  "expiresAt" timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "owner_session_userId_idx" ON owner_session ("userId");
CREATE INDEX IF NOT EXISTS "owner_account_userId_idx" ON owner_account ("userId");
CREATE INDEX IF NOT EXISTS owner_verification_identifier_idx ON owner_verification (identifier);

CREATE TABLE IF NOT EXISTS owner_login_limit (
  singleton boolean PRIMARY KEY CHECK (singleton),
  attempt_count integer NOT NULL CHECK (attempt_count > 0),
  window_started_at timestamptz NOT NULL
);
