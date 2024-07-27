"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Reading } from "@on-script/db/schema";

import { authenticatedAction } from "~/safe-action";

export const createNewReading = authenticatedAction
  .createServerAction()
  .input(z.object({ scriptId: z.string() }))
  .handler(async ({ ctx, input }) => {
    const [reading] = await ctx.db
      .insert(Reading)
      .values({
        createdById: ctx.user.id,
        scriptId: input.scriptId,
      })
      .returning({ id: Reading.id });

    console.log("created reading", reading?.id);

    if (!reading) {
      throw new Error("Failed to create reading");
    }
    revalidatePath(`/`);
    redirect(
      `/scripts/${input.scriptId}/reading/${reading.id}/character-selection`,
    );
  });
