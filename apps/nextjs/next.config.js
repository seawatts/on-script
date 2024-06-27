import { fileURLToPath } from "url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@on-script/api",
    "@on-script/backend",
    "@on-script/db",
    "@on-script/ui",
    "@on-script/validators",
    "@on-script/ai",
    "@on-script/script-parser",
  ],
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "playwright"],
    typedRoutes: true,
  },
  images: {
    domains: ["img.clerk.com"],
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
