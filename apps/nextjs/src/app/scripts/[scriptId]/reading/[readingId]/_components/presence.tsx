"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { useReadingStore } from "~/providers/reading-store-provider";
import { createClient } from "~/supabase/client";

export function Presence() {
  const reading = useReadingStore((store) => store.reading);
  const setOnlineUsers = useReadingStore((store) => store.setOnlineUsers);
  // const user = useUerStore((state) => state.user);
  const { user } = useUser();

  const supabase = createClient();

  useEffect(() => {
    if (!user || !reading) return;

    const readingChannel = supabase.channel(`presence:${reading.id}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });
    readingChannel
      .on("presence", { event: "sync" }, () => {
        const onlineUsers = new Set(
          Object.keys(readingChannel.presenceState()),
        );
        console.log("presence sync", onlineUsers);
        setOnlineUsers(onlineUsers);
      })
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          console.log("readingChannel.track", user.id);
          await readingChannel.track({
            onlineAt: new Date().toISOString(),
            userId: user.id,
          });
        }
      });

    return () => {
      void supabase.removeChannel(readingChannel);
    };
  }, [user, reading, setOnlineUsers, supabase]);
  return <></>;
}
