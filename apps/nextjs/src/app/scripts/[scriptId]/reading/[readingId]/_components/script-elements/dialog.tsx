"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useServerAction } from "zsa-react";

import type { ElementSelectSchema } from "@on-script/db/schema";
import { cn } from "@on-script/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@on-script/ui/avatar";
import { Text } from "@on-script/ui/typography";

import { useReadingStore } from "~/providers/reading-store-provider";
import { useUserStore } from "~/providers/user-store-provider";
import { ReadingTheme } from "~/stores/user";
import { selectCurrentElement } from "../../actions";

type ThemeComponent = (element: ElementSelectSchema) => JSX.Element;
type themeComponents = Record<ReadingTheme, Record<string, ThemeComponent>>;

const themeComponents = {
  [ReadingTheme.PLAYFUL]: {
    Character: (element) => (
      <Text className="font-semibold">{composeCharacter(element)}</Text>
    ),
    Dialog: (element) => {
      const selectedElement = useReadingStore((store) => store.selectedElement);
      const readingSettings = useUserStore((store) => store.readingSettings);
      const dialogWidth = "w-10/12 lg:w-7/12";

      return (
        <div
          className={cn("flex flex-col items-center rounded border p-4", {
            "border-primary": selectedElement === element,
          })}
        >
          <div className={cn("flex flex-col gap-4", dialogWidth)}>
            {themeComponents[readingSettings.theme].Character(element)}
            {themeComponents[readingSettings.theme].Text(element)}
          </div>
          <Avatar className="place-self-end">
            <AvatarImage src="" />
            <AvatarFallback>Op</AvatarFallback>
          </Avatar>
        </div>
      );
    },
    Text: (element) => <Text>{element.text}</Text>,
  },
  [ReadingTheme.SCRIPT]: {
    Character: (element) => {
      const { user } = useUser();
      const reading = useReadingStore((store) => store.reading);
      const selectedElement = useReadingStore((store) => store.selectedElement);
      const readingSettings = useUserStore((store) => store.readingSettings);
      const character = reading?.script.characters?.find(
        (character) => character.id === element.characterId,
      );
      const isCurrentUser = reading?.characterAssignments.find(
        (assignment) =>
          assignment.characterId === element.characterId &&
          assignment.userId === user?.id,
      );

      const isPastElement = (selectedElement?.index ?? 0) > element.index;
      const isCurrentElement = selectedElement?.index === element.index;
      return (
        <div className="relative">
          <Text
            {...readingSettings.typography}
            className={cn(
              "mx-auto flex max-w-fit text-center uppercase transition-all",
              {
                "border-b-2 border-muted": isCurrentUser && isPastElement,
                "border-b-2 border-primary": isCurrentUser && !isPastElement,
                "text-muted": isPastElement,
              },
            )}
          >
            {/* {composeCharacter(element)} */}
            {character?.name}
          </Text>
          <div className="absolute -top-1 right-0">
            {user?.imageUrl && (
              <Image
                src={user.imageUrl}
                className={cn("rounded-full", {
                  "brightness-50": isPastElement,
                })}
                width={20}
                height={20}
                alt={user.fullName ?? "Reader"}
              />
            )}
          </div>
        </div>
      );
    },
    Dialog: (element) => {
      const { user } = useUser();
      const readingSettings = useUserStore((store) => store.readingSettings);
      const reading = useReadingStore((store) => store.reading);
      const selectedElement = useReadingStore((store) => store.selectedElement);
      const { execute } = useServerAction(selectCurrentElement);
      const setCurrentElementId = useReadingStore(
        (store) => store.setCurrentElementId,
      );

      const dialogWidth = "w-10/12 lg:w-7/12";
      const dialogRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (selectedElement?.index === element.index && dialogRef.current) {
          dialogRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }, [selectedElement?.index, element.index, dialogRef]);

      const isCurrentUser = reading?.characterAssignments.find(
        (assignment) =>
          assignment.characterId === element.characterId &&
          assignment.userId === user?.id,
      );

      const isOtherUser = reading?.characterAssignments.find(
        (assignment) =>
          assignment.characterId === element.characterId &&
          assignment.userId !== user?.id,
      );

      const isPastElement = (selectedElement?.index ?? 0) > element.index;
      const isCurrentElement = selectedElement?.index === element.index;

      return (
        <div
          ref={dialogRef}
          className={cn("flex flex-col items-center py-2 transition-all", {
            // "border-muted": isPastElement,
            // "border-b-blue-600": isOtherUser && !isPastElement,
            // "border-primary": isCurrentUser && !isPastElement,
            // "border-b-4 border-primary":
            // "ring ring-primary ring-offset-8 ring-offset-background":
            // isCurrentElement,
          })}
          onClick={async () => {
            if (!reading || selectedElement?.id === element.id) return;

            setCurrentElementId(element.id);

            await execute({
              elementId: element.id,
              readingId: reading.id,
              scriptId: reading.scriptId,
            });
          }}
        >
          <div className={cn("flex flex-col gap-2", dialogWidth)}>
            {themeComponents[readingSettings.theme].Character(element)}
            {themeComponents[readingSettings.theme].Text(element)}
          </div>
        </div>
      );
    },
    Text: (element) => {
      const readingSettings = useUserStore((store) => store.readingSettings);
      const selectedElement = useReadingStore((store) => store.selectedElement);

      return (
        <Text
          {...readingSettings.typography}
          className={cn("transition-all", {
            "text-muted": (selectedElement?.index ?? 0) > element.index,
          })}
        >
          {element.text}
        </Text>
      );
    },
  },
} as const satisfies themeComponents;

export function Dialog(props: { element: ElementSelectSchema }) {
  const readingSettings = useUserStore((store) => store.readingSettings);

  return themeComponents[readingSettings.theme].Dialog(props.element);
}

function composeCharacter(element: ElementSelectSchema) {
  const extras: string[] = [];

  // if (element.metadata?.direction === DialogDirection.OFF_SCREEN) {
  //   extras.push("(O.S.)");
  // }
  // if (element.metadata?.direction === DialogDirection.VOICE_OVER) {
  //   extras.push("(V.O.)");
  // }
  // if (element.metadata?.continued) {
  //   extras.push("(CONT'D)");
  // }
  // if (element.metadata?.prelap) {
  //   extras.push("(PRELAP)");
  // }

  const extrasString = extras.length > 0 ? ` ${extras.join(" ")}` : "";
  return `${element.text}${extrasString}`;
}
