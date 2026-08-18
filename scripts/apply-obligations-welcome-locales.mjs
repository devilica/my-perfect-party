import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const OBLIGATIONS_WELCOME_TIP_TRANSLATIONS = {
  ar: 'تابع المهام وابقَ منظمًا',
  bg: 'Следи задачите и остани организиран',
  bn: 'কাজগুলো ট্র্যাক করুন এবং সংগঠিত থাকুন',
  bs: 'Prati obaveze i ostani organizovan',
  cs: 'Sleduj úkoly a zůstaň organizovaný',
  da: 'Hold styr på opgaverne og forbliv organiseret',
  de: 'Verfolge Aufgaben und bleib organisiert',
  el: 'Παρακολούθησε τις εργασίες και μείνε οργανωμένος',
  en: 'Track tasks and stay organized',
  es: 'Controla las tareas y mantente organizado',
  'es-mx': 'Controla las tareas y mantente organizado',
  et: 'Jälgi ülesandeid ja püsi organiseerituna',
  fa: 'وظایف را پیگیری کن و منظم بمان',
  fi: 'Seuraa tehtäviä ja pysy organisoituna',
  fr: 'Suis tes tâches et reste organisé',
  ga: 'Rianaigh tascanna agus fan eagraithe',
  he: 'עקבו אחר המשימות והישארו מאורגנים',
  hi: 'कार्यों पर नज़र रखें और व्यवस्थित रहें',
  hr: 'Prati obaveze i ostani organiziran',
  hu: 'Kövesd a feladatokat és maradj szervezett',
  id: 'Pantau tugas dan tetap terorganisir',
  it: 'Tieni traccia delle attività e resta organizzato',
  ja: 'タスクを管理して、計画的に進めましょう',
  ko: '할 일을 관리하고 체계적으로 준비하세요',
  lt: 'Sek užduotis ir lik organizuotas',
  lv: 'Seko uzdevumiem un paliec organizēts',
  mk: 'Следи ги задачите и остани организиран',
  ms: 'Jejaki tugasan dan kekal teratur',
  mt: 'Segwi t-tasks u żomm l-organizzat',
  nl: 'Houd taken bij en blijf georganiseerd',
  pl: 'Śledź zadania i bądź zorganizowany',
  pt: 'Acompanha tarefas e mantém-te organizado',
  'pt-br': 'Acompanhe tarefas e mantenha-se organizado',
  ro: 'Urmărește sarcinile și rămâi organizat',
  ru: 'Отслеживай задачи и оставайся организованным',
  sk: 'Sleduj úlohy a zostaň organizovaný',
  sl: 'Spremljaj naloge in ostani organiziran',
  sq: 'Ndiq detyrat dhe mbetu i organizuar',
  sr: 'Prati obaveze i ostani organizovan',
  'sr-cy': 'Прати обaveze и остани организован',
  sv: 'Följ uppgifter och håll dig organiserad',
  th: 'ติดตามงานและจัดระเบียบให้ดี',
  tr: 'Görevleri takip et ve düzenli kal',
  uk: 'Відстежуй завдання та залишайся організованим',
  vi: 'Theo dõi công việc và giữ mọi thứ có tổ chức',
  zh: '跟踪任务，轻松保持条理',
};

let updated = 0;

for (const [locale, welcomeTip] of Object.entries(OBLIGATIONS_WELCOME_TIP_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.obligations.welcomeTip = welcomeTip;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${updated} locale files.`);
