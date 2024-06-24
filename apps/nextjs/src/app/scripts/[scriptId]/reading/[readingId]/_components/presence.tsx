"use client";

import { useEffect } from "react";

import { useReadingStore } from "~/providers/reading-store-provider";
import { useUserStore } from "~/providers/user-store-provider";
import { createClient } from "~/supabase/client";

export function Presence() {
  const reading = useReadingStore((store) => store.reading);
  const setOnlineUsers = useReadingStore((store) => store.setOnlineUsers);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user || !reading) return;

    const supabase = createClient();

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
        setOnlineUsers(onlineUsers);
      })

      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void readingChannel.track({
            onlineAt: new Date().toISOString(),
            userId: user.id,
          });
        }
      });

    return () => {
      void supabase.removeChannel(readingChannel);
    };
  }, [user, reading, setOnlineUsers]);
  return <></>;
}
