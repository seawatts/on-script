"use client";

import { cn } from "@acme/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Text } from "@acme/ui/typography";

import type { DialogElement } from "./types";
import { Theme, useScriptContext } from "./script-context";
import { DialogDirection } from "./types";

type ThemeComponent = (element: DialogElement) => JSX.Element;
type themeComponents = Record<Theme, Record<string, ThemeComponent>>;

const themeComponents = {
  [Theme.PLAYFUL]: {
    Character: (element) => (
      <Text className="font-semibold">{composeCharacter(element)}</Text>
    ),
    Dialog: (element) => {
      const { settings } = useScriptContext();

      const dialogWidth = "w-10/12 lg:w-7/12";

      return (
        <div className="flex flex-col items-center rounded border p-4">
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
      const { settings } = useScriptContext();

      return (
        <Text {...settings.typography} className="text-center">
          {composeCharacter(element)}
        </Text>
      );
    },
    Dialog: (element) => {
      const { settings } = useScriptContext();

      const dialogWidth = "w-10/12 lg:w-7/12";

      return (
        <div className="flex flex-col items-center">
          <div className={cn("flex flex-col", dialogWidth)}>
            {themeComponents[settings.theme].Character(element)}
            {themeComponents[settings.theme].Text(element)}
          </div>
        </div>
      );
    },
    Text: (element) => {
      const { settings } = useScriptContext();

      return <Text {...settings.typography}>{element.text}</Text>;
    },
  },
} as const satisfies themeComponents;

export function Dialog(props: { element: DialogElement }) {
  const { settings } = useScriptContext();

  return themeComponents[settings.theme].Dialog(props.element);
}

function composeCharacter(element: DialogElement) {
  const extras = [];

  if (element.direction === DialogDirection.OFF_SCREEN) {
    extras.push("(O.S.)");
  }
  if (element.direction === DialogDirection.VOICE_OVER) {
    extras.push("(V.O.)");
  }
  if (element.continued) {
    extras.push("(CONT'D)");
  }
  if (element.prelap) {
    extras.push("(PRELAP)");
  }

  const extrasString = extras.length > 0 ? ` ${extras.join(" ")}` : "";
  return `${element.character}${extrasString}`;
}
