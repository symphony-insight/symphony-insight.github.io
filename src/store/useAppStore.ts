import { create } from "zustand";
import type { Language } from "../types/domain";

type AppState = {
  selectedChildId: string;
  language: Language;
  setSelectedChildId: (childId: string) => void;
  setLanguage: (language: Language) => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedChildId: "xiaoyu",
  language: "zh",
  setSelectedChildId: (selectedChildId) => set({ selectedChildId }),
  setLanguage: (language) => set({ language })
}));
