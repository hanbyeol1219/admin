import { create } from "zustand";

type ErrorStore = {
  errorStatus: string;
  changeErrorStatus: (errorStatus: string) => void;
};

export const useErrorStore = create<ErrorStore>()((set) => ({
  errorStatus: "",
  changeErrorStatus: (status) => set(() => ({ errorStatus: status })),
}));
