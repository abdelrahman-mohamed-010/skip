import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/green-cards/family-based-green-cards",
        destination: "/green-cards/family-based-greencards",
        permanent: true,
      },
      {
        source: "/green-card",
        destination: "/green-cards",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
