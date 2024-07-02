import { writeFileSync } from "node:fs";
import path from "node:path";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
// import pdf from "pdf-parse";
import { fromPath } from "pdf2pic";
import { describe, it } from "vitest";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

async function pdfToImages(pdfPath: string) {
  // const pdfBuffer = readFileSync(pdfPath);
  const convert = fromPath(pdfPath, {
    density: 300,
    format: "png",
    height: 3507,
    width: 2481,
  });

  return await convert.bulk(4, { responseType: "base64" });
}

async function ensureCorrectness(result: any, expectedObject: any) {
  const resultWithOmmitedFields = result.elements.map((element: any) => {
    const { characterId, readingTime, speakingTime, ...rest } = element;
    return rest;
  });

  const similaritySchema = z.object({
    mismatchedFields: z
      .array(
        z.object({
          actual: z
            .any()
            .nullable()
            .describe("The actual value of the field, or null if missing."),
          expected: z
            .any()
            .nullable()
            .describe("The expected value of the field, or null if missing."),
          field: z
            .string()
            .describe("The name of the field that does not match."),
          index: z
            .number()
            .describe(
              "The index of the element in the array that does not match.",
            ),
        }),
      )
      .optional()
      .describe("The list of fields that do not match or are missing."),
    similarity: z
      .number()
      .describe("The similarity of the object between 0 and 1."),
  });

  const { object } = await generateObject({
    maxTokens: 4096,
    messages: [
      {
        content: `Act as a fact checker. I'm going to pass in an expected object and an actual object. Compare the two objects and return a similarity score between 0 and 1, where 1 means they are identical and 0 means they are completely different. If an element is missing from the actual object that was in the expected object, or vice versa, include it in the mismatched fields list with the index of the element in the array. Follow these steps:

      1. Iterate through each element in the 'elements' array of the expected object.
      2. For each element, check if there is a corresponding element at the same index in the actual object.
      3. If an element is missing in the actual object, include it in the mismatched fields list.
      4. Compare each field of the element (characterName, dual, extension, text, type).
      5. For any field that does not match, include the field name, expected value, actual value, and the index in the mismatched fields list.
      6. Only include one element per field that does not match, even if there are multiple mismatches.
      7. Calculate the similarity score based on the number of matching fields divided by the total number of fields.
      8. Return the similarity score and the mismatched fields list.
      9. Ensure the output adheres to the following JSON schema:

      --- START JSON SCHEMA ---
      ${JSON.stringify(zodToJsonSchema(similaritySchema), null, 2)}
      --- END JSON SCHEMA ---
      `,
        role: "system",
      },
      {
        content: `
    --- Start Expected Object ---
    ${JSON.stringify(expectedObject, null, 2)}
    --- End Expected Object ---

    --- Start Actual Object ---
    ${JSON.stringify(resultWithOmmitedFields, null, 2)}
    --- End Actual Object ---
    `,
        role: "user",
      },
    ],
    model: openai("gpt-3.5-turbo"),
    schema: similaritySchema,
    temperature: 0,
  });

  return object;
}

describe("ai", () => {
  it("should convert pdf to images", async () => {
    // Example usage
    const pdfPath = path.join(import.meta.dirname, "./file.pdf");
    console.log(`Converting ${pdfPath} to images...`);
    console.time("pdfToImageBuffers");
    // const pdfBuffer = fs.readFileSync(pdfPath);
    // const data = await pdf(pdfBuffer);

    const images = await pdfToImages(pdfPath);
    // images[0].
    console.timeEnd("pdfToImageBuffers");

    // Now you can use imageBuffers to call Vercel AI prompt
    for (const [index, image] of images.entries()) {
      // Replace this with your Vercel AI prompt call
      // console.log(`Page ${index + 1} image buffer size: ${buffer.length} bytes`);
      if (!image.base64) {
        console.error(`Failed to convert page ${index + 1} to image`);
        continue;
      }

      writeFileSync(
        path.resolve(import.meta.dirname, `./files/base64-output.${index}.png`),
        image.base64,
        "base64",
      );
    }

    const image = images[0]?.base64;

    if (image) {
      // const { partialObjectStream } = await streamObject({
      // const { object } = await generateObject({
      //   maxTokens: 4096,
      //   messages: [
      //     {
      //       content: prompt,
      //       role: "system",
      //     },
      //     {
      //       content: [
      //         {
      //           image: image,
      //           type: "image",
      //         },
      //       ],
      //       role: "user",
      //     },
      //   ],
      //   model: openai("gpt-4o"),
      //   schema: schema,
      //   temperature: 0,
      // });

      const expectedObject = {
        elements: [
          {
            characterName: "Senate Aide",
            extension: "CONT'D",
            text: "President Eisenhower's asked you to be in his cabinet, the Senate has no choice but to confirm you.",
            type: "dialog",
          },
          {
            text: "They arrive at the door.",
            type: "action",
          },
          {
            characterName: "Strauss",
            text: "And if they bring up Oppenheimer?",
            type: "dialog",
          },
          {
            characterName: "Senate Aide",
            text: "When they bring up Oppenheimer, answer honestly and no senator can deny that you did your duty. It'll be uncomfortable...",
            type: "dialog",
          },
          {
            text: "(smiles)",
            type: "parenthetical",
          },
          {
            characterName: "Senate Aide",
            text: "Who'd want to justify their whole life?",
            type: "dialog",
          },
          {
            text: "The door to the VAST committee room opens- they enter, FLASHBULBS POPPING as PRESS and PUBLIC see Strauss.",
            type: "action",
          },
          {
            characterName: "Robb",
            extension: "V.O.",
            text: "Why did you leave the United States?",
            type: "dialog",
          },
          {
            text: "CUT TO:",
            type: "transition",
          },
          {
            text: "INT. ROOM 2022, ATOMIC ENERGY COMMISSION -- DAY (COLOUR)",
            type: "scene heading",
          },
          {
            text: "The room is SMALL, SHABBY. Surprised, I look up from my statement at the prosecutor, Roger ROBB. Then turn to the THREE BOARD MEMBERS (GRAY, EVANS, MORGAN).",
            type: "action",
          },
          {
            characterName: "Oppenheimer",
            text: "I wanted to learn the new physics.",
            type: "dialog",
          },
          {
            characterName: "Gray",
            text: "Was there nowhere here? I thought Berkeley had the leading theoretical physics department-",
            type: "dialog",
          },
          {
            characterName: "Oppenheimer",
            text: "Sure. Once I built it. First I had to go to Europe. I went to Cambridge to work under Patrick Blackett.",
            type: "dialog",
          },
          {
            characterName: "Robb",
            text: "Were you happier there than in America?",
            type: "dialog",
          },
        ],
      };
      // console.log("object", object);
      // expect(object).toMatchObject(expectedObject);
      // const correctness = await ensureCorrectness(object, expectedObject);
      // console.log("correctness", JSON.stringify(correctness, null, 2));
      // for await (const partialObject of partialObjectStream) {
      // console.clear();
      // console.log(partialObject);
      // }

      // console.log(result.object);
    }
  }, 1_000_000);
});
