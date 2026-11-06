/**
 * Adds events.emptyHeroHeadline to all locale files.
 * Run: node scripts/patch-empty-hero-headline.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const HEADLINES = {
  en: 'Organize your celebration the easy way',
  bs: 'Organizuj proslavu na jednostavan način',
  hr: 'Organiziraj proslavu na jednostavan način',
  sr: 'Organizuj svoju proslavu na jednostavan način',
  'sr-cy': 'Организуј своју прославу на једноставан начин',
  de: 'Organisiere deine Feier ganz einfach',
  fr: 'Organisez votre fête en toute simplicité',
  es: 'Organiza tu celebración de forma sencilla',
  'es-mx': 'Organiza tu celebración de forma sencilla',
  it: 'Organizza la tua festa in modo semplice',
  pt: 'Organize a sua festa de forma simples',
  'pt-br': 'Organize sua festa de forma simples',
  nl: 'Plan je feest op een eenvoudige manier',
  pl: 'Zorganizuj swoją uroczystość w prosty sposób',
  ru: 'Организуйте праздник простым способом',
  uk: 'Організуйте святкування простим способом',
  tr: 'Kutlamanı kolayca planla',
  ar: 'نظّم احتفالك بطريقة سهلة',
  he: 'ארגנו את החגיגה בדרך הקלה',
  ja: 'かんたんにお祝いを計画',
  ko: '쉽게 축하 행사를 준비하세요',
  zh: '轻松规划你的庆典',
  hi: 'आसान तरीके से अपना जश्न व्यवस्थित करें',
  bn: 'সহজ উপায়ে আপনার অনুষ্ঠানের পরিকল্পনা করুন',
  vi: 'Tổ chức lễ kỷ niệm một cách đơn giản',
  th: 'วางแผนงานฉลองอย่างง่ายดาย',
  id: 'Atur perayaanmu dengan mudah',
  ms: 'Rancang perayaan anda dengan mudah',
  fa: 'جشن خود را به روشی ساده برنامه‌ریزی کنید',
  sq: 'Organizoni festën tuaj në mënyrë të thjeshtë',
  mk: 'Организирај ја прославата на едноставен начин',
  bg: 'Организирайте празника си по лесен начин',
  el: 'Οργανώστε την γιορτή σας με απλό τρόπο',
  ro: 'Organizează-ți petrecerea într-un mod simplu',
  hu: 'Szervezd meg az ünnepet egyszerűen',
  cs: 'Naplánujte oslavu jednoduše',
  sk: 'Naplánujte oslavu jednoducho',
  sl: 'Načrtuj proslavo na preprost način',
  da: 'Planlæg din fest på den nemme måde',
  sv: 'Planera ditt firande på ett enkelt sätt',
  fi: 'Järjestä juhlasi helposti',
  et: 'Korralda pidu lihtsal viisil',
  lt: 'Suplanuokite šventę paprastai',
  lv: 'Plānojiet svinības vienkārši',
  ga: 'Eagraigh do cheiliúradh ar bhealach simplí',
  mt: 'Organizza l-celebrazzjoni tiegħek b\'mod sempliċi',
};

const fallback = HEADLINES.en;

for (const file of fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'))) {
  const locale = file.replace(/\.json$/, '');
  const filePath = path.join(localesDir, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!json.events) continue;

  json.events.emptyHeroHeadline = HEADLINES[locale] ?? fallback;
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log('Patched events.emptyHeroHeadline in locales/*.json');
