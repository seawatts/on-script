/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  // experimental__runtimeEnv: {
  // NODE_ENV: process.env.NODE_ENV,

  // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  // POSTGRES_URL: process.env.POSTGRES_URL,
  // NODE_ENV: process.env.NODE_ENV,
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  // },

  extends: [vercel()],

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "test",
    POSTGRES_URL: process.env.POSTGRES_URL ?? "test",
  },

  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    OPENAI_API_KEY: z.string(),
    POSTGRES_URL: z.string().url().optional(),
  },

  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
