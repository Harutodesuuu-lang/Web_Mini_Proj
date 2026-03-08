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
      {
        protocol: "https",
        hostname: "images.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.animationmagazine.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
