import { fileURLToPath } from "url";
import createJiti from "jiti";

import baseConfig from "@on-script/next-config/base";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  transpilePackages: [
    ...(baseConfig.transpilePackages ?? []),
    "@on-script/api",
    "@on-script/backend",
    "@on-script/db",
    "@on-script/ui",
    "@on-script/validators",
    "@on-script/ai",
    "@on-script/script-parser",
  ],
};

export default nextConfig;
