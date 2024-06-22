/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { exit } from "node:process";

import type { CharacterInsertSchema, ElementInsertSchema } from "./schema";
import { db } from "./client";
import { Character, Element, Script, User } from "./schema";

await db
  .insert(User)
  .values({
    avatarUrl: "",
    email: "chris.watts.t@gmail.com",
    firstName: "Chris",
    id: "user_2i5HNDos78bZY6QHCmI5wjIjlkx",
    lastName: "Watts",
  })
  .returning({ id: User.id })
  .onConflictDoNothing();

const [script] = await db
  .insert(Script)
  .values({
    basedOn: `"American Prometheus:\nThe Triumph and Tragedy of J. Robert Oppenheimer"`,
    basedOnBy: "Kai Bird & Martin J. Sherwin",
    title: "Oppenheimer",
    writtenBy: "Christopher Nolan",
  })
  .returning({ id: Script.id });

if (!script?.id) {
  throw new Error("Failed to insert script");
}

const charactersToInsert = [
  { name: "Narrator", summary: "" },
  { name: "OPPENHEIMER", summary: "" },
  { name: "ROBB", summary: "" },
] as const satisfies Omit<CharacterInsertSchema, "scriptId">[];
const characters: { id: string; name: string }[] = [];

for (const character of charactersToInsert) {
  const [newCharacter] = await db
    .insert(Character)
    .values({
      ...character,
      scriptId: script.id,
    })
    .returning();

  if (newCharacter)
    characters.push({ id: newCharacter.id, name: newCharacter.name });
}

// eslint-disable-next-line unicorn/no-array-reduce
const charactersByName = characters.reduce(
  (accumulator, character) => ({ ...accumulator, [character.name]: character }),
  {} as Record<string, { id: string; name: string }>,
);

const elements = [
  {
    characterId: charactersByName.Narrator!.id,
    text: "INT. ROOM 2022, ATOMIC ENERGY COMMISSION -- DAY (COLOUR)",
    type: "scene",
  },
  {
    characterId: charactersByName.Narrator!.id,

    text: "Robb gets right in my face, incredulous-",
    type: "action",
  },
  {
    characterId: charactersByName.ROBB!.id,
    metadata: {},
    text: "You mean having worked night and day for three years to build the bomb, you then argued it shouldn’t be used?",
    type: "dialog",
  },
  {
    characterId: charactersByName.OPPENHEIMER!.id,
    metadata: {},
    text: "No. I was asked by the Secretary of War what the views of scientists were- I gave the views against and the views for.",
    type: "dialog",
  },
  {
    characterId: charactersByName.ROBB!.id,

    metadata: {},
    text: "You supported the dropping of the atom bomb on Japan, didn’t you?",
    type: "dialog",
  },
  {
    characterId: charactersByName.OPPENHEIMER!.id,
    metadata: {
      continued: true,
      dualDialogue: true,
    },
    text: "What do you mean 'support'?",
    type: "dialog",
  },
  {
    characterId: charactersByName.ROBB!.id,

    metadata: {
      continued: true,
      dualDialogue: true,
    },
    text: "You helped pick the target, didn’t you?",
    type: "dialog",
  },
  {
    characterId: charactersByName.OPPENHEIMER!.id,
    metadata: {},
    text: "I did my job- I was not in a policy-making position at Los Alamos- I would have done anything that I was asked to do-",
    type: "dialog",
  },
  {
    characterId: charactersByName.ROBB!.id,

    metadata: {},
    text: "You would have made the H-bomb too wouldn’t you?",
    type: "dialog",
  },
  {
    characterId: charactersByName.OPPENHEIMER!.id,
    metadata: {},
    text: "I couldn’t.",
    type: "dialog",
  },
  {
    characterId: charactersByName.Narrator!.id,

    text: "The STAMPING breaks rhythm to become CACOPHONOUS...",
    type: "action",
  },
  {
    characterId: charactersByName.ROBB!.id,

    metadata: {},
    text: "I didn’t ask you that, doctor!",
    type: "dialog",
  },
  {
    characterId: charactersByName.OPPENHEIMER!.id,
    metadata: {
      continued: true,
      dualDialogue: true,
    },
    text: "I would have worked on it, yes. But to run a laboratory is one thing, to advise a government is another.",
    type: "dialog",
  },
  {
    characterId: charactersByName.Narrator!.id,

    text: "CUT TO:",
    type: "transition",
  },
] satisfies Omit<
  ElementInsertSchema,
  "scriptId" | "index" | "scene" | "page"
>[];

let index = 0;

for (const element of elements) {
  await db.insert(Element).values({
    ...element,
    index,
    page: index,
    scene: index,
    scriptId: script.id,
  });

  index++;
}

exit(0);
