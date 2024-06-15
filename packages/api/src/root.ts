import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { scriptRouter } from "./router/script";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  script: scriptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
