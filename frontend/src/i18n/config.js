import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import viTranslation from './locales/vi.json';
import enTranslation from './locales/en.json';

// Get language from localStorage safely
let initialLanguage = 'vi';
try {
  const stored = localStorage.getItem('userLanguage');
  if (stored) {
    initialLanguage = stored;
  }
} catch (e) {
  console.error('Failed to read language from localStorage:', e);
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation }
    },
    lng: initialLanguage,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })
  .catch(err => {
    console.error('Failed to initialize i18n:', err);
  });

export default i18n;
