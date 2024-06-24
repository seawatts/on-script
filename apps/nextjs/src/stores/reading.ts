import { createStore } from "zustand/vanilla";

import type {
  ElementSelectSchema,
  ReadingQuerySchema,
} from "@on-script/db/schema";

export interface ReadingState {
  reading?: ReadingQuerySchema;
  selectedElement?: ElementSelectSchema;
  onlineUsers?: Set<string>;
}

export interface ReadingActions {
  setCurrentElementId: (elementId: string) => void;
  setOnlineUsers: (onlineUsers: Set<string>) => void;
}

export type ReadingStore = ReadingState & ReadingActions;

export const defaultInitState: ReadingState = {
  onlineUsers: new Set(),
  reading: undefined,
  selectedElement: undefined,
};

export const createReadingStore = (
  initState: ReadingState = defaultInitState,
) => {
  return createStore<ReadingStore>()((set) => ({
    ...initState,
    setCurrentElementId: (elementId: string) =>
      set((state) => ({
        reading: {
          ...state.reading,
          currentElementId: elementId,
        } as ReadingQuerySchema,
        selectedElement: state.reading?.script.elements?.find(
          (element) => element.id === elementId,
        ),
      })),
    setOnlineUsers: (onlineUsers: Set<string>) =>
      set(() => ({
        onlineUsers,
      })),
  }));
};

export const initReadingStore = (reading: ReadingQuerySchema): ReadingState => {
  return {
    onlineUsers: new Set(),
    reading,
    selectedElement: reading.script.elements?.find(
      (element) => element.id === reading.currentElementId,
    ),
  };
};
