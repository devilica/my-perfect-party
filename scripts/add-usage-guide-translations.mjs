import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { usageGuideTranslations } from './usage-guide-translations-data.mjs';

const localesDir = join(import.meta.dirname, '..', 'locales');
const localeCodes = Object.keys(usageGuideTranslations);

for (const localeCode of localeCodes) {
  const bundle = usageGuideTranslations[localeCode];
  const filePath = join(localesDir, `${localeCode}.json`);
  const json = JSON.parse(readFileSync(filePath, 'utf8'));

  json.settings = {
    ...json.settings,
    usageGuide: bundle.settings.usageGuide,
  };

  json.legal = {
    ...json.legal,
    usage: bundle.legal.usage,
  };

  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log(`Updated usage guide translations in ${localeCodes.length} locale files.`);
