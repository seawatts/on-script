"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useStore } from "zustand";

import type { UserStore } from "~/stores/user";
import { createUserStore } from "~/stores/user";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined,
);

export const UserStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<UserStoreApi>();
  const user = useUser();

  if (!storeRef.current) {
    storeRef.current = createUserStore();
  }

  useEffect(() => {
    storeRef.current?.setState({ user: user.user });
  }, [user]);

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
