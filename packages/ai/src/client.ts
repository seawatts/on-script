import { writeFileSync } from "node:fs";
import path from "node:path";
import type { GenerateObjectResult } from "ai";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

import type { ElementInsertSchema } from "@on-script/db/schema";
import { eq } from "@on-script/db";
import { db } from "@on-script/db/client";
import {
  Character,
  Element,
  ElementType,
  Scene,
  Script,
} from "@on-script/db/schema";

import type { ElementsSchemaType } from "./prompts/elements-prompt";
import type { SceneSchemaType } from "./prompts/scene-prompt";
import type { CharacterForSet } from "./types";
import { elementsPrompt, elementsSchema } from "./prompts/elements-prompt";
import { scenePrompt, sceneSchema } from "./prompts/scene-prompt";
import { scriptPrompt, scriptSchema } from "./prompts/script-prompt";
import { pdfToPng } from "./utils/pdf-to-png";
import { scrapeWebsite } from "./utils/scrape-website";

interface LastElement {
  text: string;
  id: string;
  index: number;
  characterId: string;
  isElementCutOffOfImage: boolean | null;
  type: keyof typeof ElementType;
  metadata?: unknown;
}

export async function parseScriptFromUrl(props: {
  url: string;
  pages: number[];
}) {
  const website = await scrapeWebsite({ url: props.url });

  const pdfImages = await pdfToPng({
    buffer: website.pdfBuffer,
    pages: props.pages,
  });

  let characters = new Set<CharacterForSet>();

  const firstPage = pdfImages[0]?.base64;
  if (pdfImages.length === 0 || !firstPage) {
    throw new Error("Failed to convert pdf to images");
  }

  const scriptInfo = await generateScriptFromImage({
    image: firstPage,
  });

  const [script] = await db
    .insert(Script)
    .values({
      basedOn: scriptInfo.object.basedOn,
      basedOnBy: scriptInfo.object.basedOnBy,
      title: scriptInfo.object.title,
      writtenAt: scriptInfo.object.writtenAt
        ? new Date(scriptInfo.object.writtenAt)
        : undefined,
      writtenBy: scriptInfo.object.writtenBy,
    })
    .returning({
      id: Script.id,
    });

  if (!script) {
    throw new Error("Failed to insert script");
  }

  let lastElement: LastElement | undefined;

  for (const [index, image] of pdfImages.entries()) {
    if (!image.base64) {
      console.error(`Failed to convert page ${index + 1} to image`);
      continue;
    }

    writeFileSync(
      path.resolve(import.meta.dirname, `./base64-output.${index}.png`),
      image.base64,
      "base64",
    );

    const elements = await generateElementsFromImage({
      characters,
      image: image.base64,
    });

    const newCharacters = await createCharacters({
      characters,
      elements: elements as any,
      script,
    });

    characters = new Set([...characters, ...newCharacters]);

    const scenes = await generateScenesFromElements({
      characters,
      elements: elements as any,
      lastElement,
    });

    const savedScenes = await db
      .insert(Scene)
      .values(
        scenes.object.scenes.map((scene) => ({
          keywords: scene.keywords,
          location: scene.location,
          popularityScore: scene.popularityScore,
          scriptId: script.id,
          sentiment: scene.sentiment,
          summary: scene.summary,
          themes: scene.themes,
          time: scene.time,
          title: scene.title,
        })),
      )
      .returning({
        id: Scene.id,
        title: Scene.title,
      });

    const newElements = await createElementsInDatabase({
      characters,
      elements: elements as any,
      lastElement,
      page: index,
      savedScenes,
      scenes,
      script,
    });

    lastElement = newElements?.at(-1);
  }
}

