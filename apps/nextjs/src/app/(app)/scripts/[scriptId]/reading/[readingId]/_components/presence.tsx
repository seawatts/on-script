"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { useReadingStore } from "~/providers/reading-store-provider";
import { createClient } from "~/supabase/client";

export function Presence(props: { readingId: string }) {
  const setOnlineUsers = useReadingStore((store) => store.setOnlineUsers);
  const { user } = useUser();

  const supabase = createClient();

  useEffect(() => {
    if (!user || !props.readingId) return;

    const readingChannel = supabase
      .channel(`presence:${props.readingId}`, {
        config: {
          presence: {
            key: user.id,
          },
        },
      })
      .on("presence", { event: "sync" }, () => {
        const onlineUsers = new Set(
          Object.keys(readingChannel.presenceState()),
        );

        setOnlineUsers(onlineUsers);
      })
      .subscribe((status) => {
        if (
          status === "SUBSCRIBED" &&
          !readingChannel.presenceState()[user.id]
        ) {
          void readingChannel.track({
            onlineAt: new Date().toISOString(),
            userId: user.id,
          });
        }
      });

    return () => {
      void supabase.removeChannel(readingChannel);
    };
  }, [user, props.readingId, setOnlineUsers, supabase]);
  return <></>;
}
