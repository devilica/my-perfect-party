/**
 * Spot-check celebration copy + legal invitation share/download wording.
 * Run: node scripts/verify-celebration-i18n.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const SPOT_LOCALES = ['en', 'bs', 'hr', 'de', 'fr', 'sr', 'sr-cy'];

/** Substring that indicates share is free (per locale). */
const SHARE_FREE_MARKERS = {
  en: 'Sharing is free',
  bs: 'Dijeljenje je besplatno',
  hr: 'Dijeljenje je besplatno',
  de: 'Teilen ist kostenlos',
  fr: 'partage est gratuit',
  sr: 'Deljenje je besplatno',
  'sr-cy': 'Дељење',
};

const CELEBRATION_MARKERS = /proslav|celebration|Feier|fête|party|Veranstaltung|прослав/i;

const OLD_WEDDING_PLANNING = /plan(ning)?\s+(your\s+)?wedding|planirati\s+vjenčan|vjenčanje\s+plan/i;

let failed = false;

function fail(message) {
  console.error(`FAIL: ${message}`);
  failed = true;
}

for (const locale of SPOT_LOCALES) {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    fail(`missing locale file ${locale}.json`);
    continue;
  }

  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const eventsSub = json.events?.emptySubtitle ?? '';
  const expensesSub = json.expenses?.emptySubtitle ?? '';

  if (OLD_WEDDING_PLANNING.test(eventsSub) || OLD_WEDDING_PLANNING.test(expensesSub)) {
    fail(`${locale}: emptySubtitle still uses wedding-only planning copy`);
  }

  if (!CELEBRATION_MARKERS.test(eventsSub)) {
    fail(`${locale}: events.emptySubtitle missing celebration wording (${eventsSub.slice(0, 60)}…)`);
  }

  const invitationBody = json.legal?.ads?.invitationBody ?? '';
  const marker = SHARE_FREE_MARKERS[locale] ?? SHARE_FREE_MARKERS.en;
  if (!invitationBody.includes(marker)) {
    fail(`${locale}: legal.ads.invitationBody missing share-free marker "${marker}"`);
  }
}

const allFiles = fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'));
for (const file of allFiles) {
  const json = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
  const body = json.legal?.ads?.invitationBody;
  if (typeof body === 'string' && /^Sharing or downloading/i.test(body)) {
    fail(`${file}: still uses old combined share/download ad copy (English)`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`OK: celebration i18n spot-check (${SPOT_LOCALES.join(', ')}) + ${allFiles.length} legal invitation bodies.`);
