import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDatabasePool } from "./database";
import { hasOwnerAuthSecret, ownerAuthOptions } from "./owner-auth-options.mjs";

function createOwnerAuth() {
  return betterAuth({
    ...ownerAuthOptions(getDatabasePool()),
    plugins: [nextCookies()],
  });
}

let ownerAuth: ReturnType<typeof createOwnerAuth> | undefined;

export function getOwnerAuth() {
  ownerAuth ??= createOwnerAuth();
  return ownerAuth;
}

export const getOwnerSession = cache(async () => {
  if (!hasOwnerAuthSecret()) return null;
  return getOwnerAuth().api.getSession({ headers: await headers() });
});

export async function requireOwner() {
  const session = await getOwnerSession();
  if (!session) redirect("/owner/login");
  return session.user;
}

export async function reserveOwnerLoginAttempt() {
  const result = await getDatabasePool().query(`
    INSERT INTO owner_login_limit (singleton, attempt_count, window_started_at)
    VALUES (true, 1, statement_timestamp())
    ON CONFLICT (singleton) DO UPDATE SET
      attempt_count = CASE
        WHEN owner_login_limit.window_started_at <= statement_timestamp() - interval '1 minute' THEN 1
        ELSE owner_login_limit.attempt_count + 1
      END,
      window_started_at = CASE
        WHEN owner_login_limit.window_started_at <= statement_timestamp() - interval '1 minute' THEN statement_timestamp()
        ELSE owner_login_limit.window_started_at
      END
    WHERE owner_login_limit.attempt_count < 8
       OR owner_login_limit.window_started_at <= statement_timestamp() - interval '1 minute'
    RETURNING singleton
  `);
  return result.rowCount === 1;
}
