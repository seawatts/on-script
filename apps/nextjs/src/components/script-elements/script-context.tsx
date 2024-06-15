"use client";

import type { PropsWithChildren } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

import type { TextTypographyProps } from "@acme/ui/typography";

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
}

const ScriptContext = createContext<ScriptContextProps | undefined>(undefined);

export interface ScriptProviderProps {
  settings?: ScriptSettings;
}

function ScriptProvider(props: PropsWithChildren<ScriptProviderProps>) {
  const [settings, setSettings] = useState<ScriptSettings>(
    props.settings ?? {
      theme: Theme.PLAYFUL,
      typography: {
        size: "script",
        spacing: "script",
        textFlow: "pretty",
        variant: "script-mono",
      },
    },
  );

  const value = useMemo(
    () => ({ setSettings, settings }),
    [settings, setSettings],
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
