import { createStore } from "zustand/vanilla";

import type { ReadingQuerySchema } from "@on-script/db/schema";

export interface ReadingState {
  reading?: ReadingQuerySchema;
}

// export interface ReadingActions {}

// export type ReadingStore = ReadingState & ReadingActions;
export type ReadingStore = ReadingState;

export const defaultInitState: ReadingState = {
  reading: undefined,
};

export const createReadingStore = (
  initState: ReadingState = defaultInitState,
) => {
  return createStore<ReadingStore>()((_set) => ({
    ...initState,
  }));
};

export const initReadingStore = (reading: ReadingQuerySchema): ReadingState => {
  return { reading };
};
