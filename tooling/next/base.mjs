// @ts-check
import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // compiler: {
  // removeConsole: true,
  // },
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    scrollRestoration: true,
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "gravatar.com" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "cloudflare-ipfs.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "media.licdn.com" },
      { hostname: "img.clerk.com" },
    ],
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
};

export default withBundleAnalyzer({
  enabled: process.env.NEXT_ANALYZE === "true",
})(nextConfig);
