import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** @type {Record<string, { title: string; body: string; appThemeHint?: string }>} */
const THEME_COPY = {
  en: {
    title: 'App and event themes',
    body: 'App and event themes can be changed freely. Rewarded ads are not required for themes.',
    appThemeHint: 'Colors for the home screen and settings.',
  },
  bs: {
    title: 'Teme aplikacije i događaja',
    body: 'Teme aplikacije i događaja možete mijenjati slobodno. Nagradne reklame se ne traže za teme.',
    appThemeHint: 'Boje početne stranice i postavki.',
  },
  hr: {
    title: 'Teme aplikacije i događaja',
    body: 'Teme aplikacije i događaja možete mijenjati slobodno. Nagradne reklame se ne traže za teme.',
    appThemeHint: 'Boje početnog zaslona i postavki.',
  },
  sr: {
    title: 'Teme aplikacije i događaja',
    body: 'Teme aplikacije i događaja možete menjati slobodno. Nagradne reklame se ne traže za teme.',
    appThemeHint: 'Boje početne stranice i podešavanja.',
  },
  'sr-cy': {
    title: 'Теме апликације и догађаја',
    body: 'Теме апликације и догађаја можете мењати слободно. Наградне рекламе се не траже за теме.',
    appThemeHint: 'Боје почетне странице и подешавања.',
  },
  de: {
    title: 'App- und Event-Themen',
    body: 'App- und Event-Themen können frei gewechselt werden. Belohnungsanzeigen sind für Themes nicht erforderlich.',
  },
  fr: {
    title: 'Thèmes de l’app et de l’événement',
    body: 'Les thèmes de l’app et de l’événement peuvent être changés librement. Les publicités récompensées ne sont pas requises pour les thèmes.',
  },
  es: {
    title: 'Temas de la app y del evento',
    body: 'Los temas de la app y del evento se pueden cambiar libremente. No se requieren anuncios recompensados para los temas.',
  },
  'es-mx': {
    title: 'Temas de la app y del evento',
    body: 'Los temas de la app y del evento se pueden cambiar libremente. No se requieren anuncios con recompensa para los temas.',
  },
  it: {
    title: 'Temi dell’app e dell’evento',
    body: 'I temi dell’app e dell’evento si possono cambiare liberamente. Gli annunci reward non sono richiesti per i temi.',
  },
  pt: {
    title: 'Temas da app e do evento',
    body: 'Os temas da app e do evento podem ser alterados livremente. Anúncios recompensados não são necessários para temas.',
  },
  'pt-br': {
    title: 'Temas do app e do evento',
    body: 'Os temas do app e do evento podem ser alterados livremente. Anúncios premiados não são necessários para temas.',
  },
  nl: {
    title: 'App- en evenementthema’s',
    body: 'App- en evenementthema’s kun je vrij wijzigen. Rewarded ads zijn niet nodig voor thema’s.',
  },
  pl: {
    title: 'Motywy aplikacji i wydarzenia',
    body: 'Motywy aplikacji i wydarzenia można zmieniać swobodnie. Reklamy z nagrodą nie są wymagane dla motywów.',
  },
  cs: {
    title: 'Motivy aplikace a události',
    body: 'Motivy aplikace a události lze měnit volně. Odměňované reklamy nejsou pro motivy vyžadovány.',
  },
  sk: {
    title: 'Motívy aplikácie a udalosti',
    body: 'Motívy aplikácie a udalosti môžete meniť voľne. Odmeňované reklamy nie sú pre motívy potrebné.',
  },
  sl: {
    title: 'Teme aplikacije in dogodka',
    body: 'Teme aplikacije in dogodka lahko spreminjate prosto. Nagradni oglasi za teme niso potrebni.',
  },
  hu: {
    title: 'Alkalmazás- és eseménytémák',
    body: 'Az alkalmazás- és eseménytémák szabadon változtathatók. A jutalomhirdetések nem szükségesek a témákhoz.',
  },
  ro: {
    title: 'Teme ale aplicației și evenimentului',
    body: 'Temele aplicației și evenimentului pot fi schimbate liber. Reclamele recompensate nu sunt necesare pentru teme.',
  },
  bg: {
    title: 'Теми на приложението и събитието',
    body: 'Темите на приложението и събитието могат да се сменят свободно. Награждаващи реклами не са нужни за теми.',
  },
  mk: {
    title: 'Теми на апликацијата и настанот',
    body: 'Темите на апликацијата и настанот можете да ги менувате слободно. Наградни реклами не се бараат за теми.',
  },
  sq: {
    title: 'Temat e aplikacionit dhe eventit',
    body: 'Temat e aplikacionit dhe eventit mund t’i ndryshoni lirisht. Reklamat e shpërblyera nuk kërkohen për temat.',
  },
  el: {
    title: 'Θέματα εφαρμογής και εκδήλωσης',
    body: 'Τα θέματα εφαρμογής και εκδήλωσης αλλάζουν ελεύθερα. Οι ανταμειβόμενες διαφημίσεις δεν απαιτούνται για θέματα.',
  },
  tr: {
    title: 'Uygulama ve etkinlik temaları',
    body: 'Uygulama ve etkinlik temaları serbestçe değiştirilebilir. Temalar için ödüllü reklam gerekmez.',
  },
  ru: {
    title: 'Темы приложения и события',
    body: 'Темы приложения и события можно менять свободно. Реклама с вознаграждением для тем не требуется.',
  },
  uk: {
    title: 'Теми додатку та події',
    body: 'Теми додатку та події можна змінювати вільно. Реклама з винагородою для тем не потрібна.',
  },
  ar: {
    title: 'سمات التطبيق والفعالية',
    body: 'يمكن تغيير سمات التطبيق والفعالية بحرية. لا تُطلب إعلانات بمكافأة للسمات.',
  },
  he: {
    title: 'ערכות נושא לאפליקציה ולאירוע',
    body: 'ניתן לשנות ערכות נושא של האפליקציה והאירוע בחופשיות. אין צורך בפרסומות מתגמלות עבור ערכות נושא.',
  },
  fa: {
    title: 'تم‌های برنامه و رویداد',
    body: 'تم‌های برنامه و رویداد را می‌توان آزادانه تغییر داد. تبلیغات پاداش‌دار برای تم‌ها لازم نیست.',
  },
  hi: {
    title: 'ऐप और इवेंट थीम',
    body: 'ऐप और इवेंट थीम स्वतंत्र रूप से बदली जा सकती हैं। थीम के लिए रिवॉर्ड विज्ञापन की ज़रूरत नहीं।',
  },
  bn: {
    title: 'অ্যাপ ও ইভেন্ট থিম',
    body: 'অ্যাপ ও ইভেন্ট থিম স্বাধীনভাবে বদলানো যায়। থিমের জন্য রিওয়ার্ড বিজ্ঞাপন লাগে না।',
  },
  ja: {
    title: 'アプリとイベントのテーマ',
    body: 'アプリとイベントのテーマは自由に変更できます。テーマにリワード広告は不要です。',
  },
  ko: {
    title: '앱 및 이벤트 테마',
    body: '앱과 이벤트 테마는 자유롭게 변경할 수 있습니다. 테마에는 리워드 광고가 필요하지 않습니다.',
  },
  zh: {
    title: '应用与活动主题',
    body: '可自由更换应用与活动主题。主题无需观看激励广告。',
  },
  id: {
    title: 'Tema aplikasi dan acara',
    body: 'Tema aplikasi dan acara dapat diganti bebas. Iklan reward tidak diperlukan untuk tema.',
  },
  ms: {
    title: 'Tema aplikasi dan acara',
    body: 'Tema aplikasi dan acara boleh ditukar dengan bebas. Iklan reward tidak diperlukan untuk tema.',
  },
  th: {
    title: 'ธีมแอปและงาน',
    body: 'เปลี่ยนธีมแอปและงานได้อย่างอิสระ ไม่ต้องดูโฆษณารางวัลสำหรับธีม',
  },
  vi: {
    title: 'Giao diện ứng dụng và sự kiện',
    body: 'Có thể đổi chủ đề ứng dụng và sự kiện tự do. Không cần quảng cáo thưởng cho chủ đề.',
  },
  da: {
    title: 'App- og begivenhedstemaer',
    body: 'App- og begivenhedstemaer kan skiftes frit. Belønningsannoncer kræves ikke for temaer.',
  },
  sv: {
    title: 'App- och eventteman',
    body: 'App- och eventteman kan bytas fritt. Belöningsannonser krävs inte för teman.',
  },
  fi: {
    title: 'Sovelluksen ja tapahtuman teemat',
    body: 'Sovelluksen ja tapahtuman teemoja voi vaihtaa vapaasti. Palkitsevia mainoksia ei tarvita teemoille.',
  },
  et: {
    title: 'Rakenduse ja sündmuse teemad',
    body: 'Rakenduse ja sündmuse teemasid saab vabalt vahetada. Preemiareklaame teemade jaoks ei nõuta.',
  },
  lv: {
    title: 'Lietotnes un pasākuma motīvi',
    body: 'Lietotnes un pasākuma motīvus var brīvi mainīt. Atlīdzības reklāmas motīviem nav nepieciešamas.',
  },
  lt: {
    title: 'Programos ir renginio temos',
    body: 'Programos ir renginio temas galima keisti laisvai. Apdovanojamosios reklamos temoms nereikalingos.',
  },
  mt: {
    title: 'Temi tal-app u tal-avveniment',
    body: 'It-temi tal-app u tal-avveniment jistgħu jinbidlu liberament. Reklami bi premi mhumiex meħtieġa għat-temi.',
  },
  ga: {
    title: 'Téamaí na haipe agus an ócáid',
    body: 'Is féidir téamaí na haipe agus an ócáid a athrú go saor. Ní theastaíonn fógraí luaíochta do théamaí.',
  },
};

