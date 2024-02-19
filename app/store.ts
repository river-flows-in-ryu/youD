import { create } from "zustand";

interface MainHamburgerToggle {
  toggle: boolean;
  setToggle: () => void;
}

export const useMainHamburgerToggleStore = create<MainHamburgerToggle>()(
  (set) => ({
    toggle: false,
    setToggle: () => set((state) => ({ toggle: !state.toggle })),
  })
);
