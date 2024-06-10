import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  accessToken: string;
  changeAccessToken: (accessToken: string) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: "",
      changeAccessToken: (token) => set(() => ({ accessToken: token })),
    }),
    {
      name: "access-token",
      getStorage: () => localStorage,
    },
  ),
);
