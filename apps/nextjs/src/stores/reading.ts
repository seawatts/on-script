import { createStore } from "zustand/vanilla";

import type {
  CharacterAssignmentQuerySchema,
  ElementSelectSchema,
  ReadingQuerySchema,
} from "@on-script/db/schema";

export interface ReadingState {
  reading?: ReadingQuerySchema;
  selectedElement?: ElementSelectSchema;
  characterAssignments?: CharacterAssignmentQuerySchema[];
  onlineUsers?: Set<string>;
}

export interface ReadingActions {
  setCurrentElementId: (elementId: string) => void;
  setOnlineUsers: (onlineUsers: Set<string>) => void;
  addCharacterAssignment: (
    characterAssignment: CharacterAssignmentQuerySchema,
  ) => void;
  removeCharacterAssignmentById: (characterAssignmentId: string) => void;
}

export type ReadingStore = ReadingState & ReadingActions;

export const defaultInitState: ReadingState = {
  characterAssignments: [],
  onlineUsers: new Set(),
  reading: undefined,
  selectedElement: undefined,
};

export const createReadingStore = (
  initState: ReadingState = defaultInitState,
) => {
  return createStore<ReadingStore>()((set) => ({
    ...initState,
    addCharacterAssignment: (characterAssignment) =>
      set((state) => ({
        characterAssignments: [
          ...(state.characterAssignments ?? []),
          characterAssignment,
        ],
      })),
    removeCharacterAssignmentById: (characterAssignmentId) =>
      set((state) => ({
        characterAssignments: state.characterAssignments?.filter(
          (assignment) => assignment.id !== characterAssignmentId,
        ),
      })),
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
    characterAssignments: reading.characterAssignments,
    onlineUsers: new Set(),
    reading,
    selectedElement: reading.script.elements?.find(
      (element) => element.id === reading.currentElementId,
    ),
  };
};
