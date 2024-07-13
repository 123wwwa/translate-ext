import create from "zustand";
import type { Translations } from "~shared/types/translationTypes";



interface TranslationStore {
  translations: { [key: string]: Translations };
  setTranslation: (key: string, translation: Translations) => void;
  getTranslation: (key: string) => Translations | undefined;
}

const useCacheTranslationStore = create<TranslationStore>((set, get) => ({
  translations: {},
  setTranslation: (key, translation) =>
    set((state) => ({
      translations: { ...state.translations, [key]: translation }
    })),
  getTranslation: (key) => {
    const state = get();
    return state.translations[key];
  },
}));

export default useCacheTranslationStore;
