import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const TAP_HINT = {
  en: 'Tap a card to expand',
  bs: 'Dodirni karticu da proširiš',
  hr: 'Dodirni karticu da proširiš',
  sr: 'Dodirni karticu da proširiš',
  'sr-cy': 'Додирни картицу да прошириш',
  de: 'Tippe auf eine Karte zum Aufklappen',
  sl: 'Dotakni kartico za razširitev',
  mk: 'Допри картичка за проширување',
  fr: 'Touchez une carte pour développer',
  it: 'Tocca una scheda per espandere',
  es: 'Toca una tarjeta para expandir',
  'es-mx': 'Toca una tarjeta para expandir',
  pt: 'Toca num cartão para expandir',
  'pt-br': 'Toque em um cartão para expandir',
  pl: 'Dotknij kartę, aby rozwinąć',
  nl: 'Tik op een kaart om uit te klappen',
  cs: 'Klepni na kartu pro rozbalení',
  sk: 'Klepni na kartu pre rozbalenie',
  hu: 'Érintsd meg a kártyát a kinyitáshoz',
  ro: 'Atinge un card pentru a extinde',
  bg: 'Докосни карта, за да разшириш',
  el: 'Πάτα μια κάρτα για ανάπτυξη',
  uk: 'Торкнись картки, щоб розгорнути',
  ru: 'Нажмите на карточку, чтобы раскрыть',
  sq: 'Prek një kartë për ta zgjeruar',
  sv: 'Tryck på ett kort för att expandera',
  da: 'Tryk på et kort for at udvide',
  fi: 'Napauta korttia laajentaaksesi',
  et: 'Puuduta kaarti laiendamiseks',
  lv: 'Pieskaries kartei, lai izvērstu',
  lt: 'Paliesk kortelę, kad išskleistum',
  ga: 'Tapáil cárta chun leathnú',
  mt: 'Miss karta biex tespandi',
  tr: 'Genişletmek için bir karta dokun',
  ja: 'カードをタップして展開',
  ko: '카드를 눌러 펼치기',
  zh: '点按卡片展开',
  ar: 'انقر على بطاقة للتوسيع',
  he: 'הקש על כרטיס כדי להרחיב',
  fa: 'برای باز شدن روی کارت بزنید',
  hi: 'विस्तार के लिए कार्ड पर टैप करें',
  bn: 'প্রসারিত করতে কার্ডে ট্যাপ করুন',
  id: 'Ketuk kartu untuk memperluas',
  ms: 'Ketik kad untuk kembangkan',
  th: 'แตะการ์ดเพื่อขยาย',
  vi: 'Chạm thẻ để mở rộng',
};

let n = 0;
for (const file of fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'))) {
  const locale = file.replace(/\.json$/, '');
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!data.legal?.usage) continue;
  data.legal.usage.tapHint = TAP_HINT[locale] ?? TAP_HINT.en;
  // Keep intro a bit shorter if still the old long English-like wall — only touch if missing tapHint was the goal
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  n += 1;
}

console.log(`Added legal.usage.tapHint to ${n} locales.`);
