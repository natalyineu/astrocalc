// One entry per language. A language is built only when src/i18n/locales/<code>.json exists.
// Missing keys fall back to English, so partially translated files still build.
export interface LocaleMeta {
  code: string;      // URL prefix: /<code>/...
  tag: string;       // BCP-47 tag for hreflang / Intl / <html lang>
  name: string;      // English name
  native: string;    // Name shown in the language switcher
  dir?: 'rtl';
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en', tag: 'en', name: 'English', native: 'English' },
  { code: 'es', tag: 'es', name: 'Spanish', native: 'Español' },
  { code: 'pt', tag: 'pt-BR', name: 'Portuguese', native: 'Português' },
  { code: 'de', tag: 'de', name: 'German', native: 'Deutsch' },
  { code: 'fr', tag: 'fr', name: 'French', native: 'Français' },
  { code: 'it', tag: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'ru', tag: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'tr', tag: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'id', tag: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'pl', tag: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'nl', tag: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'ja', tag: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', tag: 'ko', name: 'Korean', native: '한국어' },
  { code: 'zh', tag: 'zh-Hans', name: 'Chinese (Simplified)', native: '简体中文' },
  { code: 'hi', tag: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ar', tag: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'vi', tag: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'th', tag: 'th', name: 'Thai', native: 'ไทย' },
];

export const DEFAULT_LOCALE = 'en';
export type Locale = string;
