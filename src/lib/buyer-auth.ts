import "server-only";

import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDatabasePool } from "./database";
import { buyerAuthOptions, hasOwnerAuthSecret } from "./owner-auth-options.mjs";
import { buyerAuthLink, type BuyerAuthReason } from "./buyer-links";

function createBuyerAuth() {
  return betterAuth({ ...buyerAuthOptions(getDatabasePool()), plugins: [nextCookies()] });
}

let buyerAuth: ReturnType<typeof createBuyerAuth> | undefined;

export function getBuyerAuth() {
  buyerAuth ??= createBuyerAuth();
  return buyerAuth;
}

export const getBuyer = cache(async () => {
  const jar = await cookies();
  if (!hasOwnerAuthSecret() ||
      !(jar.has("krasnaya-buyer.session_token") || jar.has("__Secure-krasnaya-buyer.session_token"))) {
    return null;
  }
  const session = await getBuyerAuth().api.getSession({ headers: await headers() });
  return session?.user ?? null;
});

export async function requireBuyer(next: string, reason: BuyerAuthReason = "cart") {
  const buyer = await getBuyer();
  if (!buyer) redirect(buyerAuthLink("register", next, reason));
  return buyer;
}

export async function reserveBuyerAuthAttempt(scope: "register" | "login") {
  const result = await getDatabasePool().query(
    `INSERT INTO buyer_auth_limit (scope, attempt_count, expires_at)
     VALUES ($1, 1, now() + interval '1 minute')
     ON CONFLICT (scope) DO UPDATE SET
       attempt_count = CASE WHEN buyer_auth_limit.expires_at <= now() THEN 1 ELSE buyer_auth_limit.attempt_count + 1 END,
       expires_at = CASE WHEN buyer_auth_limit.expires_at <= now() THEN EXCLUDED.expires_at ELSE buyer_auth_limit.expires_at END
     WHERE buyer_auth_limit.expires_at <= now() OR buyer_auth_limit.attempt_count < $2
     RETURNING scope`,
    [scope, scope === "register" ? 15 : 30],
  );
  return result.rowCount === 1;
}
