/**
 * Sets events.emptyTitle to friendly "you don't have events yet" copy (home empty card).
 * Run: node scripts/patch-empty-events-title.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const TITLES = {
  en: "You don't have any events yet",
  bs: 'Još nemaš događaja',
  hr: 'Još nemaš događaja',
  sr: 'Još nemaš događaja',
  'sr-cy': 'Још немаш догађаја',
  de: 'Du hast noch keine Veranstaltungen',
  fr: "Vous n'avez pas encore d'événements",
  es: 'Aún no tienes eventos',
  'es-mx': 'Aún no tienes eventos',
  it: 'Non hai ancora eventi',
  pt: 'Ainda não tens eventos',
  'pt-br': 'Você ainda não tem eventos',
  nl: 'Je hebt nog geen evenementen',
  pl: 'Nie masz jeszcze wydarzeń',
  ru: 'У вас пока нет событий',
  uk: 'У вас ще немає подій',
  tr: 'Henüz etkinliğin yok',
  ar: 'ليس لديك أحداث بعد',
  he: 'עדיין אין לך אירועים',
  ja: 'まだイベントがありません',
  ko: '아직 이벤트가 없습니다',
  zh: '你还没有活动',
  hi: 'अभी तक कोई कार्यक्रम नहीं है',
  bn: 'এখনও কোনো ইভেন্ট নেই',
  vi: 'Bạn chưa có sự kiện nào',
  th: 'คุณยังไม่มีกิจกรรม',
  id: 'Kamu belum punya acara',
  ms: 'Anda belum ada acara',
  fa: 'هنوز رویدادی ندارید',
  sq: 'Ende nuk ke ngjarje',
  mk: 'Сè уште немаш настани',
  bg: 'Все още нямаш събития',
  el: 'Δεν έχεις ακόμα εκδηλώσεις',
  ro: 'Încă nu ai evenimente',
  hu: 'Még nincsenek eseményeid',
  cs: 'Zatím nemáš žádné události',
  sk: 'Zatiaľ nemáš žiadne udalosti',
  sl: 'Še nimaš dogodkov',
  da: 'Du har ingen begivenheder endnu',
  sv: 'Du har inga evenemang än',
  fi: 'Sinulla ei ole vielä tapahtumia',
  et: 'Sul pole veel sündmusi',
  lt: 'Dar neturi renginių',
  lv: 'Tev vēl nav notikumu',
  ga: 'Níl aon imeacht agat fós',
  mt: 'Għadek m\'għandekx avvenimenti',
};

const fallback = TITLES.en;

for (const file of fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'))) {
  const locale = file.replace(/\.json$/, '');
  const filePath = path.join(localesDir, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!json.events) continue;

  json.events.emptyTitle = TITLES[locale] ?? fallback;
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log('Patched events.emptyTitle in locales/*.json');
