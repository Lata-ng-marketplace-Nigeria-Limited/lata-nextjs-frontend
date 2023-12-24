import { create } from "zustand";

export const useSideMenuStore = create<{
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  toggleIsOpen: () => void;
}>((set, get) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleIsOpen: () => set({ isOpen: !get().isOpen }),
}));
