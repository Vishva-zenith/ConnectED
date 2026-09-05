import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const { language } = useApp();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return { t };
};
