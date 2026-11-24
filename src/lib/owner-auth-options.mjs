import { isIPv4 } from "node:net";

const loopbackHosts = ["localhost", "127.0.0.1", "[::1]"];

export function getOwnerAuthDevHost() {
  const value = process.env.OWNER_AUTH_DEV_HOST?.trim();
  if (process.env.NODE_ENV !== "development" || !value) return undefined;

  const match = /^([0-9.]+):([1-9][0-9]{0,4})$/.exec(value);
  if (!match || !isIPv4(match[1]) || Number(match[2]) > 65535) {
    throw new Error("OWNER_AUTH_DEV_HOST must be an IPv4 address with a port.");
  }
  return { address: match[1], host: value };
}

export function hasOwnerAuthSecret() {
  return (process.env.OWNER_AUTH_SECRET?.length ?? 0) >= 32;
}

/**
 * @param {import("pg").Pool} database
 * @param {{ provision?: boolean }} [options]
 * @returns {import("better-auth").BetterAuthOptions}
 */
export function ownerAuthOptions(database, { provision = false } = {}) {
  return {
    ...baseAuthOptions(database, provision),
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
  };
}

/** @param {import("pg").Pool} database */
export function buyerAuthOptions(database) {
  const base = baseAuthOptions(database);
  return {
    ...base,
    user: { modelName: "buyer_user" },
    account: { modelName: "buyer_account" },
    verification: { modelName: "buyer_verification" },
    session: {
      modelName: "buyer_session",
      expiresIn: 60 * 60 * 24 * 7,
      disableSessionRefresh: true,
      cookieCache: { enabled: false },
    },
    emailAndPassword: { enabled: true, autoSignIn: true, minPasswordLength: 12 },
    advanced: { ...base.advanced, cookiePrefix: "krasnaya-buyer" },
  };
}

/**
 * @param {import("pg").Pool} database
 * @returns {import("better-auth").BetterAuthOptions}
 */
function baseAuthOptions(database, provision = false) {
  if (!hasOwnerAuthSecret()) throw new Error("Set OWNER_AUTH_SECRET to at least 32 random characters.");

  const publicURL = process.env.OWNER_AUTH_URL ? new URL(process.env.OWNER_AUTH_URL) : undefined;
  const devHost = getOwnerAuthDevHost();
  if (publicURL && publicURL.protocol !== "https:" &&
      !(publicURL.protocol === "http:" && loopbackHosts.includes(publicURL.hostname))) {
    throw new Error("OWNER_AUTH_URL must use HTTPS outside localhost.");
  }

  return {
    database,
    secret: process.env.OWNER_AUTH_SECRET,
    baseURL: publicURL?.origin ?? {
      allowedHosts: [
        ...loopbackHosts.flatMap((host) => [host, `${host}:*`]),
        ...(devHost ? [devHost.host] : []),
      ],
      protocol: "http",
      ...(provision ? { fallback: "http://127.0.0.1" } : {}),
    },
    advanced: {
      cookiePrefix: "krasnaya-owner",
      useSecureCookies: publicURL?.protocol === "https:",
    },
  };
}
