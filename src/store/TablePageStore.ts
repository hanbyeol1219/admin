import { create } from "zustand";

type TablePageStore = {
  tablePage: number;
  changeTablePage: (tablePage: number) => void;
};

export const useTablePageStore = create<TablePageStore>()(
    (set) => ({
        tablePage: 0,
        changeTablePage: (page) => set(() => ({ tablePage: page })),
    })
);
