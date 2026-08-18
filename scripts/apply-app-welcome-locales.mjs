import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const APP_WELCOME_TRANSLATIONS = {
  ar: 'مرحبًا!',
  bg: 'Добре дошли!',
  bn: 'স্বাগতম!',
  bs: 'Dobrodošli!',
  cs: 'Vítejte!',
  da: 'Velkommen!',
  de: 'Willkommen!',
  el: 'Καλώς ήρθατε!',
  en: 'Welcome!',
  es: '¡Bienvenido!',
  'es-mx': '¡Bienvenido!',
  et: 'Tere tulemast!',
  fa: 'خوش آمدید!',
  fi: 'Tervetuloa!',
  fr: 'Bienvenue !',
  ga: 'Fáilte!',
  he: 'ברוכים הבאים!',
  hi: 'स्वागत है!',
  hr: 'Dobrodošli!',
  hu: 'Üdvözöljük!',
  id: 'Selamat datang!',
  it: 'Benvenuto!',
  ja: 'ようこそ！',
  ko: '환영합니다!',
  lt: 'Sveiki atvykę!',
  lv: 'Laipni lūdzam!',
  mk: 'Добредојдовте!',
  ms: 'Selamat datang!',
  mt: 'Merħba!',
  nl: 'Welkom!',
  pl: 'Witamy!',
  pt: 'Bem-vindo!',
  'pt-br': 'Bem-vindo!',
  ro: 'Bine ați venit!',
  ru: 'Добро пожаловать!',
  sk: 'Vitajte!',
  sl: 'Dobrodošli!',
  sq: 'Mirë se vini!',
  sr: 'Dobrodošli!',
  'sr-cy': 'Добродошли!',
  sv: 'Välkommen!',
  th: 'ยินดีต้อนรับ!',
  tr: 'Hoş geldiniz!',
  uk: 'Ласкаво просимо!',
  vi: 'Chào mừng!',
  zh: '欢迎！',
};

let updated = 0;

for (const [locale, welcome] of Object.entries(APP_WELCOME_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.app.welcome = welcome;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${updated} locale files.`);
