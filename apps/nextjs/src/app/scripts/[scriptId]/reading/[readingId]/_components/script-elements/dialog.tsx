"use client";

import { useEffect, useRef } from "react";

import type { ElementSelectSchema } from "@on-script/db/schema";
import { cn } from "@on-script/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@on-script/ui/avatar";
import { Text } from "@on-script/ui/typography";

import { Theme, useScriptContext } from "./script-context";

type ThemeComponent = (element: ElementSelectSchema) => JSX.Element;
type themeComponents = Record<Theme, Record<string, ThemeComponent>>;

const themeComponents = {
  [Theme.PLAYFUL]: {
    Character: (element) => (
      <Text className="font-semibold">{composeCharacter(element)}</Text>
    ),
    Dialog: (element) => {
      const { settings, selectedElement } = useScriptContext();

      const dialogWidth = "w-10/12 lg:w-7/12";

      return (
        <div
          className={cn("flex flex-col items-center rounded border p-4", {
            "border-primary": selectedElement === element,
          })}
        >
          <div className={cn("flex flex-col gap-4", dialogWidth)}>
            {themeComponents[settings.theme].Character(element)}
            {themeComponents[settings.theme].Text(element)}
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
  [Theme.SCRIPT]: {
    Character: (element) => {
      const { settings, selectedElement } = useScriptContext();

      return (
        <Text
          {...settings.typography}
          className={cn("text-center transition-all", {
            "text-muted": (selectedElement?.index ?? 0) > element.index,
          })}
        >
          {composeCharacter(element)}
        </Text>
      );
    },
    Dialog: (element) => {
      const { settings, selectedElement, setSelectedElement } =
        useScriptContext();

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
          className={cn(
            "flex cursor-pointer flex-col items-center border py-2 transition-all",
            {
              "rounded border-primary":
                selectedElement?.index === element.index,
            },
          )}
          onClick={() => setSelectedElement(element)}
        >
          <div className={cn("flex flex-col", dialogWidth)}>
            {/* {themeComponents[settings.theme].Character(element)} */}
            {themeComponents[settings.theme].Text(element)}
          </div>
        </div>
      );
    },
    Text: (element) => {
      const { settings, selectedElement } = useScriptContext();

      return (
        <Text
          {...settings.typography}
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
  const { settings } = useScriptContext();

  return themeComponents[settings.theme].Dialog(props.element);
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
