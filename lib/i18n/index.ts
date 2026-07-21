import bg from '@/locales/bg.json';
import bs from '@/locales/bs.json';
import cs from '@/locales/cs.json';
import da from '@/locales/da.json';
import de from '@/locales/de.json';
import el from '@/locales/el.json';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import et from '@/locales/et.json';
import fi from '@/locales/fi.json';
import fr from '@/locales/fr.json';
import ga from '@/locales/ga.json';
import hr from '@/locales/hr.json';
import hu from '@/locales/hu.json';
import it from '@/locales/it.json';
import lt from '@/locales/lt.json';
import lv from '@/locales/lv.json';
import mk from '@/locales/mk.json';
import mt from '@/locales/mt.json';
import nl from '@/locales/nl.json';
import pl from '@/locales/pl.json';
import pt from '@/locales/pt.json';
import ro from '@/locales/ro.json';
import sk from '@/locales/sk.json';
import sl from '@/locales/sl.json';
import sq from '@/locales/sq.json';
import sr from '@/locales/sr.json';
import srCy from '@/locales/sr-cy.json';
import sv from '@/locales/sv.json';
import uk from '@/locales/uk.json';
import { Language } from '@/constants/languages';

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

const translations: Record<Language, TranslationTree> = {
  bg: bg as TranslationTree,
  bs: bs as TranslationTree,
  cs: cs as TranslationTree,
  da: da as TranslationTree,
  de: de as TranslationTree,
  el: el as TranslationTree,
  en: en as TranslationTree,
  es: es as TranslationTree,
  et: et as TranslationTree,
  fi: fi as TranslationTree,
  fr: fr as TranslationTree,
  ga: ga as TranslationTree,
  hr: hr as TranslationTree,
  hu: hu as TranslationTree,
  it: it as TranslationTree,
  lt: lt as TranslationTree,
  lv: lv as TranslationTree,
  mk: mk as TranslationTree,
  mt: mt as TranslationTree,
  nl: nl as TranslationTree,
  pl: pl as TranslationTree,
  pt: pt as TranslationTree,
  ro: ro as TranslationTree,
  sk: sk as TranslationTree,
  sl: sl as TranslationTree,
  sq: sq as TranslationTree,
  sr: sr as TranslationTree,
  'sr-cy': srCy as TranslationTree,
  sv: sv as TranslationTree,
  uk: uk as TranslationTree,
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

  if (language !== 'en') {
    const enFallback = getNestedValue(translations.en, key);
    if (enFallback) return interpolate(enFallback, params);
  }

  return key;
}

export function getDefaultLanguage(): Language {
  return 'en';
}

export function useTranslation(language: Language) {
  return {
    t: (key: string, params?: Record<string, string | number>) =>
      translate(language, key, params),
    language,
  };
}

export { isLanguage } from '@/constants/languages';
