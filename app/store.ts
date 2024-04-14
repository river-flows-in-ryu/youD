import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface MainHamburgerToggle {
  toggle: boolean;
  setToggle: () => void;
}

interface IsUserId {
  userId: number;
  setUserId: (num: number) => void;
}

interface GuestUserId {
  userId: number;
  setUserId: (num: number) => void;
}

export const useMainHamburgerToggleStore = create<MainHamburgerToggle>()(
  (set) => ({
    toggle: false,
    setToggle: () => set((state) => ({ toggle: !state.toggle })),
  })
);

export const useUserIdStore = create(
  persist<IsUserId>(
    (set) => ({
      userId: 0,
      setUserId: (num: number) => set((state) => ({ userId: num })),
    }),
    {
      name: "userId",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const guestUserId = create<GuestUserId>((set) => ({
  userId: 0,
  setUserId: (num: number) => set((state) => ({ userId: num })),
}));
