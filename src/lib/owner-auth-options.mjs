const loopbackHosts = ["localhost", "127.0.0.1", "[::1]"];

export function hasOwnerAuthSecret() {
  return (process.env.OWNER_AUTH_SECRET?.length ?? 0) >= 32;
}

/**
 * @param {import("pg").Pool} database
 * @param {{ provision?: boolean }} [options]
 * @returns {import("better-auth").BetterAuthOptions}
 */
export function ownerAuthOptions(database, { provision = false } = {}) {
  if (!hasOwnerAuthSecret()) throw new Error("Set OWNER_AUTH_SECRET to at least 32 random characters.");

  const publicURL = process.env.OWNER_AUTH_URL ? new URL(process.env.OWNER_AUTH_URL) : undefined;
  if (publicURL && publicURL.protocol !== "https:" &&
      !(publicURL.protocol === "http:" && loopbackHosts.includes(publicURL.hostname))) {
    throw new Error("OWNER_AUTH_URL must use HTTPS outside localhost.");
  }

  return {
    database,
    secret: process.env.OWNER_AUTH_SECRET,
    baseURL: publicURL?.origin ?? {
      allowedHosts: loopbackHosts.flatMap((host) => [host, `${host}:*`]),
      protocol: "http",
      ...(provision ? { fallback: "http://127.0.0.1" } : {}),
    },
    user: { modelName: "owner_user" },
    account: { modelName: "owner_account" },
    verification: { modelName: "owner_verification" },
    session: {
      modelName: "owner_session",
      expiresIn: 60 * 60 * 8,
      disableSessionRefresh: true,
      cookieCache: { enabled: false },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: !provision,
      autoSignIn: false,
      minPasswordLength: 16,
    },
    advanced: {
      cookiePrefix: "krasnaya-owner",
      useSecureCookies: publicURL?.protocol === "https:",
    },
  };
}
