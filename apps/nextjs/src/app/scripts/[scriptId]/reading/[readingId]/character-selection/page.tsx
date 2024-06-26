// export const runtime = "edge";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { db } from "@on-script/db/client";

import {
  CharacterList,
  CharacterListLoading,
} from "./_components/character-list";

export default function Page(props: {
  params: { scriptId: string; readingId: string };
}) {
  const { scriptId, readingId } = props.params;

  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const characters = db.query.Character.findMany({
    where: (character, { eq }) => eq(character.scriptId, scriptId),
    with: {
      elements: true,
    },
  }).execute();

  const characterAssignments = db.query.CharacterAssignment.findMany({
    where: (assignment, { eq }) => eq(assignment.readingId, readingId),
    with: {
      user: true,
    },
  }).execute();

  return (
    <div className="min-h-screen py-4 sm:gap-4">
      <main className="container flex min-h-screen w-full max-w-lg items-center justify-center">
        <Suspense fallback={<CharacterListLoading />}>
          <CharacterList
            userId={userId}
            characterAssignments={characterAssignments}
            characters={characters}
            scriptId={scriptId}
            readingId={readingId}
          />
        </Suspense>
      </main>
    </div>
  );
}
