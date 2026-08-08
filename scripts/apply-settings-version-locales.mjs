import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const localesDir = join(import.meta.dirname, '..', 'locales');

const VERSION_TRANSLATIONS = {
  bg: 'Версия {{version}}',
  bs: 'Verzija {{version}}',
  cs: 'Verze {{version}}',
  da: 'Version {{version}}',
  de: 'Version {{version}}',
  el: 'Έκδοση {{version}}',
  en: 'Version {{version}}',
  es: 'Versión {{version}}',
  et: 'Versioon {{version}}',
  fi: 'Versio {{version}}',
  fr: 'Version {{version}}',
  ga: 'Leagan {{version}}',
  hr: 'Verzija {{version}}',
  hu: 'Verzió {{version}}',
  it: 'Versione {{version}}',
  lt: 'Versija {{version}}',
  lv: 'Versija {{version}}',
  mk: 'Верзија {{version}}',
  mt: 'Verżjoni {{version}}',
  nl: 'Versie {{version}}',
  pl: 'Wersja {{version}}',
  pt: 'Versão {{version}}',
  ro: 'Versiune {{version}}',
  sk: 'Verzia {{version}}',
  sl: 'Različica {{version}}',
  sq: 'Versioni {{version}}',
  sr: 'Verzija {{version}}',
  'sr-cy': 'Верзија {{version}}',
  sv: 'Version {{version}}',
  uk: 'Версія {{version}}',
};

for (const [locale, version] of Object.entries(VERSION_TRANSLATIONS)) {
  const filePath = join(localesDir, `${locale}.json`);
  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  data.settings.version = version;
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

console.log(`Updated settings.version in ${Object.keys(VERSION_TRANSLATIONS).length} locale files.`);
