import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { elementTypeEnum } from "@on-script/db/schema";

import type { CharacterForSet } from "../types";

export const elementsSchema = z.object({
  elements: z.array(
    z.object({
      characterId: z
        .string()
        .nullish()
        .transform((value) =>
          value === null || value === "null" ? undefined : value,
        )
        .describe("The ID of the character speaking."),
      characterName: z
        .string()
        .nullish()
        .transform((value) =>
          value === null || value === "null" ? undefined : value,
        )
        .describe(
          "The name of the character speaking, or ‘Narrator’ for actual narrative text.",
        ),
      dual: z
        .boolean()
        .nullish()
        .transform((value) =>
          value === null || value?.toString() === "null" ? undefined : value,
        )
        .describe(
          "Whether the dialogue is dual, two people speaking at the same time.",
        ),
      extension: z
        .string()
        .nullish()
        .transform((value) =>
          value === null || value === "null" ? undefined : value,
        )
        .describe("The extension of the dialogue."),
      isCharacterExtra: z
        .boolean()
        .nullish()
        .transform((value) =>
          value === null || value?.toString() === "null" ? undefined : value,
        )
        .describe(
          "Whether the character is an extra, not a main character in the script.",
        ),
      isElementCutOffOfImage: z
        .boolean()
        .nullish()
        .transform((value) =>
          value === null || value?.toString() === "null" ? undefined : value,
        )
        .describe("Whether the element is cut off in the image."),
      text: z
        .string()
        .describe(
          "The dialogue text, excluding the speaker name and extensions.",
        ),
      type: z
        .enum(elementTypeEnum.enumValues)
        .describe(
          "The type of text element (e.g., dialog, sceneHeading, action, etc.)",
        ),
    }),
  ),
});

export type ElementsSchemaType = z.infer<typeof elementsSchema>;

export const elementsPrompt = (props: { characters: Set<CharacterForSet> }) => `
**Objective:**
As an expert in data transformation, your task is to accurately extract dialog, sceneHeadings, action, parentheticals, transitions, and any other narration from the attached image of a movie script and organize this content into a structured JSON array. Your attention to detail is critical to ensure the transformation is both accurate and complete.

**Instructions:**

1. **Extract Script Elements:**
   - Identify and extract all elements from the provided movie script image, including:
     - **Dialog**: The spoken words by characters.
     - **Scene Headings**: The headers that indicate the setting and time of the scene, usually formatted as INT. (interior) or EXT. (exterior) followed by the location and time (e.g., DAY, NIGHT).
     - **Action**: Descriptions of what is happening on screen, often in present tense. This includes any physical actions or events taking place (e.g., "They arrive at the door.").
     - **Parentheticals**: Instructions or notes within parentheses that describe how the dialog should be delivered (e.g., (smiling), (whispering)).
     - **Transitions**: Instructions for how one scene transitions to another, typically capitalized (e.g., CUT TO:, FADE IN:).
     - **Narration**: Any other textual elements that provide additional context or description, not falling into the above categories.

2. **Handle Character Names and Dialog:**
   - If a line above the dialog contains the character name, associate it with the dialog text below.
   - Ensure that character names are not included in the dialog text itself.

3. **Extract Parentheticals:**
   - Identify and extract any parentheticals, ensuring they are distinct and created as a separate element from the dialog text.
   - Include parentheticals in the JSON output as their own element.

4. **Organize Extracted Text:**
   - Structure the extracted content into a JSON array format.
   - Each JSON entry should:
     - Specify the type of element (e.g., dialog, sceneHeading, action, etc.).
     - Exclude the speaker's name in the text for dialog entries, including only the spoken text.
     - Exclude extensions (e.g., V.O., O.S., CONT'D) in the dialog text, including them as a separate field.
     - Avoid incorrectly labeling actions and sceneHeadings as "Narrator." Only label elements as "Narrator" if they are actual narrative text.

5. **Dual Dialog Handling:**
   - For dual dialog (simultaneous and side-by-side in the image), add a flag to denote this.
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
         "isMainCharacter": true,
         "characterName": "ROBB",
         "dual": true,
         "characterId": "3"
       },
       {
         "text": "You are to me.",
         "type": "dialog",
         "isMainCharacter": true,
         "characterName": "OPPENHEIMER",
         "extension": "V.O.",
         "characterId": "5",
         "dual": true,
       }
     ]
     \`\`\`

6. **Character Extensions Handling:**
   - Identify and extract any character extensions (e.g., V.O., O.S., CONT’D, O.C., FILTERED, P.A.).
   - Include the character extension in the JSON output.

7. **Character Id Handling:**
   - Use the "EXISTING CHARACTERS" section below to map character names to their corresponding "characterId" for dialog and parenthetical elements.
   - If the name of the character speaking is not in the "EXISTING CHARACTERS" section, do not assign an id.
   - If the name of the character speaking does not match the exact name, but can be inferred from the context, assign the correct "characterId."
   - If the element is a dialog or parenthetical, include the "characterId" of the character speaking.

8. **Is Element Cut Off Handling:**
   - Include the "isElementCutOffOfImage" field to indicate whether the element is cut off in the image. This helps determine if it might continue on the next page or if it is being continued from the previous page.
   - This usually occurs at the beginning or end of a page.
   - It can happen if the sentence doesn't end. For example, "I am going to the" and the next page starts with "store."
   - It can happen if the element starts with a character name but does not include any dialog. For example, "ROBB (V.O.)" at the end of a page.

9. **Additional Metadata:**
   - Include the "isCharacterExtra" field to indicate whether the character is an extra, not a main character in the script.

10. **Correct Element Typing:**
   - Element type must strictly be one of the following: "action", "dialog", "sceneHeading", "transition", "parenthetical"
   - Ensure that actions are correctly labeled as "action" and not as "narration."

11. **Output Format:**
   - Return the following JSON Schema where each element contains:
     - The text (dialog, sceneHeading, action, parenthetical, transition).
     - The type of element.
     - The character's name (or "Narrator" if it is actual narrative text).
     - The character extensions (V.O., O.S., CONT'D, etc. if applicable).
     - Any additional metadata, including a flag for dual dialog if present.
     - If you see bolded text in the image, please include it in the output as text surrounded by '**' (e.g., "This is **bold** text.").
     - If the element is a dialog or parenthetical, include the characterId of the character speaking.
     - Include the "isCharacterExtra" field to indicate whether the character is an extra.
     - Include the "isElementCutOffOfImage" field to indicate whether the element is cut off in the image.
     - Do not include "(CONTINUED)" at the page footer.

--- START EXISTING CHARACTERS ---
${JSON.stringify([...props.characters], null, 2)}
--- END EXISTING CHARACTERS ---

--- START JSON SCHEMA ---
${JSON.stringify(zodToJsonSchema(elementsSchema), null, 2)}
--- END JSON SCHEMA ---
`;
