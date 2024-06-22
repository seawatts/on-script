import baseConfig from "@on-script/eslint-config/base";
import reactConfig from "@on-script/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
