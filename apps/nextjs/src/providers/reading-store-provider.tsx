"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";

import type { ReadingQuerySchema } from "@on-script/db/schema";

import type { ReadingStore } from "~/stores/reading";
import { createReadingStore, initReadingStore } from "~/stores/reading";

export type ReadingStoreApi = ReturnType<typeof createReadingStore>;

export const ReadingStoreContext = createContext<ReadingStoreApi | undefined>(
  undefined,
);

export interface ReadingStoreProviderProps {
  reading: ReadingQuerySchema;
}

export const ReadingStoreProvider = ({
  children,
  reading,
}: PropsWithChildren<ReadingStoreProviderProps>) => {
  const storeRef = useRef<ReadingStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createReadingStore(initReadingStore(reading));
  }

  useEffect(() => {
    if (storeRef.current?.getState().reading?.id === reading.id) {
      return;
    }

    storeRef.current?.setState({ reading });
  }, [reading]);

  return (
    <ReadingStoreContext.Provider value={storeRef.current}>
      {children}
    </ReadingStoreContext.Provider>
  );
};

export const useReadingStore = <T,>(
  selector: (store: ReadingStore) => T,
): T => {
  const readingStoreContext = useContext(ReadingStoreContext);

  if (!readingStoreContext) {
    throw new Error(`useReadingStore must be used within ReadingStoreProvider`);
  }

  return useStore(readingStoreContext, selector);
};
