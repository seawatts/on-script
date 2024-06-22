import { currentUser } from "@clerk/nextjs/server";
import { db } from "@on-script/db/client";
import { createServerActionProcedure } from "zsa";

export const authenticatedAction = createServerActionProcedure().handler(
  async () => {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    return { db, user };
  },
);

export const unauthenticatedAction = createServerActionProcedure().handler(
  () => {
    return { user: null };
  },
);
