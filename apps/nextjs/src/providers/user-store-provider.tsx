"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useRef } from "react";
import { useStore } from "zustand";

import type { ClerkUser, UserStore } from "~/stores/user";
import { createUserStore, initUserStore } from "~/stores/user";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined,
);

export interface UserStoreProviderProps {
  user?: ClerkUser;
}

export const UserStoreProvider = ({
  children,
  user,
}: PropsWithChildren<UserStoreProviderProps>) => {
  const storeRef = useRef<UserStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createUserStore(initUserStore(user));
  }

  useEffect(() => {
    if (storeRef.current?.getState().user?.id === user?.id) {
      return;
    }

    storeRef.current?.setState({ user });
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
