import type { Browser, Page } from "playwright";
import pdfParse from "pdf-parse";
import { chromium } from "playwright";
import { z } from "zod";

import { chat } from "../client";

const doNotHallucinate =
  "This is optional, if it does not get mentioned then do not make it up and set it to null";

const sceneSchema = z.object({
  scenes: z
    .array(
      z.object({
        cameraShot: z
          .string()
          .describe(
            `Description of the camera shot used in the scene. ${doNotHallucinate}`,
          )
          .nullish(),
        dialog: z
          .array(
            z.object({
              speaker: z
                .string()
                .describe(
                  "The name of the character speaking or 'narrator' for narration.",
                ),
              text: z.string().describe("The text of the dialog or narration."),
            }),
          )
          .describe(
            "An array of dialog objects, each containing a speaker and their text.",
          ),
        generalLocation: z
          .string()
          .describe(`The general location of the scene. ${doNotHallucinate}`)
          .nullish(),
        interTitle: z
          .string()
          .describe(`Inter title text used in the scene. ${doNotHallucinate}`)
          .nullish(),
        lighting: z
          .string()
          .describe(`The lighting used in the scene. ${doNotHallucinate}`)
          .nullish(),
        locationType: z
          .string()
          .describe(
            "The type of location (e.g., interior or exterior). " +
              doNotHallucinate,
          )
          .nullish(),
        name: z
          .string()
          .describe(`The name of the scene. ${doNotHallucinate}`)
          .nullish(),
        notes: z
          .string()
          .describe(`Any additional notes about the scene. ${doNotHallucinate}`)
          .nullish(),
        rawText: z.string().describe("The raw text of the scene."),
        sceneNumber: z
          .number()
          .describe(
            "The number of the scene. This is optional, if it does not get mentioned then do not make it up and set it to null.",
          )
          .nullish(),
        slugLine: z
          .string()
          .describe(
            "The slug line of the scene, typically describing the location and time. " +
              doNotHallucinate,
          )
          .nullish(),
        sounds: z
          .string()
          .describe(`Any sounds described in the scene. ${doNotHallucinate}`)
          .nullish(),
        specialNotes: z
          .string()
          .describe(
            `Any special notes regarding the scene. ${doNotHallucinate}`,
          )
          .nullish(),
        specificLocation: z
          .string()
          .describe(
            "The specific location within the general location. " +
              doNotHallucinate,
          )
          .nullish(),
        timeOfDay: z
          .string()
          .describe(
            `The time of day the scene takes place. ${doNotHallucinate}`,
          )
          .nullish(),
        transition: z
          .string()
          .describe(`The transition to the next scene. ${doNotHallucinate}`)
          .nullish(),
        visualStyle: z
          .string()
          .describe(`The visual style of the scene. ${doNotHallucinate}`)
          .nullish(),
        weather: z
          .string()
          .describe(
            `The weather conditions during the scene. ${doNotHallucinate}`,
          )
          .nullish(),
        year: z
          .number()
          .describe(`The year the scene takes place in. ${doNotHallucinate}`)
          .nullish(),
      }),
    )
    .describe(
      "An array of scenes, each containing various details about the scene.",
    ),
});

type SceneSchema = z.infer<typeof sceneSchema>["scenes"];

export async function scrapeWebsite(props: { url: string }) {
  let browser: Browser | undefined;
  let page: Page | undefined;
  const foo = {
    arg: "3",
    bar: "1",
    car: "2",
  };

  try {
    let pdfBuffer: Buffer;
    let title: string;

    // Check if the URL is a PDF
    if (props.url.endsWith(".pdf")) {
      // Download the PDF using fetch
      const response = await fetch(props.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      console.log("here");
      const pdfArrayBuffer = await response.arrayBuffer();
      pdfBuffer = Buffer.from(pdfArrayBuffer);
      title = new URL(props.url).pathname.split("/").pop() ?? "Untitled";
    } else {
      // Launch the browser
      browser = await chromium.launch({ headless: true });

      // Create a new page
      page = await browser.newPage();

      // Navigate to the URL
      await page.goto(props.url);

      // Wait for the content to load (customize this selector based on your target website)
      await page.emulateMedia({ media: "screen" });
      title = await page.title();
      pdfBuffer = await page.pdf();
    }

    // Extract text from the PDF in overlapping chunks
    const textChunks = await extractTextChunksFromPDF({
      chunkSize: 50,
      overlapSize: 10,
      pdfBuffer,
    }); // Adjust chunk and overlap size as needed

    // Use OpenAI to identify scenes and extract metadata
    let scenes: SceneSchema = [];
    for (const chunk of textChunks) {
      const chunkScenes = await extractScenesWithMetadata(chunk);
      scenes.push(...chunkScenes.scenes);
    }

    // Merge overlapping scenes
    scenes = mergeOverlappingScenes(scenes);

    console.log("Extracted scenes:", scenes);

    return { scenes, title };
  } catch (error) {
    console.error("Error scraping website:", error);
    throw error;
  } finally {
    // Close the browser
    if (browser) {
      await browser.close();
    }
  }
}

// Function to extract text from PDF in overlapping chunks
async function extractTextChunksFromPDF(props: {
  pdfBuffer: Buffer;
  chunkSize: number;
  overlapSize: number;
}): Promise<string[]> {
  const { pdfBuffer, chunkSize, overlapSize } = props;
  const pdfData = await pdfParse(pdfBuffer);
  const text = pdfData.text;
  // console.log(text);
  const textChunks: string[] = [];
  const lines = text.split("\n");

  for (let index = 0; index < lines.length; index += chunkSize - overlapSize) {
    const chunk = lines.slice(index, index + chunkSize).join("\n");
    textChunks.push(chunk);
  }

  return textChunks;
}

// Function to use OpenAI to extract scenes with metadata
async function extractScenesWithMetadata(text: string) {
  return chat({
    formatSchema: sceneSchema,
    message: `
    Act as a data transformation expert proficient in handling and structuring movie scripts. Your tasks involve extracting dialog and narration from a provided PDF movie script, organizing the extracted content into a structured JSON array, and defining a Zod schema to validate the structured data. Follow the detailed chain of thought tasks to ensure accurate and complete transformation.

    1. Extract Dialog and Narration:
      - Identify and extract all dialog and narration from the provided movie script. This includes differentiating between dialog spoken by characters and narrative text.
      - Include all narration in between dialog sections.

    2. Organize Extracted Text:
      - Structure the extracted dialog and narration into a JSON array format. Ensure that each entry correctly identifies whether it's dialog or narration, and include speaker names for dialog.

    Use the following movie script to extract scenes and metadata:

    --- Start Movie Script ---
    ${text}
    --- End Movie Script ---`,
    model: "gpt-4o",
    temperature: 0,
  });
}

// Function to merge overlapping scenes
function mergeOverlappingScenes(scenes: SceneSchema): SceneSchema {
  const mergedScenes: SceneSchema = [];
  let lastScene = "";

  for (const scene of scenes) {
    if (!lastScene.endsWith(scene.rawText)) {
      mergedScenes.push(scene);
    }
    lastScene = scene.rawText;
  }

  return mergedScenes;
}