const SETTINGS_BODY_REPLACEMENTS = [
  [
    /app theme \(may show a short ad when changing\), /gi,
    'app theme, ',
  ],
  [
    /tema aplikacije \(pri promjeni može prikazati kratku reklamu\), /gi,
    'tema aplikacije, ',
  ],
  [
    /tema aplikacije \(pri promeni može prikazati kratku reklamu\), /gi,
    'tema aplikacije, ',
  ],
  [
    /tema aplikacije \(pri spremembi se lahko prikaže kratka oglas\), /gi,
    'tema aplikacije, ',
  ],
  [
    /app theme \(jista' juri reklam qasir meta tbiddel\), /gi,
    'app theme, ',
  ],
  [
    /app-Thema \(beim Wechseln kann eine kurze Werbung erscheinen\), /gi,
    'App-Thema, ',
  ],
  [
    /thème de l’application \(peut afficher une courte publicité lors du changement\), /gi,
    'thème de l’application, ',
  ],
  [
    /tema de la app \(puede mostrar un anuncio breve al cambiar\), /gi,
    'tema de la app, ',
  ],
  [
    /tema dell’app \(può mostrare un breve annuncio al cambio\), /gi,
    'tema dell’app, ',
  ],
  [
    /app-thema \(kan een korte advertentie tonen bij wijzigen\), /gi,
    'app-thema, ',
  ],
  [
    /motyw aplikacji \(przy zmianie może pokazać krótką reklamę\), /gi,
    'motyw aplikacji, ',
  ],
  [
    /uygulama teması \(değiştirirken kısa reklam gösterilebilir\), /gi,
    'uygulama teması, ',
  ],
];

let updated = 0;

for (const file of fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'))) {
  const locale = file.replace(/\.json$/, '');
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const copy = THEME_COPY[locale] ?? THEME_COPY.en;

  if (!data.legal?.ads) continue;

  data.legal.ads.themeTitle = copy.title;
  data.legal.ads.themeBody = copy.body;

  if (copy.appThemeHint && data.settings) {
    data.settings.appThemeHint = copy.appThemeHint;
  }

  if (data.legal?.usage?.settingsBody) {
    let body = data.legal.usage.settingsBody;
    for (const [pattern, replacement] of SETTINGS_BODY_REPLACEMENTS) {
      body = body.replace(pattern, replacement);
    }
    data.legal.usage.settingsBody = body;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
}

console.log(`Updated theme ads copy in ${updated} locale files.`);
