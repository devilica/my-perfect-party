import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { INVITATION_TRANSLATIONS } from './invitation-translations.mjs';
import { INVITATION_TRANSLATIONS_WEST } from './invitation-translations-west.mjs';
import { INVITATION_TRANSLATIONS_EAST } from './invitation-translations-east.mjs';
import { INVITATION_TRANSLATIONS_NORTH } from './invitation-translations-north.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const ALL_TRANSLATIONS = {
  ...INVITATION_TRANSLATIONS,
  ...INVITATION_TRANSLATIONS_WEST,
  ...INVITATION_TRANSLATIONS_EAST,
  ...INVITATION_TRANSLATIONS_NORTH,
};

const TARGET_LOCALES = Object.keys(ALL_TRANSLATIONS);

function reorderLocale(data) {
  const { invitation, ...rest } = data;
  const ordered = {};
  for (const key of Object.keys(rest)) {
    ordered[key] = rest[key];
    if (key === 'overview') {
      ordered.invitation = invitation;
    }
  }
  if (!ordered.invitation && invitation) {
    ordered.invitation = invitation;
  }
  return ordered;
}

for (const code of TARGET_LOCALES) {
  const filePath = path.join(localesDir, `${code}.json`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  if (data.invitation) {
    console.log(`skip ${code}: already has invitation`);
    continue;
  }

  data.invitation = ALL_TRANSLATIONS[code];
  const ordered = reorderLocale(data);
  fs.writeFileSync(filePath, `${JSON.stringify(ordered, null, 2)}\n`, 'utf8');
  console.log(`updated ${code}`);
}

const missing = TARGET_LOCALES.filter((code) => !fs.existsSync(path.join(localesDir, `${code}.json`)));
if (missing.length) {
  console.error('Missing locale files:', missing.join(', '));
  process.exit(1);
}

console.log(`Done. Updated ${TARGET_LOCALES.length} locales.`);
