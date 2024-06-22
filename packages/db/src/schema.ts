import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { createId, generateRandomSlug } from "@on-script/id";

export const Script = pgTable("script", {
  basedOn: text("basedOn"),
  basedOnBy: text("basedOnBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId({ prefix: "script" }))
    .notNull()
    .primaryKey(),
  imageUrl: text("imageUrl"),
  readingTime: integer("readingTime").default(0).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  writtenBy: text("writtenBy").notNull(),
});

export type ScriptInsertSchema = typeof Script.$inferInsert;
export type ScriptSelectSchema = typeof Script.$inferSelect;
export type ScriptQuerySchema = ScriptSelectSchema & {
  readings: ReadingSelectSchema[];
  elements: ElementSelectSchema[];
  characters: CharacterSelectSchema[];
};

export const ScriptRelations = relations(Script, ({ many }) => ({
  characters: many(Character),
  elements: many(Element),
  readings: many(Reading),
}));

export const Character = pgTable("character", {
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId({ prefix: "c" }))
    .notNull()
    .primaryKey(),
  // introduced: varchar('introduced').notNull().references(() => Element.id, {
  //   onDelete: 'cascade',
  // }),
  name: varchar("name", { length: 256 }).notNull(),
  scriptId: varchar("scriptId")
    .notNull()
    .references(() => Script.id, {
      onDelete: "cascade",
    }),
  summary: text("summary"),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export type CharacterInsertSchema = typeof Character.$inferInsert;
export type CharacterSelectSchema = typeof Character.$inferSelect;
export type CharacterQuerySchema = CharacterSelectSchema & {
  elements: ElementSelectSchema[];
};

export const CharacterRelations = relations(Character, ({ one, many }) => ({
  characterAssignments: many(CharacterAssignment),
  elements: many(Element),
  script: one(Script, {
    fields: [Character.scriptId],
    references: [Script.id],
  }),
}));

export const elementTypeEnum = pgEnum("elementType", [
  "action",
  "dialog",
  "scene",
  "character",
  "transition",
  "parenthetical",
]);

export const ElementType = z.enum(elementTypeEnum.enumValues).Enum;

export const Element = pgTable("element", {
  characterId: varchar("characterId")
    .notNull()
    .references(() => Character.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId({ prefix: "e" }))
    .notNull()
    .primaryKey(),
  index: integer("index").notNull(),
  metadata: jsonb("metadata"),
  page: integer("page").notNull(),
  scene: integer("scene").notNull(),
  scriptId: varchar("scriptId")
    .notNull()
    .references(() => Script.id, {
      onDelete: "cascade",
    }),
  text: text("text").notNull(),
  type: elementTypeEnum("type").notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export type ElementInsertSchema = typeof Element.$inferInsert;
export type ElementSelectSchema = typeof Element.$inferSelect;
export type ElementQuerySchema = ElementSelectSchema & {
  character: CharacterSelectSchema;
};

export const ElementRelations = relations(Element, ({ one }) => ({
  character: one(Character, {
    fields: [Element.characterId],
    references: [Character.id],
  }),
  script: one(Script, {
    fields: [Element.scriptId],
    references: [Script.id],
  }),
}));

export const CreateScriptSchema = createInsertSchema(Script, {
  title: z.string().max(256),
}).omit({
  createdAt: true,
  id: true,
  updatedAt: true,
});

export const User = pgTable("user", {
  avatarUrl: text("avatarUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  email: text("email").notNull().unique(),
  firstName: text("firstName"),
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  lastName: text("lastName"),
  online: boolean("online").default(false).notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export type UserInsertSchema = typeof User.$inferInsert;
export type UserSelectSchema = typeof User.$inferSelect;

export const UserRelations = relations(User, ({ many }) => ({
  characterAssignments: many(CharacterAssignment),
  readingSessions: many(ReadingSession),
  readings: many(Reading),
}));

export const Reading = pgTable("reading", {
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  createdById: varchar("createdById")
    .references(() => User.id, {
      onDelete: "cascade",
    })
    .notNull(),
  currentElementId: varchar("currentElementId").references(() => Element.id, {
    onDelete: "cascade",
  }),
  endedAt: timestamp("endedAt"),
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId({ prefix: "reading" }))
    .notNull()
    .primaryKey(),
  scriptId: varchar("scriptId")
    .notNull()
    .references(() => Script.id, {
      onDelete: "cascade",
    }),
  slug: varchar("slug", { length: 128 })
    .$defaultFn(() => generateRandomSlug({ length: 5 }))
    .notNull()
    .unique(),
  startedAt: timestamp("startedAt"),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export type ReadingInsertSchema = typeof Reading.$inferInsert;
export type ReadingSelectSchema = typeof Reading.$inferSelect;
export type ReadingQuerySchema = ReadingSelectSchema & {
  createdBy: UserSelectSchema;
  script: ScriptSelectSchema & {
    characters?: CharacterSelectSchema[];
    elements?: ElementSelectSchema[];
  };
  readingSessions: ReadingSessionSelectSchema[];
  currentElement?: ElementSelectSchema | null;
};

export const ReadingRelations = relations(Reading, ({ many, one }) => ({
  characterAssignments: many(CharacterAssignment),
  createdBy: one(User, {
    fields: [Reading.createdById],
    references: [User.id],
  }),
  currentElement: one(Element, {
    fields: [Reading.currentElementId],
    references: [Element.id],
  }),
  readingSessions: many(ReadingSession),
  script: one(Script, {
    fields: [Reading.scriptId],
    references: [Script.id],
  }),
}));

export const ReadingSession = pgTable("reading_session", {
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId({ prefix: "rs" }))
    .notNull()
    .primaryKey(),
  online: boolean("online").default(false).notNull(),
  readingId: varchar("readingId").references(() => Reading.id, {
    onDelete: "cascade",
  }),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  userId: varchar("userId").references(() => User.id, { onDelete: "cascade" }),
});

export type ReadingSessionInsertSchema = typeof ReadingSession.$inferInsert;
export type ReadingSessionSelectSchema = typeof ReadingSession.$inferSelect;

export const ReadingSessionRelations = relations(ReadingSession, ({ one }) => ({
  reading: one(Reading, {
    fields: [ReadingSession.readingId],
    references: [Reading.id],
  }),
  user: one(User, {
    fields: [ReadingSession.userId],
    references: [User.id],
  }),
}));

export const CharacterAssignment = pgTable("character_assignment", {
  characterId: varchar("characterId")
    .notNull()
    .references(() => Character.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId({ prefix: "ca" }))
    .notNull()
    .primaryKey(),
  readingId: varchar("readingId").references(() => Reading.id, {
    onDelete: "cascade",
  }),
  // readingSessionId: varchar("readingSessionId")
  // .notNull()
  // .references(() => ReadingSession.id, { onDelete: "cascade" }),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  userId: varchar("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
});

export type CharacterAssignmentInsertSchema =
  typeof CharacterAssignment.$inferInsert;
export type CharacterAssignmentSelectSchema =
  typeof CharacterAssignment.$inferSelect;

export type CharacterAssignmentQuerySchema = CharacterAssignmentSelectSchema & {
  user: UserSelectSchema;
};

export const CharacterAssignmentsRelations = relations(
  CharacterAssignment,
  ({ one }) => ({
    character: one(Character, {
      fields: [CharacterAssignment.characterId],
      references: [Character.id],
    }),
    reading: one(Reading, {
      fields: [CharacterAssignment.readingId],
      references: [Reading.id],
    }),
    // readingSession: one(ReadingSession, {
    // fields: [CharacterAssignment.readingSessionId],
    // references: [ReadingSession.id],
    // }),
    user: one(User, {
      fields: [CharacterAssignment.userId],
      references: [User.id],
    }),
  }),
);
