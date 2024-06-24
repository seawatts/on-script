"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { first } from "lodash-es";
import pluralize from "pluralize";

import type {
  ReadingQuerySchema,
  ScriptSelectSchema,
  UserSelectSchema,
} from "@on-script/db/schema";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarOnlineIndicator,
} from "@on-script/ui/avatar";
import { Button } from "@on-script/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@on-script/ui/card";
import { Text } from "@on-script/ui/typography";

import { useUserStore } from "~/providers/user-store-provider";
import { createClient } from "~/supabase/client";
import { formatRelativeTime } from "~/utils/format-date";

export function ReadingList(props: {
  readings: Promise<ReadingQuerySchema[]>;
}) {
  const user = useUserStore((store) => store.user);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, number>>({});
  const readingsPromise = use(props.readings);

  const [readings, setReadings] =
    useState<ReadingQuerySchema[]>(readingsPromise);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("reading")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reading",
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        async (payload) => {
          if (payload.eventType === "DELETE") {
            setReadings((previousItems) =>
              previousItems.filter((item) => item.id !== payload.old.id),
            );
          } else {
            const [createdBy, script] = await Promise.all([
              supabase
                .from("user")
                .select("*")
                .eq("id", payload.new.createdById)
                .single(),
              supabase
                .from("script")
                .select("*")
                .eq("id", payload.new.scriptId)
                .single(),
            ]);
            console.log({ createdBy, script });

            setReadings((previousItems) => [
              ...previousItems,
              {
                ...payload.new,
                createdBy: createdBy.data as UserSelectSchema,
                script: script.data as ScriptSelectSchema,
              } as ReadingQuerySchema,
            ]);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const supabase = createClient();

    for (const reading of readings) {
      if (reading.id in onlineUsers) {
        continue;
      }

      const readingChannel = supabase.channel(`presence:${reading.id}`);
      readingChannel
        .on("presence", { event: "sync" }, () => {
          const count = Object.keys(readingChannel.presenceState()).length;
          setOnlineUsers((previous) => ({
            ...previous,
            [reading.id]: count,
          }));
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          console.log({ key, newPresences });
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          console.log({ key, leftPresences });
        })
        .subscribe();
    }
  }, [readings, onlineUsers]);

  console.log("readings", readings);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Readings</CardTitle>
          <CardDescription>Readings happening now</CardDescription>
        </CardHeader>
        <CardContent>
          {readings.length > 0 && (
            <ul className="flex flex-col gap-6">
              {readings.map((reading) => {
                return (
                  <li
                    key={reading.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {first(reading.createdBy.firstName)}
                        </AvatarFallback>
                        <AvatarImage
                          src={reading.createdBy.avatarUrl ?? ""}
                          alt="avatar"
                        />
                        <AvatarOnlineIndicator
                          online
                          // online={reading.createdBy}
                        />
                      </Avatar>
                      <div className="flex flex-col">
                        <Text>
                          {reading.script.title}
                          {/* {reading.createdBy.firstName}{" "} */}
                          {/* {reading.createdBy.lastName} */}
                        </Text>
                        <Text variant={"muted"}>
                          {formatRelativeTime(reading.createdAt)}
                        </Text>
                      </div>
                    </div>
                    <Button asChild>
                      <Link
                        href={`/scripts/${reading.scriptId}/reading/${reading.id}/character-selection`}
                        prefetch={!!user}
                      >
                        Join {onlineUsers[reading.id] ?? 0}{" "}
                        {pluralize("reader", onlineUsers[reading.id] ?? 0)}
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function ReadingListLoading() {
  return <div>Loading...</div>;
}
