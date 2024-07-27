/* eslint-disable @typescript-eslint/no-unsafe-member-access */

"use client";

import { use, useEffect, useState } from "react";
import { startCase } from "lodash-es";
import pluralize from "pluralize";
import { useServerAction } from "zsa-react";

import type {
  CharacterAssignmentQuerySchema,
  CharacterQuerySchema,
  UserSelectSchema,
} from "@on-script/db/schema";
import { cn } from "@on-script/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from "@on-script/ui/avatar";
import { Badge } from "@on-script/ui/badge";
import { Button } from "@on-script/ui/button";
import { Icons } from "@on-script/ui/icons";
import { H3, Text } from "@on-script/ui/typography";

import { createClient } from "~/supabase/client";
import { createReadingSession, upsertCharacterAssignments } from "../actions";

export function CharacterList(props: {
  characterAssignments: Promise<CharacterAssignmentQuerySchema[]>;
  characters: Promise<CharacterQuerySchema[]>;
  scriptId: string;
  readingId: string;
  userId: string;
}) {
  const { isPending, execute } = useServerAction(createReadingSession);
  const [executingAction, setExecutingAction] = useState<
    "reader" | "observer" | undefined
  >();
  const characters = use(props.characters);
  const useCharacterAssignments = use(props.characterAssignments);
  const [assignments, setAssignments] = useState<
    CharacterAssignmentQuerySchema[]
  >(use(props.characterAssignments));

  useEffect(() => {
    setAssignments(useCharacterAssignments);
  }, [useCharacterAssignments, props.characterAssignments]);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`characterAssignment:${props.readingId}`)
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
            setAssignments((previousItems) =>
              previousItems.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (item) => (item as any)?.id !== payload.old.id,
              ),
            );
          } else {
            const { data } = await supabase
              .from("user")
              .select()
              .limit(1)
              .eq("id", payload.new.userId);
            if (!data) return;

            const [user] = data as UserSelectSchema[];

            if (!user) return;

            setAssignments((previousItems) => [
              ...previousItems,
              {
                ...payload.new,
                user,
              } as CharacterAssignmentQuerySchema,
            ]);
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [props.readingId, setAssignments, supabase]);

  const currentUserAssignments = new Set(
    assignments
      .filter((assignment) => assignment.userId === props.userId)
      .map((assignment) => assignment.characterId),
  );

  const otherUserAssignments = new Set(
    assignments
      .filter((assignment) => assignment.userId !== props.userId)
      .map((assignment) => assignment.characterId),
  );

  return (
    <div className="flex w-full flex-col gap-12">
      <div>
        <H3>Select your characters</H3>
        <Text variant={"muted"}>You can select multiple.</Text>
      </div>
      <ul className="flex flex-col gap-5">
        {characters.map((character) => {
          const assignedToCurrentUser = currentUserAssignments.has(
            character.id,
          );
          const userAssignment = assignments.find(
            (assignment) => assignment.characterId === character.id,
          );

          const assignedToOtherUser = otherUserAssignments.has(character.id);
          let readBy = "Not Assigned";

          if (assignedToOtherUser && userAssignment?.user) {
            readBy = `${userAssignment.user.firstName} ${userAssignment.user.lastName}`;
          } else if (assignedToCurrentUser) {
            readBy = "You";
          }

          const userInitials = getInitials({
            firstName: userAssignment?.user.firstName,
            lastName: userAssignment?.user.lastName,
          });

          return (
            <li
              key={character.id}
              className={cn(
                "flex items-center justify-between rounded border-2 px-4 py-2 hover:bg-muted",
                {
                  "border-destructive": assignedToOtherUser,
                  "border-primary hover:bg-muted": assignedToCurrentUser,
                },
              )}
              onClick={async () => {
                if (assignedToOtherUser) return;

                const action = assignedToCurrentUser ? "deselect" : "select";

                setAssignments((previousItems) => {
                  if (action === "select") {
                    return [
                      ...previousItems,
                      {
                        characterId: character.id,
                        createdAt: new Date(),
                        id: `optimistic-${character.id}-${props.userId}`,
                        readingId: props.readingId,
                        updatedAt: new Date(),
                        user: {} as UserSelectSchema,
                        userId: props.userId,
                      },
                    ];
                  }

                  return previousItems.filter(
                    (item) => item.characterId !== character.id,
                  );
                });

                await upsertCharacterAssignments({
                  action,
                  characterId: character.id,
                  readingId: props.readingId,
                  scriptId: props.scriptId,
                });
              }}
            >
              <div className="flex w-full flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Text>{startCase(character.name.toLowerCase())}</Text>
                  <Badge variant="outline">
                    {
                      character.elements.filter((element) => {
                        return character.name === "Narrator"
                          ? element.type !== "dialog"
                          : element.type === "dialog";
                      }).length
                    }{" "}
                    {pluralize(
                      "line",
                      character.elements.filter((element) => {
                        return character.name === "Narrator"
                          ? element.type !== "dialog"
                          : element.type === "dialog";
                      }).length,
                    )}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Text variant={"muted"} size="sm">
                    Read By: {readBy}
                  </Text>
                  {userAssignment && (
                    <Avatar>
                      <AvatarImage src={userAssignment.user.avatarUrl ?? ""} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            setExecutingAction("reader");
            return execute({
              readingId: props.readingId,
              scriptId: props.scriptId,
            });
          }}
          disabled={isPending || currentUserAssignments.size === 0}
          className="flex gap-2"
        >
          {isPending && executingAction === "reader" && <Icons.Spinner />}{" "}
          <span>Start Reading</span>
        </Button>
        <Button
          onClick={() => {
            setExecutingAction("observer");
            return execute({
              readingId: props.readingId,
              scriptId: props.scriptId,
            });
          }}
          variant={"outline"}
          disabled={isPending || currentUserAssignments.size > 0}
          className="flex gap-2"
        >
          {isPending && executingAction === "observer" && <Icons.Spinner />}{" "}
          <span>Join as observer</span>
        </Button>
      </div>
    </div>
  );
}

export function CharacterListLoading() {
  return <div>Loading...</div>;
}
