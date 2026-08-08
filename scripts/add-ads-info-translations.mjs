import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { adsInfoTranslations } from './ads-info-translations-data.mjs';

const localesDir = join(import.meta.dirname, '..', 'locales');
const localeCodes = Object.keys(adsInfoTranslations);

for (const localeCode of localeCodes) {
  const bundle = adsInfoTranslations[localeCode];
  const filePath = join(localesDir, `${localeCode}.json`);
  const json = JSON.parse(readFileSync(filePath, 'utf8'));

  json.settings = {
    ...json.settings,
    adsInfo: bundle.settings.adsInfo,
  };

  json.legal = {
    ...json.legal,
    ads: bundle.legal.ads,
  };

  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log(`Updated ads info translations in ${localeCodes.length} locale files.`);
