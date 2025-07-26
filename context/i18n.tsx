
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { translations, Locale } from '../locales/translations';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>(() => {
        const browserLang = navigator.language;
        return browserLang === 'pt-BR' ? 'pt-BR' : 'en-US';
    });

    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const t = useMemo(() => (key: string, params?: Record<string, string | number>): string => {
        const keys = key.split('.');
        let result = translations[locale];

        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = (result as any)[k];
            } else {
                return key; // Return key if not found
            }
        }
        
        if (typeof result === 'string' && params) {
            return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
                return acc.replace(`{${paramKey}}`, String(paramValue));
            }, result);
        }

        return typeof result === 'string' ? result : key;
    }, [locale]);
    
    const value = { locale, setLocale, t };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};