async function createElementsInDatabase(props: {
  page: number;
  lastElement?: LastElement;
  elements: GenerateObjectResult<ElementsSchemaType>;
  scenes: GenerateObjectResult<SceneSchemaType>;
  savedScenes: { id: string; title: string }[];
  characters: Set<CharacterForSet>;
  script: { id: string };
}) {
  let elements = props.elements.object.elements;
  const firstElement = elements[0];

  if (props.lastElement?.isElementCutOffOfImage && firstElement) {
    await db
      .update(Element)
      .set({
        text: `${props.lastElement.text} ${firstElement.text}`,
      })
      .where(eq(Element.id, props.lastElement.id))
      .returning({
        id: Element.id,
      });

    elements = elements.slice(1);
  }

  const elementsWithSceneAndCharacterId = elements.map((element, index) => {
    const overallIndex = (props.lastElement?.index ?? 0) + index;

    const generatedScene = props.scenes.object.scenes.find((scene) =>
      scene.elementIndices.includes(overallIndex),
    );

    const savedScene = generatedScene
      ? props.savedScenes.find((saved) => saved.title === generatedScene.title)
      : null;

    if (!savedScene) {
      console.error(`Failed to find scene for element ${overallIndex}`);
    }

    let character = [...props.characters].find(
      (character) => character.name === element.characterName,
    );

    if (!character) {
      character = [...props.characters].find(
        (character) => character.name === "Narrator",
      );
    }

    if (!character) {
      console.error(`Failed to find character for element ${overallIndex}`);
      return;
    }

    return {
      characterId: character.id,
      index: overallIndex,
      isCharacterExtra: element.isCharacterExtra,
      isElementCutOffOfImage: element.isElementCutOffOfImage,
      metadata: {
        dualDialogue: element.dual,
        extension: element.extension,
      },
      page: props.page,
      sceneId: savedScene?.id,
      scriptId: props.script.id,
      text: element.text,
      type: ElementType[element.type],
    } satisfies ElementInsertSchema;
  });

  const elementsToInsert = elementsWithSceneAndCharacterId.filter(
    (element) => element !== undefined,
  );

  if (elementsToInsert.length > 0) {
    return db.insert(Element).values(elementsToInsert).returning({
      characterId: Element.characterId,
      id: Element.id,
      index: Element.index,
      isElementCutOffOfImage: Element.isElementCutOffOfImage,
      metadata: Element.metadata,
      text: Element.text,
      type: Element.type,
    });
  } else {
    console.error("Failed to insert elements");
  }
}

async function createCharacters(props: {
  elements: GenerateObjectResult<ElementsSchemaType>;
  characters: Set<CharacterForSet>;
  script: { id: string };
}): Promise<Set<CharacterForSet>> {
  const { elements, characters, script } = props;
  const narratorCharacterName = "Narrator";

  const characterNames = new Set(
    elements.object.elements
      .filter((element) => element.characterName && element.type === "dialog")
      .map((element) => element.characterName),
  );

  const newCharacters = [...characterNames, narratorCharacterName].filter(
    (name) =>
      ![...characters].some(
        (character) => character.name === name && Boolean(name),
      ),
  ) as string[];

  if (newCharacters.length > 0) {
    const insertedCharacters = await db
      .insert(Character)
      .values(newCharacters.map((name) => ({ name, scriptId: script.id })))
      .returning({
        id: Character.id,
        name: Character.name,
      })
      .execute();

    const newInsertedCharacters = insertedCharacters.filter(
      (character) => character.name && character.id,
    );

    for (const character of newInsertedCharacters) characters.add(character);

    return new Set<CharacterForSet>(newInsertedCharacters);
  }

  return new Set<CharacterForSet>();
}

async function generateScenesFromElements(props: {
  lastElement?: LastElement;
  characters: Set<CharacterForSet>;
  elements: GenerateObjectResult<ElementsSchemaType>;
}) {
  const elementsWithIndex = props.elements.object.elements.map(
    (element, index) => ({
      ...element,
      index: (props.lastElement?.index ?? 0) + index,
    }),
  );

  return await generateObject({
    maxTokens: 4096,
    messages: [
      {
        content: scenePrompt({ characters: props.characters }),
        role: "system",
      },
      {
        content: [
          {
            text: JSON.stringify(elementsWithIndex, null, 2),
            type: "text",
          },
        ],
        role: "user",
      },
    ],
    mode: "json",
    model: openai("gpt-4o"),
    schema: sceneSchema,
    temperature: 0,
  });
}

async function generateElementsFromImage(props: {
  characters: Set<CharacterForSet>;
  image: string;
}) {
  try {
    const response = await generateObject({
      maxTokens: 4096,
      messages: [
        {
          content: elementsPrompt({ characters: props.characters }),
          role: "system",
        },
        {
          content: [
            {
              image: props.image,
              type: "image",
            },
          ],
          role: "user",
        },
      ],
      mode: "json",
      model: openai("gpt-4o"),
      schema: elementsSchema,
      temperature: 0,
    });

    console.log(response.finishReason, response.warnings);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function generateScriptFromImage(props: { image: string }) {
  return await generateObject({
    maxTokens: 4096,
    messages: [
      {
        content: scriptPrompt(),
        role: "system",
      },
      {
        content: [
          {
            image: props.image,
            type: "image",
          },
        ],
        role: "user",
      },
    ],
    mode: "json",
    model: openai("gpt-4o"),
    schema: scriptSchema,
    temperature: 0,
  });
}
