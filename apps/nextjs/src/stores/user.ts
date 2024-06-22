import type { useUser } from "@clerk/nextjs";
import { createStore } from "zustand/vanilla";

export type ClerkUser = ReturnType<typeof useUser>["user"];

export interface UserState {
  user?: ClerkUser;
}

// export interface UserActions {}

// export type UserStore = UserState & UserActions;
export type UserStore = UserState;

export const defaultInitState: UserState = {
  user: undefined,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((_set) => ({
    ...initState,
  }));
};

export const initUserStore = (user: ClerkUser): UserState => {
  return { user };
};
