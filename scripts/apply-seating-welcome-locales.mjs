import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const SEATING_WELCOME_TIP_TRANSLATIONS = {
  ar: 'رتّب ضيوفك بأفضل طريقة',
  bg: 'Подреди гостите си по най-добрия начин',
  bn: 'আপনার অতিথিদের সবচেয়ে ভালোভাবে বসান',
  bs: 'Rasporedi svoje goste na najbolji način',
  cs: 'Rozmístěte hosty co nejlépe',
  da: 'Placer dine gæster på den bedste måde',
  de: 'Ordne deine Gäste optimal an',
  el: 'Καθίστε τους καλεσμένους σας με τον καλύτερο τρόπο',
  en: 'Arrange your guests in the best way',
  es: 'Organiza a tus invitados de la mejor manera',
  'es-mx': 'Organiza a tus invitados de la mejor manera',
  et: 'Paiguta oma külalised parimal viisil',
  fa: 'مهمانان خود را به بهترین شکل بنشانید',
  fi: 'Järjestä vieraasi parhaalla tavalla',
  fr: 'Installez vos invités de la meilleure façon',
  ga: 'Socraigh do chuid aíonna ar an mbealach is fearr',
  he: 'סדרו את האורחים שלכם בצורה הטובה ביותר',
  hi: 'अपने मेहमानों को सबसे अच्छे तरीके से बैठाएँ',
  hr: 'Rasporedi svoje goste na najbolji način',
  hu: 'Ültesd el a vendégeidet a legjobb módon',
  id: 'Atur tamu Anda dengan cara terbaik',
  it: 'Disponi i tuoi ospiti nel modo migliore',
  ja: 'ゲストを最適な方法で席に配置しましょう',
  ko: '게스트를 가장 좋은 방식으로 배치하세요',
  lt: 'Išdėstykite svečius geriausiu būdu',
  lv: 'Izvieto savus viesus vislabākajā veidā',
  mk: 'Распoredете ги гостите на најдобар начин',
  ms: 'Susun tetamu anda dengan cara terbaik',
  mt: 'Arranġa l- mistiedna tiegħek bl-aħjar mod',
  nl: 'Plaats je gasten op de beste manier',
  pl: 'Rozsadź gości w najlepszy sposób',
  pt: 'Organiza os teus convidados da melhor forma',
  'pt-br': 'Organize seus convidados da melhor forma',
  ro: 'Aranjează-ți invitații în cel mai bun mod',
  ru: 'Рассадите гостей наилучшим образом',
  sk: 'Usporiadajte hostí čo najlepšie',
  sl: 'Razporedi goste na najboljši način',
  sq: 'Vendos mysafirët në mënyrën më të mirë',
  sr: 'Rasporedi svoje goste na najbolji način',
  'sr-cy': 'Распoredи своје госте на најбољи начин',
  sv: 'Placera dina gäster på bästa sätt',
  th: 'จัดที่นั่งแขกของคุณให้ดีที่สุด',
  tr: 'Misafirlerini en iyi şekilde yerleştir',
  uk: 'Розсадьте гостей найкращим чином',
  vi: 'Sắp xếp khách mời của bạn theo cách tốt nhất',
  zh: '以最佳方式安排您的宾客座位',
};

let updated = 0;

for (const [locale, welcomeTip] of Object.entries(SEATING_WELCOME_TIP_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.seating.welcomeTip = welcomeTip;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${updated} locale files.`);
