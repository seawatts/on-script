"use client";

import { use, useEffect, useState } from "react";

import type {
  CharacterAssignmentQuerySchema,
  ReadingQuerySchema,
  ReadingSessionSelectSchema,
  ScriptQuerySchema,
  UserSelectSchema,
} from "@on-script/db/schema";
import { getTableConfig } from "@on-script/db";
import {
  CharacterAssignment,
  Reading,
  ReadingSession,
  Script,
  User,
} from "@on-script/db/schema";

import { createClient } from "./client";

interface UseSubscribeProps<T> {
  items?: T[] | Promise<T[]>;
  table: string;
}

export function useSubscribe<T>(props: UseSubscribeProps<T>) {
  const [items, setItems] = useState<T[]>(
    props.items instanceof Promise ? use(props.items) : props.items ?? [],
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(props.table)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: props.table,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setItems((previousItems) =>
              previousItems.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                (item) => (item as any)?.id !== payload.old.id,
              ),
            );
          } else {
            console.log("setting items");
            setItems((previousItems) => [...previousItems, payload.new as T]);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [props.table, setItems]);

  return items;
}

export function useSubscribeToScripts(props?: {
  scripts?: ScriptQuerySchema[] | Promise<ScriptQuerySchema[]>;
}) {
  return useSubscribe<ScriptQuerySchema>({
    items: props?.scripts,
    table: getTableConfig(Script).name,
  });
}

export function useSubscribeToUsers(props?: {
  users?: UserSelectSchema[] | Promise<UserSelectSchema[]>;
}) {
  return useSubscribe<UserSelectSchema>({
    items: props?.users,
    table: getTableConfig(User).name,
  });
}

export function useSubscribeToReadings(props?: {
  readings?: ReadingQuerySchema[] | Promise<ReadingQuerySchema[]>;
}) {
  return useSubscribe<ReadingQuerySchema>({
    items: props?.readings,
    table: getTableConfig(Reading).name,
  });
}

export function useSubscribeToReadingSessions(props?: {
  readingSessions?:
    | ReadingSessionSelectSchema[]
    | Promise<ReadingSessionSelectSchema[]>;
}) {
  return useSubscribe<ReadingSessionSelectSchema>({
    items: props?.readingSessions,
    table: getTableConfig(ReadingSession).name,
  });
}

export function useSubscribeToCharacterAssignments(props?: {
  characterAssignments?:
    | CharacterAssignmentQuerySchema[]
    | Promise<CharacterAssignmentQuerySchema[]>;
}) {
  return useSubscribe<CharacterAssignmentQuerySchema>({
    items: props?.characterAssignments,
    table: getTableConfig(CharacterAssignment).name,
  });
}
