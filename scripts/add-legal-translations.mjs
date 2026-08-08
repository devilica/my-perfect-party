import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { legalTranslations } from './legal-translations-data.mjs';

const localesDir = join(import.meta.dirname, '..', 'locales');
const localeCodes = Object.keys(legalTranslations);

for (const localeCode of localeCodes) {
  const bundle = legalTranslations[localeCode];
  const filePath = join(localesDir, `${localeCode}.json`);
  const json = JSON.parse(readFileSync(filePath, 'utf8'));

  json.settings = {
    ...json.settings,
    ...bundle.settings,
  };
  json.legal = bundle.legal;

  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log(`Updated legal translations in ${localeCodes.length} locale files.`);
