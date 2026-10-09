import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { t as translate, applyDomTranslations } from '../services/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyOrText: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (keyOrText: string) => keyOrText,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: ReactNode;
}> = ({ language, onLanguageChange, children }) => {
  const t = (keyOrText: string) => translate(keyOrText, language);

  useEffect(() => {
    // 1. Set document language attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }

    // 2. Apply DOM dynamic translations
    applyDomTranslations(document.body, language);

    // 3. Observe DOM changes to translate dynamic content
    const observer = new MutationObserver(() => {
      applyDomTranslations(document.body, language);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: onLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
