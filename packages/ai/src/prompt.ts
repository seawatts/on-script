import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const schema = z.object({
  elements: z.array(
    z.object({
      // characterId: z
      //   .string()
      //   .optional()
      //   .describe("The ID of the character speaking."),
      characterName: z
        .string()
        .optional()
        .describe("The name of the character speaking."),
      dual: z.boolean().optional().describe("Whether the dialogue is dual."),
      extension: z
        .string()
        .optional()
        .describe("The extension of the dialogue."),
      // readingTime: z
      //   .number()
      //   .optional()
      //   .describe("The reading time of the dialogue."),
      // speakingTime: z
      //   .number()
      //   .optional()
      //   .describe("The speaking time of the dialogue."),
      text: z
        .string()
        .describe(
          "The dialogue text. Not including the speaker name. Not including the extensions.",
        ),
      type: z.string().optional().describe("The type of text."),
    }),
  ),
});

export const prompt = `
**Objective:**
As an expert in data transformation, your task is to accurately extract dialog, scene headings, action, parentheticals, transitions, shot numbers, and any other narration from the attached image of a movie script and organize this content into a structured JSON array. Your attention to detail is critical to ensure the transformation is both accurate and complete.

**Instructions:**

1. **Extract Script Elements:**

   - Identify and extract all elements from the provided movie script image, including:
     - Dialog
     - Scene headings, including INT./EXT., DAY/NIGHT, and any other scene descriptions
     - Action
     - Parentheticals
     - Transitions
     - Shot numbers
     - Any other narration

2. **Extract Parentheticals:**
   - Identify and extract any parentheticals (e.g., (smiling), (whispering), (sarcastic), etc.).
   - Include the parentheticals in the JSON output as it's own element, not the same text as the dialog is happening in.

3. **Organize Extracted Text:**

   - Structure the extracted content into a JSON array format.
   - Each JSON entry should:
     - Specify the type of element (e.g., dialog, scene heading, action, etc.).
     - Do NOT include the speaker's name in the text for the dialog entries. Only include the spoken text.
     - Do NOT include the extensions (e.g., V.O., O.S., CONT'D) in the dialog text. Include them as a separate field.

4. **Dual Dialog Handling:**

   - If dialog is dual (simultaneous and side-by-side in the image), add an extra value to denote this.
   - Example:

     - Input:

     \`\`\`text
          ROBB
     I'm not a Stark.                     OPPENHEIMER (V.O.)
                                                     You are to me.
     \`\`\`

     - Output:

     \`\`\`json
     [
       {
         "text": "I'm not a Stark.",
         "type": "dialog",
         "characterName": "Robb",
         "dual": true,
       },
       {
         "text": "You are to me.",
         "type": "dialog",
         "characterName": "Oppenheimer",
         "extension": "V.O.",
         "dual": true,
       }
     ]
     \`\`\`

6. Character Extensions Handling:
   - Identify and extract any character extensions (e.g., V.O., O.S., CONT’D, O.C., FILTERED, P.A.).
   - Include the character extension in the JSON output.

**Output Format:**

- Return a the following JSON Schema where each element contains:
  - The text (dialog, scene heading, action, parenthetical, transition, shot number, or narration).
  - The type of element.
  - The character's name (or "Narrator" if not dialog).
  - The character extensions (V.O., O.S., CONT'D, etc. if applicable)
  - Any additional metadata, including a flag for dual dialog if present.
  - If you see bolded text in the image, please include it in the output as the text surrounded by '**'. e.x. "This is **bold** text."

--- START JSON SCHEMA ---
${JSON.stringify(zodToJsonSchema(schema), null, 2)}
--- END JSON SCHEMA ---
`;
