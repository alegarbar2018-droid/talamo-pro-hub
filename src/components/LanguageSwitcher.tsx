/**
 * Language Switcher Component
 * 
 * Only renders when i18n_v1 flag is enabled
 * Allows switching between ES, EN, PT
 */

import { useTranslation } from 'react-i18next';
import { isFeatureEnabled } from '@/lib/flags';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation(['nav']);
  
  // Only render if i18n flag is enabled
  if (!isFeatureEnabled('i18n_v1')) {
    return null;
  }

  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select 
        value={i18n.language} 
        onValueChange={handleLanguageChange}
        aria-label={t('nav:lang_selector')}
      >
        <SelectTrigger className="w-auto min-w-[120px] h-8 text-sm border-border/50 bg-background/50 backdrop-blur-sm">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span className="hidden sm:inline">{currentLanguage.name}</span>
              <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-[140px]">
          {languages.map((language) => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;