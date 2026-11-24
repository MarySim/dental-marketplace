import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/", destination: "/catalog", permanent: false },
      { source: "/clinic", destination: "/catalog", permanent: false },
    ];
  },
};

export default nextConfig;
