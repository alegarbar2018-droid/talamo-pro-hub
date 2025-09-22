/**
 * i18n Configuration for Talamo Pro Hub
 * 
 * Supports Spanish (default), English, and Portuguese
 * Detection order: URL query -> localStorage -> browser -> fallback
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import commonES from './locales/es/common.json';
import navES from './locales/es/nav.json';
import landingES from './locales/es/landing.json';
import dashboardES from './locales/es/dashboard.json';

import commonEN from './locales/en/common.json';
import navEN from './locales/en/nav.json';
import landingEN from './locales/en/landing.json';
import dashboardEN from './locales/en/dashboard.json';

import commonPT from './locales/pt/common.json';
import navPT from './locales/pt/nav.json';
import landingPT from './locales/pt/landing.json';
import dashboardPT from './locales/pt/dashboard.json';

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language settings
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'pt'],
    
    // Detection configuration
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'talamo_lang',
      caches: ['localStorage'],
    },

    // Resources
    resources: {
      es: {
        common: commonES,
        nav: navES,
        landing: landingES,
        dashboard: dashboardES,
      },
      en: {
        common: commonEN,
        nav: navEN,
        landing: landingEN,
        dashboard: dashboardEN,
      },
      pt: {
        common: commonPT,
        nav: navPT,
        landing: landingPT,
        dashboard: dashboardPT,
      },
    },

    // Namespaces
    defaultNS: 'common',
    ns: ['common', 'nav', 'landing', 'dashboard'],

    // Interpolation
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React specific
    react: {
      useSuspense: true,
    },

    // Development
    debug: import.meta.env.DEV,
  });

export default i18n;