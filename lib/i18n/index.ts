import bs from '@/locales/bs.json';
import en from '@/locales/en.json';
import { Language } from '@/types/models';

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

const translations: Record<Language, TranslationTree> = {
  bs: bs as TranslationTree,
  en: en as TranslationTree,
};

function getNestedValue(obj: TranslationTree, path: string): string | undefined {
  const keys = path.split('.');
  let current: string | TranslationTree = obj;

  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = current[key];
  }

  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`
  );
}

export function translate(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  const value = getNestedValue(translations[language], key);
  if (value) return interpolate(value, params);

  const fallback = getNestedValue(translations.bs, key);
  if (fallback) return interpolate(fallback, params);

  return key;
}

export function getDefaultLanguage(): Language {
  return 'bs';
}

export function useTranslation(language: Language) {
  return {
    t: (key: string, params?: Record<string, string | number>) =>
      translate(language, key, params),
    language,
  };
}
