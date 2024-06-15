import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

// import {
// createAssistant,
// createVectorStore,
// submitMessageToThread,
// uploadFile,
// } from "@acme/ai";
import { scrapeWebsite } from "@acme/ai";

// import { scrapeWebsite } from "@acme/ai/tools/scrape-website";

// import { desc, eq } from "@acme/db";
// import { CreatePostSchema, Post } from "@acme/db/schema";

import { publicProcedure } from "../trpc";

const characterFormat = z.object({
  characters: z.array(
    z.object({
      accent: z.string().optional(),
      aesthetics: z.string().optional(),
      ageRange: z.string().optional(),
      backstory: z.string().optional(),
      characterArc: z.string().optional(),
      difficulty: z.string().optional(),
      description: z.string().optional(),
      importance: z.string().optional(),
      costumeRequirements: z.string().optional(),
      name: z.string().optional(),
      emotionalRange: z.string().optional(),
      namePronunciation: z.string().optional(),
      lines: z.number().optional(),
      role: z.string().optional(),
      challenges: z.string().optional(),
      catchPhrases: z.string().optional(),
      personalityTraits: z.string().optional(),
      humor: z.string().optional(),
      physicalTraits: z.string().optional(),
      dislikes: z.string().optional(),
      quote: z.string().optional(),
      fears: z.string().optional(),
      relationships: z.string().optional(),
      hobbies: z.string().optional(),
      inspirations: z.string().optional(),
      props: z.string().optional(),
      likes: z.string().optional(),
      topScene: z.string().optional(),
      motivations: z.string().optional(),
      voiceType: z.string().optional(),
      skillsTalents: z.string().optional(),
      strengths: z.string().optional(),
      weaknesses: z.string().optional(),
    }),
  ),
});

const scriptMetadataFormat = z.object({
  director: z.string().optional(),
  genre: z.string().optional(),
  logLine: z.string().optional(),
  name: z.string().optional(),
  pageCount: z.string().optional(),
  setting: z.string().optional(),
  awards: z.string().optional(),
  targetAudience: z.string().optional(),
  nominations: z.string().optional(),
  themes: z.string().optional(),
  timePeriod: z.string().optional(),
  topScenes: z.string().optional(),
  tone: z.string().optional(),
  writers: z.string().optional(),
});

const scriptPageFormat = z.object({
  generalLocation: z.string().optional(),
  lines: z.array(
    z.object({
      character: z.string(),
      dialogue: z.string(),
    }),
  ),
  lighting: z.string().optional(),
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
  all: publicProcedure
    .input(z.object({ url: z.string() }))
    .query(({ input }) => {
      // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
      // return ctx.db.query.Post.findMany({
      //   orderBy: desc(Post.id),
      //   limit: 10,
      // });
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
      // return ctx.db.query.Post.findMany({
      //   orderBy: desc(Post.id),
      //   limit: 10,
      // });
    }),
  scrapeUrl: publicProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      console.log("in here");
      const websiteContent = await scrapeWebsite({ url: input.url });
      console.log(websiteContent);
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
