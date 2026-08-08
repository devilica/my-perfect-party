export const SUPPORTED_LANGUAGES = [
  { code: 'ar', nativeName: 'العربية', pickerLocale: 'ar-SA', flag: '🇸🇦' },
  { code: 'bg', nativeName: 'Български', pickerLocale: 'bg-BG', flag: '🇧🇬' },
  { code: 'bn', nativeName: 'বাংলা', pickerLocale: 'bn-BD', flag: '🇧🇩' },
  { code: 'bs', nativeName: 'Bosanski', pickerLocale: 'bs-BA', flag: '🇧🇦' },
  { code: 'cs', nativeName: 'Čeština', pickerLocale: 'cs-CZ', flag: '🇨🇿' },
  { code: 'da', nativeName: 'Dansk', pickerLocale: 'da-DK', flag: '🇩🇰' },
  { code: 'de', nativeName: 'Deutsch', pickerLocale: 'de-DE', flag: '🇩🇪' },
  { code: 'el', nativeName: 'Ελληνικά', pickerLocale: 'el-GR', flag: '🇬🇷' },
  { code: 'en', nativeName: 'English', pickerLocale: 'en-GB', flag: '🇬🇧' },
  { code: 'es', nativeName: 'Español', pickerLocale: 'es-ES', flag: '🇪🇸' },
  { code: 'es-mx', nativeName: 'Español (México)', pickerLocale: 'es-MX', flag: '🇲🇽' },
  { code: 'et', nativeName: 'Eesti', pickerLocale: 'et-EE', flag: '🇪🇪' },
  { code: 'fi', nativeName: 'Suomi', pickerLocale: 'fi-FI', flag: '🇫🇮' },
  { code: 'fr', nativeName: 'Français', pickerLocale: 'fr-FR', flag: '🇫🇷' },
  { code: 'fa', nativeName: 'فارسی', pickerLocale: 'fa-IR', flag: '🇮🇷' },
  { code: 'ga', nativeName: 'Gaeilge', pickerLocale: 'ga-IE', flag: '🇮🇪' },
  { code: 'he', nativeName: 'עברית', pickerLocale: 'he-IL', flag: '🇮🇱' },
  { code: 'hi', nativeName: 'हिन्दी', pickerLocale: 'hi-IN', flag: '🇮🇳' },
  { code: 'hr', nativeName: 'Hrvatski', pickerLocale: 'hr-HR', flag: '🇭🇷' },
  { code: 'hu', nativeName: 'Magyar', pickerLocale: 'hu-HU', flag: '🇭🇺' },
  { code: 'id', nativeName: 'Bahasa Indonesia', pickerLocale: 'id-ID', flag: '🇮🇩' },
  { code: 'it', nativeName: 'Italiano', pickerLocale: 'it-IT', flag: '🇮🇹' },
  { code: 'ja', nativeName: '日本語', pickerLocale: 'ja-JP', flag: '🇯🇵' },
  { code: 'ko', nativeName: '한국어', pickerLocale: 'ko-KR', flag: '🇰🇷' },
  { code: 'lt', nativeName: 'Lietuvių', pickerLocale: 'lt-LT', flag: '🇱🇹' },
  { code: 'lv', nativeName: 'Latviešu', pickerLocale: 'lv-LV', flag: '🇱🇻' },
  { code: 'mk', nativeName: 'Македонски', pickerLocale: 'mk-MK', flag: '🇲🇰' },
  { code: 'ms', nativeName: 'Bahasa Melayu', pickerLocale: 'ms-MY', flag: '🇲🇾' },
  { code: 'mt', nativeName: 'Malti', pickerLocale: 'mt-MT', flag: '🇲🇹' },
  { code: 'nl', nativeName: 'Nederlands', pickerLocale: 'nl-NL', flag: '🇳🇱' },
  { code: 'pl', nativeName: 'Polski', pickerLocale: 'pl-PL', flag: '🇵🇱' },
  { code: 'pt', nativeName: 'Português', pickerLocale: 'pt-PT', flag: '🇵🇹' },
  { code: 'pt-br', nativeName: 'Português (Brasil)', pickerLocale: 'pt-BR', flag: '🇧🇷' },
  { code: 'ro', nativeName: 'Română', pickerLocale: 'ro-RO', flag: '🇷🇴' },
  { code: 'ru', nativeName: 'Русский', pickerLocale: 'ru-RU', flag: '🇷🇺' },
  { code: 'sk', nativeName: 'Slovenčina', pickerLocale: 'sk-SK', flag: '🇸🇰' },
  { code: 'sl', nativeName: 'Slovenščina', pickerLocale: 'sl-SI', flag: '🇸🇮' },
  { code: 'sq', nativeName: 'Shqip', pickerLocale: 'sq-AL', flag: '🇦🇱' },
  { code: 'sr-cy', nativeName: 'Српски', pickerLocale: 'sr-Cyrl-RS', flag: '🇷🇸' },
  { code: 'sr', nativeName: 'Srpski', pickerLocale: 'sr-Latn-RS', flag: '🇷🇸' },
  { code: 'sv', nativeName: 'Svenska', pickerLocale: 'sv-SE', flag: '🇸🇪' },
  { code: 'th', nativeName: 'ไทย', pickerLocale: 'th-TH', flag: '🇹🇭' },
  { code: 'tr', nativeName: 'Türkçe', pickerLocale: 'tr-TR', flag: '🇹🇷' },
  { code: 'uk', nativeName: 'Українська', pickerLocale: 'uk-UA', flag: '🇺🇦' },
  { code: 'vi', nativeName: 'Tiếng Việt', pickerLocale: 'vi-VN', flag: '🇻🇳' },
  { code: 'zh', nativeName: '中文', pickerLocale: 'zh-CN', flag: '🇨🇳' },
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const LANGUAGE_CODES: Language[] = SUPPORTED_LANGUAGES.map((language) => language.code);

const languageByCode = new Map(SUPPORTED_LANGUAGES.map((language) => [language.code, language]));

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && languageByCode.has(value as Language);
}

export function getLanguageNativeName(code: Language): string {
  return languageByCode.get(code)?.nativeName ?? code;
}

export function getPickerLocale(code: Language): string {
  return languageByCode.get(code)?.pickerLocale ?? 'en-GB';
}

export function getLanguageDisplayLabel(code: Language): string {
  const language = languageByCode.get(code);
  return language ? `${language.flag} ${language.nativeName}` : code;
}

export function getLanguageSelectOptions(): { value: Language; label: string }[] {
  return [...SUPPORTED_LANGUAGES]
    .sort((a, b) => a.nativeName.localeCompare(b.nativeName, undefined, { sensitivity: 'base' }))
    .map((language) => ({
      value: language.code,
      label: getLanguageDisplayLabel(language.code),
    }));
}
