import { create } from "zustand";

type LoadingStore = {
  isLoading: boolean;
  changeLoadingStatus: (isLoading: boolean) => void;
};

export const useLoadingStore = create<LoadingStore>()((set) => ({
    isLoading: false,
    changeLoadingStatus: (status) => set(() => ({ isLoading: status })),
}));
