import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { commonFetch } from "@/utils/commonFetch";
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

interface CartState {
  itemCount: number;
  setItemCount: (count: number) => void;
  fetchCartItemCount: (userId: number) => Promise<void>;
}

export const useCartCountStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
  fetchCartItemCount: async (userId) => {
    try {
      const res = await commonFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/count?user_id=${userId}`,
        "get"
      );
      if (res) {
        set({ itemCount: res.totalCount });
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  },
}));
