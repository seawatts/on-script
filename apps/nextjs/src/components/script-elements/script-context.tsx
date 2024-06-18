"use client";

import type { PropsWithChildren } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

import type { TextTypographyProps } from "@acme/ui/typography";

import type { Element } from "./types";

export enum Theme {
  PLAYFUL = "PLAYFUL",
  SCRIPT = "SCRIPT",
}

export interface ScriptSettings {
  theme: Theme;
  typography: TextTypographyProps;
}

export interface ScriptContextProps {
  settings: ScriptSettings;
  setSettings: React.Dispatch<React.SetStateAction<ScriptSettings>>;
  selectedElement: Element | undefined;
  setSelectedElement: React.Dispatch<React.SetStateAction<Element | undefined>>;
  elements: Element[];
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
}

const ScriptContext = createContext<ScriptContextProps | undefined>(undefined);

export interface ScriptProviderProps {
  settings?: ScriptSettings;
  elements?: Element[];
}

function ScriptProvider(props: PropsWithChildren<ScriptProviderProps>) {
  const [selectedElement, setSelectedElement] = useState<Element | undefined>();
  const [elements, setElements] = useState<Element[]>(props.elements ?? []);
  const [settings, setSettings] = useState<ScriptSettings>(
    props.settings ?? {
      theme: Theme.SCRIPT,
      typography: {
        size: "script",
        spacing: "script",
        textFlow: "pretty",
        variant: "script-mono",
      },
    },
  );

  const value = useMemo(
    () => ({
      elements,
      selectedElement,
      setElements,
      setSelectedElement,
      setSettings,
      settings,
    }),
    [
      settings,
      setSettings,
      selectedElement,
      setSelectedElement,
      elements,
      setElements,
    ],
  );

  return <ScriptContext.Provider value={value} {...props} />;
}

export const useScriptContext = () => {
  const context = useContext(ScriptContext);

  if (context === undefined) {
    throw new Error("useScript must be used within a ScriptProvider");
  }

  return context;
};

export { ScriptProvider, ScriptContext };
