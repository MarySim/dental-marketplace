import type { NextConfig } from "next";
import { getOwnerAuthDevHost } from "./src/lib/owner-auth-options.mjs";

const devHost = getOwnerAuthDevHost();

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: devHost ? [devHost.address] : [],
  async redirects() {
    return [
      { source: "/", destination: "/catalog", permanent: false },
      { source: "/clinic", destination: "/catalog", permanent: false },
    ];
  },
};

export default nextConfig;
