import ar from '@/locales/ar.json';
import bg from '@/locales/bg.json';
import bn from '@/locales/bn.json';
import bs from '@/locales/bs.json';
import cs from '@/locales/cs.json';
import da from '@/locales/da.json';
import de from '@/locales/de.json';
import el from '@/locales/el.json';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import esMx from '@/locales/es-mx.json';
import et from '@/locales/et.json';
import fa from '@/locales/fa.json';
import fi from '@/locales/fi.json';
import fr from '@/locales/fr.json';
import ga from '@/locales/ga.json';
import he from '@/locales/he.json';
import hi from '@/locales/hi.json';
import hr from '@/locales/hr.json';
import hu from '@/locales/hu.json';
import id from '@/locales/id.json';
import it from '@/locales/it.json';
import ja from '@/locales/ja.json';
import ko from '@/locales/ko.json';
import lt from '@/locales/lt.json';
import lv from '@/locales/lv.json';
import mk from '@/locales/mk.json';
import ms from '@/locales/ms.json';
import mt from '@/locales/mt.json';
import nl from '@/locales/nl.json';
import pl from '@/locales/pl.json';
import pt from '@/locales/pt.json';
import ptBr from '@/locales/pt-br.json';
import ro from '@/locales/ro.json';
import ru from '@/locales/ru.json';
import sk from '@/locales/sk.json';
import sl from '@/locales/sl.json';
import sq from '@/locales/sq.json';
import sr from '@/locales/sr.json';
import srCy from '@/locales/sr-cy.json';
import sv from '@/locales/sv.json';
import th from '@/locales/th.json';
import tr from '@/locales/tr.json';
import uk from '@/locales/uk.json';
import vi from '@/locales/vi.json';
import zh from '@/locales/zh.json';
import { Language } from '@/constants/languages';

type TranslationTree = {
  [key: string]: string | TranslationTree;
};

const translations: Record<Language, TranslationTree> = {
  ar: ar as TranslationTree,
  bg: bg as TranslationTree,
  bn: bn as TranslationTree,
  bs: bs as TranslationTree,
  cs: cs as TranslationTree,
  da: da as TranslationTree,
  de: de as TranslationTree,
  el: el as TranslationTree,
  en: en as TranslationTree,
  es: es as TranslationTree,
  'es-mx': esMx as TranslationTree,
  et: et as TranslationTree,
  fa: fa as TranslationTree,
  fi: fi as TranslationTree,
  fr: fr as TranslationTree,
  ga: ga as TranslationTree,
  he: he as TranslationTree,
  hi: hi as TranslationTree,
  hr: hr as TranslationTree,
  hu: hu as TranslationTree,
  id: id as TranslationTree,
  it: it as TranslationTree,
  ja: ja as TranslationTree,
  ko: ko as TranslationTree,
  lt: lt as TranslationTree,
  lv: lv as TranslationTree,
  mk: mk as TranslationTree,
  ms: ms as TranslationTree,
  mt: mt as TranslationTree,
  nl: nl as TranslationTree,
  pl: pl as TranslationTree,
  pt: pt as TranslationTree,
  'pt-br': ptBr as TranslationTree,
  ro: ro as TranslationTree,
  ru: ru as TranslationTree,
  sk: sk as TranslationTree,
  sl: sl as TranslationTree,
  sq: sq as TranslationTree,
  sr: sr as TranslationTree,
  'sr-cy': srCy as TranslationTree,
  sv: sv as TranslationTree,
  th: th as TranslationTree,
  tr: tr as TranslationTree,
  uk: uk as TranslationTree,
  vi: vi as TranslationTree,
  zh: zh as TranslationTree,
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
