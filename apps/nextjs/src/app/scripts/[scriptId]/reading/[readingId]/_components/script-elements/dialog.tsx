"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useServerAction } from "zsa-react";

import type { ElementSelectSchema } from "@on-script/db/schema";
import { cn } from "@on-script/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  getInitials,
} from "@on-script/ui/avatar";
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
      const characterAssignments = useReadingStore(
        (store) => store.characterAssignments,
      );
      const readingSettings = useUserStore((store) => store.readingSettings);
      const character = reading?.script.characters?.find(
        (character) => character.id === element.characterId,
      );
      const currentUserAssignment = characterAssignments?.find(
        (assignment) =>
          assignment.characterId === element.characterId &&
          assignment.userId === user?.id,
      );

      const isPastElement = (selectedElement?.index ?? 0) > element.index;

      const userInitials = getInitials({
        firstName: currentUserAssignment?.user.firstName,
        lastName: currentUserAssignment?.user.lastName,
      });

      return (
        <div className="relative">
          <Text
            {...readingSettings.typography}
            className={cn(
              "mx-auto flex max-w-fit text-center uppercase transition-all",
              {
                "border-b-2 border-muted":
                  currentUserAssignment && isPastElement,
                "border-b-2 border-primary":
                  currentUserAssignment && !isPastElement,
                "text-muted": isPastElement,
              },
            )}
          >
            {/* {composeCharacter(element)} */}
            {character?.name}
          </Text>
          <div className="absolute -top-1 right-0">
            {currentUserAssignment && (
              <Avatar
                className={cn({
                  "opacity-15": isPastElement,
                })}
              >
                <AvatarImage src={currentUserAssignment.user.avatarUrl ?? ""} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      );
    },
    Dialog: (element) => {
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

      return (
        <div
          ref={dialogRef}
          className={"flex flex-col items-center py-2 transition-all"}
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
