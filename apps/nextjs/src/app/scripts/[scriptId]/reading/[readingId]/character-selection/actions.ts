"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { and, eq } from "@on-script/db";
import { CharacterAssignment, ReadingSession } from "@on-script/db/schema";

import { authenticatedAction } from "~/safe-action";

export const createReadingSession = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      readingId: z.string(),
      scriptId: z.string(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    const existingSession = await ctx.db
      .select()
      .from(ReadingSession)
      .where(
        and(
          eq(ReadingSession.readingId, input.readingId),
          eq(ReadingSession.userId, ctx.user.id),
        ),
      )
      .limit(1)
      .execute();

    if (existingSession.length > 0) {
      redirect(`/scripts/${input.scriptId}/reading/${input.readingId}`);
    }

    await ctx.db
      .insert(ReadingSession)
      .values({
        online: true,
        readingId: input.readingId,
        userId: ctx.user.id,
      })
      .execute();

    redirect(`/scripts/${input.scriptId}/reading/${input.readingId}`);
  });

export const upsertCharacterAssignments = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      action: z.enum(["select", "deselect"]),
      characterId: z.string(),
      readingId: z.string(),
      scriptId: z.string(),
    }),
  )
  .handler(async ({ ctx, input }) => {
    await (input.action === "deselect"
      ? ctx.db
          .delete(CharacterAssignment)
          .where(
            and(
              eq(CharacterAssignment.characterId, input.characterId),
              eq(CharacterAssignment.userId, ctx.user.id),
              eq(CharacterAssignment.readingId, input.readingId),
            ),
          )
          .execute()
      : ctx.db
          .insert(CharacterAssignment)
          .values({
            characterId: input.characterId,
            readingId: input.readingId,
            userId: ctx.user.id,
          })
          .returning({ id: CharacterAssignment.id }));

    revalidatePath(
      `/scripts/${input.scriptId}/reading/${input.readingId}/character-selection`,
    );
  });
