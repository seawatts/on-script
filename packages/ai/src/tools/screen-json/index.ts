import { createId } from "@on-script/id";

interface Line {
  lineText: string;
}

interface Element {
  elementID: string;
  parentScene: {
    sceneID: string;
    sceneIndex: number;
    sceneTitle: string;
    sceneLineIndex: number;
  };
  groupType: string;
  dual: number;
  elementRawLines: Line[];
  item: {
    name: string;
    id: string;
    type: string;
    sceneLocation: number;
  }[];
}

interface Scene {
  sceneID: string;
  heading: {
    headingString: string;
  };
  linesCleaned: Line[];
  elements: Element[];
  props?: { propItem: string }[];
  cast?: { dialogueItem: string }[];
}

interface SceneParse {
  scenes: Scene[];
}

const TRANSITION_REGEX =
  /^(FADE OUT|FADE IN|FADE TO BLACK|FADE TO WHITE|CUT TO|CUT IN|CUT TO BLACK|CUT TO WHITE|DISSOLVE TO|IRIS OUT|IRIS IN|WIPE TO|SMASH CUT TO|MATCH CUT TO|JUMP CUT TO|CUTAWAY TO|CROSSFADE TO|FADE THROUGH TO|FLASH TO|FREEZE FRAME|FADE TO SILENCE|TIME CUT TO|REVERSE CUT TO|CONTINUOUS|FADE TO RED|FADE TO BLUE|FADE TO GREEN|DISSOLVE TO BLACK|DISSOLVE TO WHITE|DISSOLVE TO RED|DISSOLVE TO BLUE|DISSOLVE TO GREEN|CUT TO CLOSE UP|CUT TO WIDE SHOT|CUT TO MEDIUM SHOT|CUT TO OVER-THE-SHOULDER|CUT TO POV|CUT TO HIGH ANGLE|CUT TO LOW ANGLE|CUT TO SLOW MOTION|CUT TO FAST MOTION|CUT TO FLASHBACK|CUT TO FLASHFORWARD|CUT TO DAY|CUT TO NIGHT|CUT TO DREAM SEQUENCE)$/;
const CAMERA_REGEX =
  /^(PAN|TILT|ZOOM|DOLLY|TRACK|CRANE|STEADICAM|HANDHELD)(\s+(-|\s+)(UP|DOWN|LEFT|RIGHT|IN|OUT|FORWARD|BACKWARD|UPWARD|DOWNWARD|LEFTWARD|RIGHTWARD|INWARD|OUTWARD|FORWARDS|BACKWARDS|UPWARDS|DOWNWARDS|LEFTWARDS|RIGHTWARDS|INWARDS|OUTWARDS))?$/;

export function setElementType(element: Element) {
  const firstLine = element.elementRawLines[0]?.lineText.trim();

  if (!firstLine) return;

  if (TRANSITION_REGEX.test(firstLine)) {
    element.groupType = "transition";
  } else if (/^[A-Z]+$/.test(firstLine)) {
    element.groupType = /[A-Z]+!$/.test(firstLine) ? "action" : "dialogue";
  } else if (/[a-z]+ [A-Z][a-z]*/.test(firstLine)) {
    element.groupType = "prop";
  } else if (/^\s*\(\w+\)\s*$/.test(firstLine)) {
    element.groupType = "parenthesis";
  } else if (CAMERA_REGEX.test(firstLine)) {
    element.groupType = "camera";
  } else if (/\b[A-Z]+ING\b$/.test(firstLine)) {
    element.groupType = "action";
  }
}

export function setDualDialogue(elements: Element[]) {
  let consecutiveDialogueCount = 0;
  for (const element of elements) {
    if (element.groupType === "dialogue") {
      consecutiveDialogueCount++;
      if (consecutiveDialogueCount > 1) {
        element.dual = 1;
      }
    } else {
      consecutiveDialogueCount = 0;
    }
  }

  for (const [index, element] of elements.entries()) {
    if (element.groupType === "dialogue" && element.dual === 1) {
      let previousElementIndex = index - 1;
      const previousElement = elements[previousElementIndex];
      if (!previousElement) continue;

      while (
        previousElementIndex >= 0 &&
        previousElement.groupType === "dialogue"
      ) {
        previousElement.dual = 1;
        previousElementIndex--;
      }
      previousElementIndex = index + 1;
      while (
        previousElementIndex < elements.length &&
        previousElement.groupType === "dialogue"
      ) {
        previousElement.dual = 1;
        previousElementIndex++;
      }
    }
  }
}

export function parseElements(sceneParse: SceneParse) {
  for (const scene of sceneParse.scenes) {
    scene.elements = [];
    let currentElement: Element | null = null;

    for (const [lineIndex, line] of scene.linesCleaned.entries()) {
      const matchResult = line.lineText.match(
        /\b(?![A-Z](?!-?[A-Z])\b)(?![A-Z]-[A-Z](?!-[A-Z])\b)[A-Z][A-Z-]*(?<!-)(?:\s+[A-Z][A-Z-]+(?<!-))*\b/g,
      );

      if (matchResult) {
        if (currentElement) scene.elements.push(currentElement);

        currentElement = {
          dual: 0,
          elementID: createId({ prefix: "e" }),
          elementRawLines: [],
          groupType: "",
          item: matchResult.map((item) => ({
            id: createId({ prefix: "i" }),
            name: item,
            sceneLocation: lineIndex,
            type: "",
          })),
          parentScene: {
            sceneID: scene.sceneID,
            sceneIndex: sceneParse.scenes.indexOf(scene),
            sceneLineIndex: scene.linesCleaned.indexOf(line),
            sceneTitle: scene.heading.headingString,
          },
        };
      }

      currentElement?.elementRawLines.push(line);
    }

    if (currentElement) scene.elements.push(currentElement);
  }

  for (const scene of sceneParse.scenes) {
    for (const element of scene.elements) setElementType(element);
    setDualDialogue(scene.elements);
  }

  return sceneParse;
}

export function sortElementType(sceneParse: SceneParse) {
  for (const scene of sceneParse.scenes) {
    for (const element of scene.elements) {
      if (element.groupType === "prop") {
        const propertyItems = element.elementRawLines.map((line) =>
          line.lineText.trim(),
        );
        scene.props = propertyItems.map((propertyItem) => ({
          propItem: propertyItem,
        }));
      }
      if (element.groupType === "dialogue") {
        const dialogueItems = element.elementRawLines.map((line) =>
          line.lineText.trim(),
        );
        scene.cast = dialogueItems.map((dialogueItem) => ({ dialogueItem }));
      }
    }
  }
}
