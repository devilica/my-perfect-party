import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** Common local first/last name examples for guest form placeholders. */
const NAME_PLACEHOLDERS = {
  bg: { first: 'напр. Мария', last: 'напр. Иванова' },
  bs: { first: 'npr. Ana', last: 'npr. Ivanović' },
  cs: { first: 'např. Eva', last: 'např. Nováková' },
  da: { first: 'f.eks. Anna', last: 'f.eks. Jensen' },
  de: { first: 'z. B. Anna', last: 'z. B. Müller' },
  el: { first: 'π.χ. Μαρία', last: 'π.χ. Παπαδοπούλου' },
  en: { first: 'e.g. Emma', last: 'e.g. Smith' },
  es: { first: 'p. ej. María', last: 'p. ej. García' },
  et: { first: 'nt Mari', last: 'nt Tamm' },
  fi: { first: 'esim. Anna', last: 'esim. Virtanen' },
  fr: { first: 'ex. Marie', last: 'ex. Dupont' },
  ga: { first: 'm.sh. Aoife', last: 'm.sh. Murphy' },
  hr: { first: 'npr. Ana', last: 'npr. Horvat' },
  hu: { first: 'pl. Anna', last: 'pl. Kovács' },
  it: { first: 'es. Giulia', last: 'es. Rossi' },
  lt: { first: 'pvz. Ona', last: 'pvz. Kazlauskaitė' },
  lv: { first: 'piem. Anna', last: 'piem. Bērziņa' },
  mk: { first: 'напр. Ана', last: 'напр. Јовановска' },
  mt: { first: 'eż. Maria', last: 'eż. Borg' },
  nl: { first: 'bijv. Anna', last: 'bijv. Jansen' },
  pl: { first: 'np. Anna', last: 'np. Kowalska' },
  pt: { first: 'p. ex. Maria', last: 'p. ex. Silva' },
  ro: { first: 'ex. Maria', last: 'ex. Popescu' },
  sk: { first: 'napr. Eva', last: 'napr. Nováková' },
  sl: { first: 'npr. Ana', last: 'npr. Novak' },
  sq: { first: 'p.sh. Ana', last: 'p.sh. Krasniqi' },
  sr: { first: 'npr. Ana', last: 'npr. Petrović' },
  'sr-cy': { first: 'нпр. Ана', last: 'нпр. Петровић' },
  sv: { first: 't.ex. Anna', last: 't.ex. Andersson' },
  uk: { first: 'напр. Олена', last: 'напр. Коваленко' },
};

let updated = 0;

for (const [locale, names] of Object.entries(NAME_PLACEHOLDERS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.guests.firstNamePlaceholder = names.first;
  data.guests.lastNamePlaceholder = names.last;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
}

console.log(`Updated first/last name placeholders in ${updated} locale files.`);
