import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  LANG_STORAGE_KEY,
  translations,
  type Language,
  type TranslationKey,
} from './translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'id';
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return stored === 'en' || stored === 'id' ? stored : 'id';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
  };

  const t: LanguageContextValue['t'] = (key, vars) => {
    let text = translations[lang][key] ?? translations.id[key] ?? key;
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replaceAll(`{${name}}`, value);
      }
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}