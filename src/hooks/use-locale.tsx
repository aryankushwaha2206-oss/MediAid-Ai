'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import hi from '@/locales/hi.json';

const translations = { en, es, hi };

type Locale = 'en' | 'es' | 'hi';

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string>) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useMemo(
    () => (key: string, values: Record<string, string> = {}) => {
      const keys = key.split('.');
      let result: any = translations[locale];
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
          // Fallback to English if translation is not found
          let fallbackResult: any = translations.en;
          for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if (fallbackResult === undefined) return key;
          }
          result = fallbackResult || key;
          break;
        }
      }

      if (typeof result === 'string') {
        return Object.entries(values).reduce(
          (acc, [placeholder, value]) =>
            acc.replace(`{${placeholder}}`, value),
          result
        );
      }

      return result || key;
    },
    [locale]
  );

  const value = {
    locale,
    setLocale,
    t,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
