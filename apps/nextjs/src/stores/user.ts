import type { useUser } from "@clerk/nextjs";
import { createStore } from "zustand/vanilla";

import type { TextTypographyProps } from "@on-script/ui/typography";

export type ClerkUser = ReturnType<typeof useUser>["user"];

export enum ReadingTheme {
  PLAYFUL = "PLAYFUL",
  SCRIPT = "SCRIPT",
}

export interface ReadingSettings {
  theme: ReadingTheme;
  typography: TextTypographyProps;
}

export interface UserState {
  user?: ClerkUser;
  readingSettings: ReadingSettings;
}

export interface ReadingActions {
  setReadingSettings: () => void;
}

export type UserStore = UserState & ReadingActions;

export const defaultInitState: UserState = {
  readingSettings: {
    theme: ReadingTheme.SCRIPT,
    typography: {
      size: "script",
      spacing: "script",
      textFlow: "pretty",
      variant: "script-mono",
    },
  },
  user: undefined,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((_set) => ({
    ...initState,
    setReadingSettings: () => _set((state) => ({ ...state })),
  }));
};

export const initUserStore = (user: ClerkUser): UserState => {
  return {
    readingSettings: {
      theme: ReadingTheme.SCRIPT,
      typography: {
        size: "script",
        spacing: "script",
        textFlow: "pretty",
        variant: "script-mono",
      },
    },
    user,
  };
};
