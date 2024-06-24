"use client";

import { useEffect } from "react";

import { ElementType } from "@on-script/db/schema";

import { useReadingStore } from "~/providers/reading-store-provider";
import { createClient } from "~/supabase/client";
import { Dialog } from "./dialog";

export function ElementsList() {
  const reading = useReadingStore((store) => store.reading);
  const setCurrentElementId = useReadingStore(
    (store) => store.setCurrentElementId,
  );

  useEffect(() => {
    if (!reading) return;

    const supabase = createClient();
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
  }, [reading, setCurrentElementId]);

  return (
    <div className="flex flex-col gap-6">
      {reading?.script.elements?.map((element, index) => {
        switch (element.type) {
          // case ElementType.ACTION:
          // return <Action key={index} element={element} />;

          case ElementType.dialog: {
            return <Dialog key={index} element={element} />;
          }

          default: {
            return null;
          }
        }
      })}
    </div>
  );
}
