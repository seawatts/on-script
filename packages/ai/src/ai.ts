import { readFileSync } from "node:fs";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { createCanvas } from "canvas";
import { PDFDocument } from "pdf-lib";
import { z } from "zod";

async function pdfToImageBuffers(pdfPath: string): Promise<Buffer[]> {
  // Read the PDF file
  const pdfBytes = readFileSync(pdfPath);

  // Load the PDF document
  const pdfDocument = await PDFDocument.load(pdfBytes);
  const numberPages = pdfDocument.getPageCount();
  const imageBuffers: Buffer[] = [];

  for (let index = 0; index < numberPages; index++) {
    const page = pdfDocument.getPage(index);

    // Create a canvas to draw the page onto
    const canvas = createCanvas(page.getWidth(), page.getHeight());
    // const context = canvas.getContext("2d");

    // Render the page onto the canvas
    // const imgData = await page.render({
    //   canvasContext: context,
    //   viewport: page.getViewport({ scale: 1 }),
    // });

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer("image/png");
    imageBuffers.push(buffer);

    // Optional: Save the image buffer to a file for debugging
    // writeFileSync(`page-${i + 1}.png`, buffer);
  }

  return imageBuffers;
}

// Example usage
const pdfPath = "path/to/your.pdf";
const imageBuffers = await pdfToImageBuffers(pdfPath);

// Now you can use imageBuffers to call Vercel AI prompt
for (const [index, buffer] of imageBuffers.entries()) {
  // Replace this with your Vercel AI prompt call
  console.log(`Page ${index + 1} image buffer size: ${buffer.length} bytes`);
}

// define a schema for the notifications
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      message: z.string().describe("Message. Do not use emojis or links."),
      name: z.string().describe("Name of a fictional person."),
    }),
  ),
});

export async function foo() {
  const result = await generateObject({
    maxTokens: 4096,
    messages: [
      {
        content: `Act as a system and generate 3 notifications for a messages app in this context:`,
        role: "system",
      },
      {
        content: [
          {
            image: Buffer.from(""),
            mimeType: "image/png",
            type: "image",
          },
        ],
        role: "user",
      },
    ],
    model: openai("gpt-4o"),
    prompt: `Generate 3 notifications for a messages app in this context:`,
    schema: notificationSchema,
    temperature: 0,
  });

  console.log(result);
}
