import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const APP_TAGLINE_TRANSLATIONS = {
  bg: 'Празнувай без стрес',
  bs: 'Slavi bez stresa',
  cs: 'Oslavuj bez stresu',
  da: 'Fejr stressfrit',
  de: 'Feiern ohne Stress',
  el: 'Γιόρτασε χωρίς άγχος',
  es: 'Celebra sin estrés',
  et: 'Tähista stressivabalt',
  fi: 'Juhli stressittä',
  fr: 'Célébrez sans stress',
  ga: 'Ceiliúraigh gan strus',
  hr: 'Slavi bez stresa',
  hu: 'Ünnepelj stressz nélkül',
  it: 'Festeggia senza stress',
  lt: 'Švęsk be streso',
  lv: 'Svinē bez stresa',
  mk: 'Слави без стрес',
  mt: 'Iċċelebra mingħajr stress',
  nl: 'Vier stressvrij',
  pl: 'Świętuj bez stresu',
  pt: 'Celebre sem stress',
  ro: 'Sărbătorește fără stres',
  sk: 'Oslavuj bez stresu',
  sl: 'Slavite brez stresa',
  sq: 'Festo pa stres',
  'sr-cy': '\u0421\u043b\u0430\u0432\u0438 \u0431\u0435\u0437 \u0441\u0442\u0440\u0435\u0441\u0430',
  sv: 'Fira stressfritt',
  uk: 'Святкуй без стресу',
};

for (const [locale, tagline] of Object.entries(APP_TAGLINE_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.app.tagline = tagline;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${Object.keys(APP_TAGLINE_TRANSLATIONS).length} locale files.`);
