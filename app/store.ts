import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface MainHamburgerToggle {
  toggle: boolean;
  setToggle: () => void;
}

interface IsUserId {
  isUserId: boolean;
  setIsUserId: () => void;
  userId: string | null;
  setUserId: (num: string) => void;
}

export const useMainHamburgerToggleStore = create<MainHamburgerToggle>()(
  (set) => ({
    toggle: false,
    setToggle: () => set((state) => ({ toggle: !state.toggle })),
  })
);

// export const useUserIdStore = create<IsUserId>(
//   persist<>(
//     (set) => ({
//       isUserId: false,
//       userId: null,
//       setIsUserId : ()=> set({!isUserId}),
//       setUserId: (num) => set({ userId: num }),
//     })
//   )
// )
