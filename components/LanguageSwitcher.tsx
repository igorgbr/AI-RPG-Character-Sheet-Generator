
import React from 'react';
import { useI18n } from '../context/i18n';
import { Languages } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useI18n();

    const toggleLanguage = () => {
        const newLocale = locale === 'pt-BR' ? 'en-US' : 'pt-BR';
        setLocale(newLocale);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
            aria-label="Change language"
        >
            <Languages size={16} />
            <span>{locale === 'pt-BR' ? 'PT-BR' : 'EN-US'}</span>
        </button>
    );
};

export default LanguageSwitcher;
