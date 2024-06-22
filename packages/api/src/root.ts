import { authRouter } from "./router/auth";
import { scriptRouter } from "./router/script";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  script: scriptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
