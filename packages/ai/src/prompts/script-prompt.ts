import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const scriptSchema = z.object({
  basedOn: z
    .string()
    .nullish()
    .transform((value) =>
      value === null || value === "null" ? undefined : value,
    )
    .describe("The source material the script is based on."),
  basedOnBy: z
    .string()
    .nullish()
    .transform((value) =>
      value === null || value === "null" ? undefined : value,
    )
    .describe("The author of the source material the script is based on."),
  title: z.string().describe("The title of the movie script."),
  writtenAt: z
    .string()
    .nullish()
    .transform((value) =>
      value === null || value === "null" ? undefined : value,
    )
    .describe("The date the script was written."),
  writtenBy: z
    .string()
    .nullish()
    .transform((value) =>
      value === null || value === "null" ? undefined : value,
    )
    .describe("The writer of the movie script."),
});

export type ScriptSchemaType = z.infer<typeof scriptSchema>;

export const scriptPrompt = () => `
**Objective:**
As an expert in data transformation, your task is to accurately extract specific information from the attached movie script and organize this content into a structured JSON object. Your attention to detail is critical to ensure the transformation is both accurate and complete.

**Instructions:**

1. **Extract Script Information:**

   - Identify and extract the following fields from the provided movie script:
     - **Based On**: The source material the script is based on. Return undefined if not available.
     - **Based On By**: The author of the source material the script is based on. Return undefined if not available.
     - **Title**: The title of the movie script.
     - **Written By**: The writer of the movie script. Return undefined if not available.
     - **Written At**: The date the movie script was written. If it is not available, then try to figure out when it was written. Return undefined if not available.

2. **Organize Extracted Information:**

   - Structure the extracted content into a JSON object format.
   - Each JSON entry should include:
     - The \`basedOn\` field, if present. Return undefined if not available.
     - The \`basedOnBy\` field, if present. Return undefined if not available.
     - The \`title\` field.
     - The \`writtenBy\` field, if present. Return undefined if not available.
     - The \`writtenAt\` field, if present. If it is not available then try to figure out when it was written. Return undefined if not available.

3. **Output Format:**
   - Return the following JSON Schema where each element contains:
     - The source material the script is based on. Return undefined if not available.
     - The author of the source material the script is based on. Return undefined if not available.
     - The title of the movie script.
     - The writer of the movie script. Return undefined if not available.
     - The date the script was written, if available. Format this into a standard date format. Return undefined if not available.

--- START JSON SCHEMA ---
${JSON.stringify(zodToJsonSchema(scriptSchema), null, 2)}
--- END JSON SCHEMA ---
`;
