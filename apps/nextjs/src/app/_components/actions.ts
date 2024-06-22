"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { Reading } from "@on-script/db/schema";

import { authenticatedAction } from "~/safe-action";

export const createNewReading = authenticatedAction
  .createServerAction()
  .input(z.object({ scriptId: z.string() }))
  .handler(async ({ ctx, input }) => {
    console.log("Creating new reading", ctx.user.id);
    const [reading] = await ctx.db
      .insert(Reading)
      .values({
        createdById: ctx.user.id,
        scriptId: input.scriptId,
      })
      .returning({ id: Reading.id });

    if (!reading) {
      throw new Error("Failed to create reading");
    }
    redirect(
      `/scripts/${input.scriptId}/reading/${reading.id}/character-selection`,
    );
  });
