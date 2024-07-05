import create from "zustand";
import type { Translations } from "~shared/types/translationTypes";

interface TranslationStore {
  translation: Translations
  setTranslation: (translation: Translations) => void;
  clearTranslation: () => void;
}

const createTranslationStore = () => create<TranslationStore>((set) => ({
  translation: {},
  setTranslation: (translation) => set({ translation }),
  clearTranslation: () => set({ translation: {} })
}));

export default createTranslationStore;