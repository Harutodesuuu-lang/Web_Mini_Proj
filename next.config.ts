import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "picsum.photos",
      "s3.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.escuelajs.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placeimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
