import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

// import {
// createAssistant,
// createVectorStore,
// submitMessageToThread,
// uploadFile,
// } from "@on-script/ai";
// import { scrapeWebsite } from "@on-script/ai";
import { desc } from "@on-script/db";
import { Script } from "@on-script/db/schema";

// import { scrapeWebsite } from "@on-script/ai/tools/scrape-website";

// import { desc, eq } from "@on-script/db";
// import { CreatePostSchema, Post } from "@on-script/db/schema";

import { publicProcedure } from "../trpc";

const _characterFormat = z.object({
  characters: z.array(
    z.object({
      accent: z.string().optional(),
      aesthetics: z.string().optional(),
      ageRange: z.string().optional(),
      backstory: z.string().optional(),
      catchPhrases: z.string().optional(),
      challenges: z.string().optional(),
      characterArc: z.string().optional(),
      costumeRequirements: z.string().optional(),
      description: z.string().optional(),
      difficulty: z.string().optional(),
      dislikes: z.string().optional(),
      emotionalRange: z.string().optional(),
      fears: z.string().optional(),
      hobbies: z.string().optional(),
      humor: z.string().optional(),
      importance: z.string().optional(),
      inspirations: z.string().optional(),
      likes: z.string().optional(),
      lines: z.number().optional(),
      motivations: z.string().optional(),
      name: z.string().optional(),
      namePronunciation: z.string().optional(),
      personalityTraits: z.string().optional(),
      physicalTraits: z.string().optional(),
      props: z.string().optional(),
      quote: z.string().optional(),
      relationships: z.string().optional(),
      role: z.string().optional(),
      skillsTalents: z.string().optional(),
      strengths: z.string().optional(),
      topScene: z.string().optional(),
      voiceType: z.string().optional(),
      weaknesses: z.string().optional(),
    }),
  ),
});

const _scriptMetadataFormat = z.object({
  awards: z.string().optional(),
  director: z.string().optional(),
  genre: z.string().optional(),
  logLine: z.string().optional(),
  name: z.string().optional(),
  nominations: z.string().optional(),
  pageCount: z.string().optional(),
  setting: z.string().optional(),
  targetAudience: z.string().optional(),
  themes: z.string().optional(),
  timePeriod: z.string().optional(),
  tone: z.string().optional(),
  topScenes: z.string().optional(),
  writers: z.string().optional(),
});

const _scriptPageFormat = z.object({
  generalLocation: z.string().optional(),
  lighting: z.string().optional(),
  lines: z.array(
    z.object({
      character: z.string(),
      dialogue: z.string(),
    }),
  ),
  name: z.string().optional(),
  narration: z.string().optional(),
  notes: z.string().optional(),
  sceneNumber: z.number().optional(),
  slugLine: z.string().optional(),
  specificLocation: z.string().optional(),
  time: z.string().optional(),
  transition: z.string().optional(),
  weather: z.string().optional(),
});

export const scriptRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Script.findMany({
      limit: 10,
      orderBy: desc(Script.createdAt),
    });
  }),
  byId: publicProcedure.input(z.object({ id: z.string() })).query(() => {
    // return ctx.db.select().from(Script).where({ id: input.id });
  }),
  scrapeUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(() => {
      console.log("in here");
      // const websiteContent = await scrapeWebsite({ url: input.url });
      // console.log(websiteContent);
      // const vectorStore = await createVectorStore({ name: "scrape-2" });
      // await uploadFile({
      //   vectorStoreId: vectorStore.id,
      //   file: websiteContent.pdf,
      //   name: "movie-2.pdf",
      // });

      // fs.writeFileSync("movie-2.pdf", websiteContent.pdf);

      // const assistant = await createAssistant({
      //   name: "movie",
      //   vectorStoreId: vectorStore.id,
      // });

      // const characterResponse = await submitMessageToThread({
      //   assistantId: assistant.id,
      //   formatSchema: characterFormat,
      //   message: `Extract top 5 characters from this script`,
      // });

      // const scriptResponse = await submitMessageToThread({
      //   assistantId: assistant.id,
      //   formatSchema: scriptMetadataFormat,
      //   message: `Extract the following information about this script.`,
      // });

      return {
        foo: true,
        // characterResponse,
        // scriptResponse,
      };
    }),
} satisfies TRPCRouterRecord;
