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
import adminES from './locales/es/admin.json';
import formsES from './locales/es/forms.json';
import tableES from './locales/es/table.json';
import academyES from './locales/es/academy.json';
import signalsES from './locales/es/signals.json';
import copyES from './locales/es/copy.json';
import toolsES from './locales/es/tools.json';
import communityES from './locales/es/community.json';
import referralsES from './locales/es/referrals.json';

import commonEN from './locales/en/common.json';
import navEN from './locales/en/nav.json';
import landingEN from './locales/en/landing.json';
import dashboardEN from './locales/en/dashboard.json';
import adminEN from './locales/en/admin.json';
import formsEN from './locales/en/forms.json';
import tableEN from './locales/en/table.json';
import academyEN from './locales/en/academy.json';
import signalsEN from './locales/en/signals.json';
import copyEN from './locales/en/copy.json';
import toolsEN from './locales/en/tools.json';
import communityEN from './locales/en/community.json';
import referralsEN from './locales/en/referrals.json';

import commonPT from './locales/pt/common.json';
import navPT from './locales/pt/nav.json';
import landingPT from './locales/pt/landing.json';
import dashboardPT from './locales/pt/dashboard.json';
import adminPT from './locales/pt/admin.json';
import formsPT from './locales/pt/forms.json';
import tablePT from './locales/pt/table.json';
import academyPT from './locales/pt/academy.json';
import signalsPT from './locales/pt/signals.json';
import copyPT from './locales/pt/copy.json';
import toolsPT from './locales/pt/tools.json';
import communityPT from './locales/pt/community.json';
import referralsPT from './locales/pt/referrals.json';

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
        admin: adminES,
        forms: formsES,
        table: tableES,
        academy: academyES,
        signals: signalsES,
        copy: copyES,
        tools: toolsES,
        community: communityES,
        referrals: referralsES,
      },
      en: {
        common: commonEN,
        nav: navEN,
        landing: landingEN,
        dashboard: dashboardEN,
        admin: adminEN,
        forms: formsEN,
        table: tableEN,
        academy: academyEN,
        signals: signalsEN,
        copy: copyEN,
        tools: toolsEN,
        community: communityEN,
        referrals: referralsEN,
      },
      pt: {
        common: commonPT,
        nav: navPT,
        landing: landingPT,
        dashboard: dashboardPT,
        admin: adminPT,
        forms: formsPT,
        table: tablePT,
        academy: academyPT,
        signals: signalsPT,
        copy: copyPT,
        tools: toolsPT,
        community: communityPT,
        referrals: referralsPT,
      },
    },

    // Namespaces
    defaultNS: 'common',
    ns: ['common', 'nav', 'landing', 'dashboard', 'admin', 'forms', 'table', 'academy', 'signals', 'copy', 'tools', 'community', 'referrals'],

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