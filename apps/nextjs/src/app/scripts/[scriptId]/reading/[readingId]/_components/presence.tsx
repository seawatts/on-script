"use client";

import { useEffect, useState } from "react";

import { useUserStore } from "~/providers/user-store-provider";
import { createClient } from "~/supabase/client";

export function Presence(props: { readingId: string }) {
  const user = useUserStore((state) => state.user);
  const [_onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    const readingChannel = supabase.channel(`presence:${props.readingId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });
    readingChannel
      .on("presence", { event: "sync" }, () => {
        setOnlineUsers(Object.keys(readingChannel.presenceState()).length);
      })
      // .on("presence", { event: "join" }, () => {
      //   void setReadingSessionOnline({
      //     online: true,
      //     readingId: props.readingId,
      //     userId: user.id,
      //   });
      // })
      // .on("presence", { event: "leave" }, () => {
      //   void setReadingSessionOnline({
      //     online: false,
      //     readingId: props.readingId,
      //     userId: user.id,
      //   });
      // })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void readingChannel.track({
            onlineAt: new Date().toISOString(),
            userId: user.id,
          });
        }
      });

    // return () => {
    // return readingChannel.untrack();
    // };
  }, [user, props.readingId]);
  return <></>;
}
