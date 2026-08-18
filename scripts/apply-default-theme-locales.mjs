import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const LABELS = {
  ar: 'افتراضي',
  bg: 'По подразбиране',
  bn: 'ডিফল্ট',
  bs: 'Zadano',
  cs: 'Výchozí',
  da: 'Standard',
  de: 'Standard',
  el: 'Προεπιλογή',
  en: 'Default',
  es: 'Predeterminado',
  'es-mx': 'Predeterminado',
  et: 'Vaikimisi',
  fa: 'پیش‌فرض',
  fi: 'Oletus',
  fr: 'Par défaut',
  ga: 'Réamhshocrú',
  he: 'ברירת מחדל',
  hi: 'डिफ़ॉल्ट',
  hr: 'Zadano',
  hu: 'Alapértelmezett',
  id: 'Default',
  it: 'Predefinito',
  ja: 'デフォルト',
  ko: '기본',
  lt: 'Numatytasis',
  lv: 'Noklusējums',
  mk: 'Стандардно',
  ms: 'Lalai',
  mt: 'Default',
  nl: 'Standaard',
  pl: 'Domyślny',
  pt: 'Predefinido',
  'pt-br': 'Padrão',
  ro: 'Implicit',
  ru: 'По умолчанию',
  sk: 'Predvolené',
  sl: 'Privzeto',
  sq: 'Parazgjedhur',
  sr: 'Podrazumevano',
  'sr-cy': 'Подразумевано',
  sv: 'Standard',
  th: 'ค่าเริ่มต้น',
  tr: 'Varsayılan',
  uk: 'За замовчуванням',
  vi: 'Mặc định',
  zh: '默认',
};

let updated = 0;
for (const [locale, label] of Object.entries(LABELS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.events = data.events ?? {};
  data.events.themes = { default: label, ...data.events.themes };
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${updated} locale files.`);
