import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { gptTranslate } from '~features/chatgpt';
import type { Translations } from '~shared/types/translationTypes';

interface TranslationsContextProps {
  translations: Translations;
  setTranslations: React.Dispatch<React.SetStateAction<Translations>>;
  loading: boolean;
}

const TranslationsContext = createContext<TranslationsContextProps | undefined>(undefined);

export const useTranslations = (): TranslationsContextProps => {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};

interface TranslationsProviderProps {
  children: ReactNode;
  selectionElement: HTMLElement;
}

export const TranslationsProvider: React.FC<TranslationsProviderProps> = ({ children, selectionElement }) => {
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTranslation() {
      const selectionText = selectionElement.innerText;
      const translatedText: Translations = await gptTranslate(selectionText);
      setTranslations(translatedText);
      setLoading(false);
    }

    fetchTranslation();
  }, [selectionElement]);

  return (
    <TranslationsContext.Provider value={{ translations, setTranslations, loading }}>
      {children}
    </TranslationsContext.Provider>
  );
};
