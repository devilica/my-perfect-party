import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const EXPENSES_WELCOME_TIP_TRANSLATIONS = {
  ar: 'تابع المصروفات وابقِ الميزانية تحت السيطرة',
  bg: 'Следи разходите и държи бюджета под контрол',
  bn: 'খরচ ট্র্যাক করুন এবং বাজেট নিয়ন্ত্রণে রাখুন',
  bs: 'Prati troškove i drži budžet pod kontrolom',
  cs: 'Sleduj výdaje a měj rozpočet pod kontrolou',
  da: 'Hold styr på udgifter og budgettet',
  de: 'Verfolge Ausgaben und behalte dein Budget im Griff',
  el: 'Παρακολούθησε τα έξοδα και κράτα τον προϋπολογισμό υπό έλεγχο',
  en: 'Track expenses and keep your budget under control',
  es: 'Controla los gastos y mantén el presupuesto bajo control',
  'es-mx': 'Controla los gastos y mantén el presupuesto bajo control',
  et: 'Jälgi kulusid ja hoia eelarve kontrolli all',
  fa: 'هزینه‌ها را پیگیری کن و بودجه را تحت کنترل نگه دار',
  fi: 'Seuraa kuluja ja pidä budjetti hallinnassa',
  fr: 'Suis tes dépenses et garde le budget sous contrôle',
  ga: 'Rianaigh costais agus coinnigh an buiséad faoi smacht',
  he: 'עקבו אחר ההוצאות ושמרו על התקציב בשליטה',
  hi: 'खर्चों पर नज़र रखें और बजट नियंत्रण में रखें',
  hr: 'Prati troškove i drži budžet pod kontrolom',
  hu: 'Kövesd a kiadásokat és tartsd kordában a költségvetést',
  id: 'Pantau pengeluaran dan jaga anggaran tetap terkendali',
  it: 'Tieni traccia delle spese e mantieni il budget sotto controllo',
  ja: '支出を記録して、予算をしっかり管理しましょう',
  ko: '지출을 기록하고 예산을 잘 관리하세요',
  lt: 'Sek išlaidas ir valdyk biudžetą',
  lv: 'Seko izdevumiem un kontrolē budžetu',
  mk: 'Следи ги трошоците и држи го буџетот под контрола',
  ms: 'Jejaki perbelanjaan dan kawal bajet anda',
  mt: 'Segwi l-ispejjeż u żomm il-baġit taħt kontroll',
  nl: 'Houd uitgaven bij en beheer je budget',
  pl: 'Śledź wydatki i trzymaj budżet pod kontrolą',
  pt: 'Acompanha despesas e mantém o orçamento sob controlo',
  'pt-br': 'Acompanhe despesas e mantenha o orçamento sob controle',
  ro: 'Urmărește cheltuielile și ține bugetul sub control',
  ru: 'Отслеживай расходы и держи бюджет под контролем',
  sk: 'Sleduj výdavky a maj rozpočet pod kontrolou',
  sl: 'Spremljaj stroške in imej proračun pod nadzorom',
  sq: 'Ndiq shpenzimet dhe mbaj buxhetin nën kontroll',
  sr: 'Prati troškove i drži budžet pod kontrolom',
  'sr-cy': 'Прати troškove i drži budžet pod kontrolom',
  sv: 'Följ utgifter och håll budgeten under kontroll',
  th: 'ติดตามค่าใช้จ่ายและควบคุมงบประมาณให้ดี',
  tr: 'Harcamaları takip et ve bütçeyi kontrol altında tut',
  uk: 'Відстежуй витрати та тримай бюджет під контролем',
  vi: 'Theo dõi chi phí và kiểm soát ngân sách',
  zh: '记录开支，轻松掌控预算',
};

let updated = 0;

for (const [locale, welcomeTip] of Object.entries(EXPENSES_WELCOME_TIP_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.expenses.welcomeTip = welcomeTip;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${updated} locale files.`);
