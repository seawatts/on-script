import baseConfig, { restrictEnvAccess } from "@on-script/eslint-config/base";
import nextjsConfig from "@on-script/eslint-config/nextjs";
import reactConfig from "@on-script/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
