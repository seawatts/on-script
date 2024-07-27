/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import type { CharacterForSet } from "../types";

// Define the schema for metadata

const sceneSchemaObject = z.object({
  charactersIds: z
    .array(z.string())
    .describe("A list of characters ids involved in the scene."),
  elementIndices: z
    .array(z.number())
    .describe("A list of element indices involved in the scene."),
  keywords: z
    .array(z.string())
    .describe("A list of significant keywords or key phrases."),
  location: z.string().describe("The location of the scene."),
  popularityScore: z
    .number()
    .min(1)
    .max(10)
    .describe(
      "A score indicating the popularity of the scene, based on how often it is rewatched or quoted (1-5, with 5 being the most popular).",
    ),
  sentiment: z.string().describe("The overall sentiment or mood of the scene."),
  summary: z
    .string()
    .describe("A concise summary of the scene's main events and context."),
  themes: z
    .array(z.string())
    .describe("The themes or motifs present in the scene."),
  time: z
    .string()
    .optional()
    .transform((value) =>
      value === null || value === "null" ? undefined : value,
    )
    .describe("The time of day."),
  title: z.string().describe("A brief, descriptive title for the scene."),
});

// Define the schema for the scene object
export const sceneSchema = z.object({
  scenes: z.array(sceneSchemaObject).describe("A list of scene objects."),
});

export type SceneSchemaType = z.infer<typeof sceneSchema>;
export type SceneSchemaObjectType = z.infer<typeof sceneSchemaObject>;

export const scenePrompt = (props: { characters: Set<CharacterForSet> }) => `
**Objective:**
As an expert in data transformation and summarization, your task is to summarize the provided movie script text, create titles, extract additional metadata, and assign popularity scores. The summaries, titles, metadata, and popularity scores should capture the essence of the scenes, making them easily searchable and sortable for quick reference.

**Instructions:**

1. **Identify and Separate Scenes:**
   - Read through the provided movie script text.
   - Determine if there are multiple scenes present.
   - Separate the scenes into distinct objects if they are separate. If the scenes are connected (e.g., flashbacks, direct continuations), keep them as one object.

2. **Summarize Each Scene:**
   - For each identified scene, write a concise summary that encapsulates the key points and overall context of the scene.
   - The summary should be brief (2-3 sentences) but comprehensive enough to provide a clear understanding of the scene.

3. **Create Titles:**
   - For each identified scene, create a title that reflects the primary focus or highlight of the scene.
   - The title should be short (3-6 words) and descriptive, providing an immediate sense of what the scene entails.

4. **Extract Additional Fields for Each Scene:**
    - **Keywords**: Identify significant keywords or key phrases from the scene.
    - **CharacterIds**: List the characters involved in the scene.
    - **ElementIndices**: List the elements involved in the scene.
    - **Location**: Specify the location of the scene if mentioned.
    - **Time**: Indicate the time of day (e.g., DAY, NIGHT) if mentioned.
    - **Sentiment**: Analyze and indicate the overall sentiment or mood of the scene (e.g., tense, humorous, dramatic).
    - **Important Objects/Events**: Identify any important objects or events that play a critical role in the scene.
    - **Themes**: Extract themes or motifs present in the scene (e.g., betrayal, love, conflict).

5. **Assign Popularity Scores:**
   - Determine whether each scene is one of the more popular scenes in the movie, based on how often it is rewatched or quoted.
   - Assign a popularity score (e.g., 1-10, with 10 being the most popular).

**Example Input:**

\`\`\`json
{
  elements: [
    {
      characterId: "1",
      characterName: "SENATE AIDE",
      extension: "CONT'D",
      text: "President Eisenhower's asked you to be in his cabinet, the Senate has no choice but to confirm you.",
      type: "dialog",
    },
    {
      text: "They arrive at the door.",
      type: "action",
    },
    {
      characterId: "2",
      characterName: "STRAUSS",
      text: "And if they bring up Oppenheimer?",
      type: "dialog",
    },
    {
      characterId: "1",
      characterName: "SENATE AIDE",
      text: "When they bring up Oppenheimer, answer honestly and no senator can deny that you did your duty. It'll be uncomfortable...",
      type: "dialog",
    },
    {
      characterId: "1",
      text: "(smiles)",
      type: "parenthetical",
    },
    {
      characterId: "1",
      characterName: "SENATE AID",
      text: "Who'd want to justify their whole life?",
      type: "dialog",
    },
    {
      text: "The door to the VAST committee room opens- they enter, FLASHBULBS POPPING as PRESS and PUBLIC see Strauss.",
      type: "action",
    },
    {
      characterId: "3",
      characterName: "ROBB",
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
      characterId: "5",
      characterName: "OPPENHEIMER",
      text: "I wanted to learn the *new* physics.",
      type: "dialog",
    },
    {
      characterId: "4",
      characterName: "GRAY",
      text: "Was there nowhere here? I thought Berkeley had the leading theoretical physics department-",
      type: "dialog",
    },
    {
      characterId: "5",
      characterName: "OPPENHEIMER",
      text: "Sure. Once I built it. First I had to go to Europe. I went to Cambridge to work under Patrick Blackett.",
      type: "dialog",
    },
    {
      characterId: "3",
      characterName: "ROBB",
      text: "Were you happier there than in America?",
      type: "dialog",
    },
  ],
}
\`\`\`

**Example Output:**

\`\`\`json
{
  "scenes": [
    {
      "title": "Strauss' Confirmation Hearing",
      "summary": "Strauss is prepared by a Senate Aide for his confirmation hearing, discussing how to handle questions about Oppenheimer. As they enter the committee room, flashbulbs pop.",
      "keywords": ["Strauss", "Senate Aide", "Oppenheimer", "confirmation hearing", "flashbulbs"],
      "characters": ["Strauss", "Senate Aide"],
      "location": "committee room",
      "time": "",
      "sentiment": "tense",
      "themes": ["duty", "truth"],
      "popularityScore": 4
    },
    {
      "title": "Oppenheimer's Flashback",
      "summary": "In a flashback, Oppenheimer explains his move to Europe to study physics. The scene shifts to a small, shabby room where he defends his decision to the Atomic Energy Commission.",
      "keywords": ["Oppenheimer", "Europe", "physics", "Atomic Energy Commission"],
      "characters": ["c_123", "c_jasdf2"],
      "location": "ROOM 2022, ATOMIC ENERGY COMMISSION",
      "time": "DAY",
      "sentiment": "reflective",
      "themes": ["academic pursuit", "defense"],
      "popularityScore": 3
    }
  ]
}
\`\`\`

**Output Format:**

- Return a JSON array of objects, each containing:
  - The **title** of the scene.
  - The **summary** of the scene.
  - **Keywords**: A list of significant keywords or key phrases.
  - **CharactersIds**: A list of characters ids involved in the scene.
  - **Location**: The location of the scene.
  - **Time**: The time of day.
  - **Sentiment**: The overall sentiment or mood of the scene.
  - **Themes**: The themes or motifs present in the scene.
  - The **popularityScore** of the scene.

--- START EXISTING CHARACTERS ---
${JSON.stringify([...props.characters], null, 2)}
--- END EXISTING CHARACTERS ---

--- START JSON SCHEMA ---
${JSON.stringify(zodToJsonSchema(sceneSchema), null, 2)}
--- END JSON SCHEMA ---
`;
