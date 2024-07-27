"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { eq } from "@on-script/db";
import { Reading } from "@on-script/db/schema";

import { authenticatedAction } from "~/safe-action";

export const selectCurrentElement = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      elementId: z.string(),
      readingId: z.string(),
      scriptId: z.string(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    const { scriptId, elementId, readingId } = input;
    await ctx.db
      .update(Reading)
      .set({
        currentElementId: elementId,
      })
      .where(eq(Reading.id, readingId))
      .execute();

    revalidatePath(`/scripts/${scriptId}/reading/${readingId}`);
  });
