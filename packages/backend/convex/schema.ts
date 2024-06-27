import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  characters: defineTable({
    createdAt: v.string(),
    id: v.string(),
    name: v.string(),
    object: v.literal("character"),
    scriptId: v.string(),
    summary: v.string(),
    updatedAt: v.string(),
  }),
  scripts: defineTable({
    basedOn: v.string(),
    basedOnBy: v.string(),
    // createdAt: v.string(),
    // id: v.string(),
    object: v.literal("script"),
    readingTime: v.float64(),
    speakingTime: v.float64(),
    title: v.string(),
    // updatedAt: v.string(),
    writtenBy: v.string(),
  }),
});
