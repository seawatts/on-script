/* eslint-disable @typescript-eslint/ban-ts-comment */

import { transitionSet } from "./transition-keywords";

export type ScriptElementType =
  | "action"
  | "dialog"
  | "scene"
  | "transition"
  | "parenthetical";

export interface ScriptElement {
  type: ScriptElementType;
  content: string;
  character: string;
  metadata?: {
    dualDialogue?: boolean;
    continued?: boolean;
    offScreen?: boolean;
    voiceOver?: boolean;
  };
}

const isTransition = (line: string): boolean => transitionSet.has(line.trim());

const isScene = (line: string): boolean => {
  const trimmedLine = line.trim();
  return trimmedLine.startsWith("EXT.") || trimmedLine.startsWith("INT.");
};

const isParenthetical = (line: string): boolean => {
  const trimmedLine = line.trim();
  return trimmedLine.startsWith("(") && trimmedLine.endsWith(")");
};

const isCharacter = (line: string): boolean => {
  const trimmedLine = line.trim();
  // @ts-ignore
  return (
    trimmedLine &&
    trimmedLine === trimmedLine.toUpperCase() &&
    !transitionSet.has(trimmedLine) &&
    !trimmedLine.startsWith("EXT.") &&
    !trimmedLine.startsWith("INT.") &&
    !trimmedLine.startsWith("(")
  );
};

const extractMetadata = (line: string): { name: string; metadata: object } => {
  const parentheticalRegex = /\(([^)]+)\)/g;
  const metadata: {
    continued?: boolean;
    offScreen?: boolean;
    voiceOver?: boolean;
  } = {};
  let match;
  while ((match = parentheticalRegex.exec(line)) !== null) {
    // @ts-ignore
    const value = match[1].toUpperCase();
    if (value === "CONT’D") metadata.continued = true;
    if (value === "O.S.") metadata.offScreen = true;
    if (value === "V.O.") metadata.voiceOver = true;
  }
  const name = line.replaceAll(parentheticalRegex, "").trim();
  return { metadata, name };
};

const isDualDialogue = (previousLine: string): boolean =>
  previousLine.trim().endsWith("(CONT’D)");

const isDialogue = (line: string, previousLine: string): boolean => {
  const trimmedLine = line.trim();
  // @ts-ignore
  return (
    trimmedLine &&
    !trimmedLine.startsWith("(") &&
    !trimmedLine.includes(":") &&
    trimmedLine !== trimmedLine.toUpperCase() &&
    isCharacter(previousLine)
  );
};

const parseLine = (line: string, previousLine: string): ScriptElement => {
  const trimmedLine = line.trim();

  if (isTransition(trimmedLine)) {
    return { character: "narrator", content: trimmedLine, type: "transition" };
  } else if (isScene(trimmedLine)) {
    return { character: "narrator", content: trimmedLine, type: "scene" };
  } else if (isParenthetical(trimmedLine)) {
    return {
      character: "narrator",
      content: trimmedLine,
      type: "parenthetical",
    };
  } else if (isCharacter(trimmedLine)) {
    const { name, metadata } = extractMetadata(trimmedLine);
    return { character: name, content: "", metadata, type: "dialog" };
  } else if (isDialogue(trimmedLine, previousLine)) {
    const previousCharacter = previousLine
      .trim()
      .replaceAll(/\(([^)]+)\)/g, "")
      .trim();
    return {
      character: previousCharacter,
      content: trimmedLine,
      type: "dialog",
    };
  } else {
    return { character: "narrator", content: trimmedLine, type: "action" };
  }
};

export const parseMovieScript = (script: string): ScriptElement[] => {
  const lines = script.split("\n");
  const parsedElements: ScriptElement[] = [];

  let previousLine = "";
  let previousElement: ScriptElement | null = null;

  for (const line of lines) {
    if (line.trim()) {
      // Only parse non-empty lines
      const parsedElement = parseLine(line, previousLine);

      if (parsedElement.type === "dialog" && parsedElement.content === "") {
        // If the parsed element is a character, save it and wait for the dialog line
        previousElement = parsedElement;
      } else if (previousElement && parsedElement.type === "dialog") {
        // Combine character and dialog into one element
        previousElement.content = parsedElement.content;
        if (isDualDialogue(previousLine)) {
          previousElement.metadata = {
            ...previousElement.metadata,
            dualDialogue: true,
          };
        }
        parsedElements.push(previousElement);
        previousElement = null;
      } else {
        parsedElements.push(parsedElement);
      }

      previousLine = line.trim();
    }
  }

  return parsedElements;
};
