"use client";

import { useEffect } from "react";

import type {
  CharacterAssignmentQuerySchema,
  UserSelectSchema,
} from "@on-script/db/schema";
import { ElementType } from "@on-script/db/schema";

import { useReadingStore } from "~/providers/reading-store-provider";
import { createClient } from "~/supabase/client";
import { Dialog } from "./dialog";

export function ElementsList() {
  const reading = useReadingStore((store) => store.reading);
  const addCharacterAssignment = useReadingStore(
    (store) => store.addCharacterAssignment,
  );
  const removeCharacterAssignment = useReadingStore(
    (store) => store.removeCharacterAssignmentById,
  );
  const setCurrentElementId = useReadingStore(
    (store) => store.setCurrentElementId,
  );

  const supabase = createClient();

  useEffect(() => {
    if (!reading) return;

    const channel = supabase
      .channel(`currentElement:${reading.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "reading",
        },
        (payload) => {
          setCurrentElementId(payload.new.currentElementId as string);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [reading, supabase, setCurrentElementId]);

  useEffect(() => {
    if (!reading) return;

    const channel = supabase
      .channel(`characterAssignment:${reading.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "character_assignment",
        },

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (payload) => {
          if (payload.eventType === "DELETE") {
            removeCharacterAssignment(payload.old.id as string);
          } else {
            const { data } = await supabase
              .from("user")
              .select()
              .limit(1)
              .eq("id", payload.new.userId);
            if (!data) return;

            const [user] = data as UserSelectSchema[];

            if (!user) return;

            addCharacterAssignment({
              ...payload.new,
              user,
            } as CharacterAssignmentQuerySchema);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [reading, supabase, addCharacterAssignment, removeCharacterAssignment]);

  return (
    <div className="flex flex-col gap-6">
      {reading?.script.elements?.map((element, index) => {
        return <Dialog key={index} element={element} />;
        // switch (element.type) {
        //   // case ElementType.ACTION:
        //   // return <Action key={index} element={element} />;

        //   case ElementType.dialog: {
        //     return <Dialog key={index} element={element} />;
        //   }

        //   default: {
        //     return null;
        //   }
        // }
      })}
    </div>
  );
}
