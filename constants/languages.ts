export const SUPPORTED_LANGUAGES = [
  { code: 'bg', nativeName: 'Български', pickerLocale: 'bg-BG' },
  { code: 'bs', nativeName: 'Bosanski', pickerLocale: 'bs-BA' },
  { code: 'cs', nativeName: 'Čeština', pickerLocale: 'cs-CZ' },
  { code: 'da', nativeName: 'Dansk', pickerLocale: 'da-DK' },
  { code: 'de', nativeName: 'Deutsch', pickerLocale: 'de-DE' },
  { code: 'el', nativeName: 'Ελληνικά', pickerLocale: 'el-GR' },
  { code: 'en', nativeName: 'English', pickerLocale: 'en-GB' },
  { code: 'es', nativeName: 'Español', pickerLocale: 'es-ES' },
  { code: 'et', nativeName: 'Eesti', pickerLocale: 'et-EE' },
  { code: 'fi', nativeName: 'Suomi', pickerLocale: 'fi-FI' },
  { code: 'fr', nativeName: 'Français', pickerLocale: 'fr-FR' },
  { code: 'ga', nativeName: 'Gaeilge', pickerLocale: 'ga-IE' },
  { code: 'hr', nativeName: 'Hrvatski', pickerLocale: 'hr-HR' },
  { code: 'hu', nativeName: 'Magyar', pickerLocale: 'hu-HU' },
  { code: 'it', nativeName: 'Italiano', pickerLocale: 'it-IT' },
  { code: 'lt', nativeName: 'Lietuvių', pickerLocale: 'lt-LT' },
  { code: 'lv', nativeName: 'Latviešu', pickerLocale: 'lv-LV' },
  { code: 'mk', nativeName: 'Македонски', pickerLocale: 'mk-MK' },
  { code: 'mt', nativeName: 'Malti', pickerLocale: 'mt-MT' },
  { code: 'nl', nativeName: 'Nederlands', pickerLocale: 'nl-NL' },
  { code: 'pl', nativeName: 'Polski', pickerLocale: 'pl-PL' },
  { code: 'pt', nativeName: 'Português', pickerLocale: 'pt-PT' },
  { code: 'ro', nativeName: 'Română', pickerLocale: 'ro-RO' },
  { code: 'sk', nativeName: 'Slovenčina', pickerLocale: 'sk-SK' },
  { code: 'sl', nativeName: 'Slovenščina', pickerLocale: 'sl-SI' },
  { code: 'sq', nativeName: 'Shqip', pickerLocale: 'sq-AL' },
  { code: 'sr-cy', nativeName: 'Српски', pickerLocale: 'sr-Cyrl-RS' },
  { code: 'sr', nativeName: 'Srpski', pickerLocale: 'sr-Latn-RS' },
  { code: 'sv', nativeName: 'Svenska', pickerLocale: 'sv-SE' },
  { code: 'uk', nativeName: 'Українська', pickerLocale: 'uk-UA' },
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

export function getLanguageSelectOptions(): { value: Language; label: string }[] {
  return [...SUPPORTED_LANGUAGES]
    .sort((a, b) => a.nativeName.localeCompare(b.nativeName, undefined, { sensitivity: 'base' }))
    .map((language) => ({
      value: language.code,
      label: language.nativeName,
    }));
}
