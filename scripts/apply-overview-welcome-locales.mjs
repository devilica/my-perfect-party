import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const OVERVIEW_WELCOME_TIP_TRANSLATIONS = {
  ar: 'اطّلع على كل المعلومات المهمة في مكان واحد',
  bg: 'Виж всичко важно на едно място',
  bn: 'এক জায়গায় সব গুরুত্বপূর্ণ তথ্য দেখুন',
  bs: 'Pregledaj sve važne informacije na jednom mjestu',
  cs: 'Měj vše důležité přehledně na jednom místě',
  da: 'Se alt det vigtige samlet ét sted',
  de: 'Alle wichtigen Infos an einem Ort im Blick',
  el: 'Δες όλες τις σημαντικές πληροφορίες σε ένα μέρος',
  en: 'See everything important in one place',
  es: 'Consulta toda la información importante en un solo lugar',
  'es-mx': 'Consulta toda la información importante en un solo lugar',
  et: 'Vaata kogu olulist infot ühes kohas',
  fa: 'همه اطلاعات مهم را در یک جا ببین',
  fi: 'Näe kaikki tärkeä yhdessä paikassa',
  fr: 'Retrouve toutes les infos importantes au même endroit',
  ga: 'Féach ar gach eolas tábhachtach in aon áit amháin',
  he: 'ראו את כל המידע החשוב במקום אחד',
  hi: 'सभी ज़रूरी जानकारी एक ही जगह देखें',
  hr: 'Pregledaj sve važne informacije na jednom mjestu',
  hu: 'Minden fontos infó egy helyen',
  id: 'Lihat semua info penting di satu tempat',
  it: 'Vedi tutte le informazioni importanti in un unico posto',
  ja: '大切な情報をこの画面ですべて確認できます',
  ko: '중요한 정보를 한곳에서 확인하세요',
  lt: 'Visą svarbią informaciją matyk vienoje vietoje',
  lv: 'Skati visu svarīgo informāciju vienuviet',
  mk: 'Прегледај ги сите важни информации на едно место',
  ms: 'Lihat semua maklumat penting di satu tempat',
  mt: "Ara l-informazzjoni kollha importanti f'post wieħed",
  nl: 'Bekijk alle belangrijke info op één plek',
  pl: 'Zobacz wszystkie ważne informacje w jednym miejscu',
  pt: 'Vê toda a informação importante num só lugar',
  'pt-br': 'Veja todas as informações importantes em um só lugar',
  ro: 'Vezi toate informațiile importante într-un singur loc',
  ru: 'Смотри всю важную информацию в одном месте',
  sk: 'Maj všetko dôležité prehľadne na jednom mieste',
  sl: 'Preglej vse pomembne informacije na enem mestu',
  sq: 'Shiko të gjitha informacionet e rëndësishme në një vend',
  sr: 'Pregledaj sve važne informacije na jednom mestu',
  'sr-cy': 'Прегледај све важне информације на једном месту',
  sv: 'Se all viktig info på ett ställe',
  th: 'ดูข้อมูลสำคัญทั้งหมดในที่เดียว',
  tr: 'Tüm önemli bilgileri tek yerde gör',
  uk: 'Переглядай всю важливу інформацію в одному місці',
  vi: 'Xem mọi thông tin quan trọng ở một nơi',
  zh: '在此一览所有重要信息',
};

let updated = 0;

for (const [locale, welcomeTip] of Object.entries(OVERVIEW_WELCOME_TIP_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.overview.welcomeTip = welcomeTip;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${updated} locale files.`);
