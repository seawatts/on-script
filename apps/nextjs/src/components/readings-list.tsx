"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { first } from "lodash-es";
import pluralize from "pluralize";

import type { ReadingQuerySchema } from "@on-script/db/schema";
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

import { createClient } from "~/supabase/client";
import { useSubscribeToReadings } from "~/supabase/subscriptions";
import { formatRelativeTime } from "~/utils/format-date";

export function ReadingList(props: {
  readings: Promise<ReadingQuerySchema[]>;
}) {
  const readings = useSubscribeToReadings({ readings: props.readings });
  const [onlineUsers, setOnlineUsers] = useState<Record<string, number>>({});

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
        .subscribe();
    }
  }, [readings, onlineUsers]);

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
