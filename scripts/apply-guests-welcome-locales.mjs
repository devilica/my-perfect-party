import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const GUESTS_WELCOME_TIP_TRANSLATIONS = {
  ar: 'أضف الضيوف وتابع من سيحضر',
  bg: 'Добавяй гости и следи кой идва',
  bn: 'অতিথি যোগ করুন এবং কে আসছে তা ট্র্যাক করুন',
  bs: 'Dodaj goste i prati ko dolazi',
  cs: 'Přidávej hosty a sleduj, kdo přijde',
  da: 'Tilføj gæster og hold styr på hvem der kommer',
  de: 'Füge Gäste hinzu und verfolge, wer kommt',
  el: 'Πρόσθεσε καλεσμένους και παρακολούθησε ποιος έρχεται',
  en: "Add guests and track who's coming",
  es: 'Añade invitados y controla quién viene',
  'es-mx': 'Agrega invitados y controla quién viene',
  et: 'Lisa külalisi ja jälgi, kes tuleb',
  fa: 'مهمان اضافه کن و ببین چه کسی می‌آید',
  fi: 'Lisää vieraita ja seuraa, ketkä tulevat',
  fr: 'Ajoute des invités et suis qui vient',
  ga: 'Cuir aíonna leis agus rianaigh cé atá ag teacht',
  he: 'הוסיפו אורחים ועקבו מי מגיע',
  hi: 'मेहमान जोड़ें और देखें कौन आ रहा है',
  hr: 'Dodaj goste i prati tko dolazi',
  hu: 'Adj hozzá vendégeket és kövesd, ki jön',
  id: 'Tambahkan tamu dan pantau siapa yang datang',
  it: 'Aggiungi ospiti e tieni traccia di chi viene',
  ja: 'ゲストを追加して、来場状況を確認しましょう',
  ko: '게스트를 추가하고 참석 여부를 확인하세요',
  lt: 'Pridėk svečius ir stebėk, kas atvyksta',
  lv: 'Pievieno viesus un seko, kas ierodas',
  mk: 'Додавај гости и следи кој доаѓа',
  ms: 'Tambah tetamu dan jejak siapa yang hadir',
  mt: 'Żid mistiedna u segwi min ġej',
  nl: 'Voeg gasten toe en houd bij wie er komt',
  pl: 'Dodawaj gości i śledź, kto przychodzi',
  pt: 'Adiciona convidados e acompanha quem vem',
  'pt-br': 'Adicione convidados e acompanhe quem vem',
  ro: 'Adaugă invitați și urmărește cine vine',
  ru: 'Добавляй гостей и отслеживай, кто придёт',
  sk: 'Pridávaj hostí a sleduj, kto príde',
  sl: 'Dodajaj goste in spremljaj, kdo prihaja',
  sq: 'Shto mysafirë dhe ndiq kush vjen',
  sr: 'Dodaj goste i prati ko dolazi',
  'sr-cy': 'Додај госте и прати ко долazi',
  sv: 'Lägg till gäster och följ vem som kommer',
  th: 'เพิ่มแขกและติดตามว่าใครจะมา',
  tr: 'Misafir ekle ve kimin geleceğini takip et',
  uk: 'Додавай гостей і відстежуй, хто прийде',
  vi: 'Thêm khách mời và theo dõi ai sẽ đến',
  zh: '添加宾客，轻松掌握出席情况',
};

let updated = 0;

for (const [locale, welcomeTip] of Object.entries(GUESTS_WELCOME_TIP_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.guests.welcomeTip = welcomeTip;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${updated} locale files.`);
