/**
 * Replace wedding-only empty states / placeholders with celebration/party wording.
 * Does not change theme keys (events.themes.wedding) or invitation template names.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** @type {Record<string, {
 *   eventsEmptySubtitle: string;
 *   eventsNamePlaceholder: string;
 *   expensesEmptySubtitle: string;
 *   expensesTitlePlaceholder: string;
 *   eventsGuestSidePlaceholder?: string;
 *   guestsCustomSidePlaceholder?: string;
 * }>} */
const COPY = {
  en: {
    eventsEmptySubtitle: 'Add your first event and start planning your celebration.',
    eventsNamePlaceholder: "e.g. Ana & Marko's party",
    expensesEmptySubtitle: 'Add expenses and track your event budget.',
    expensesTitlePlaceholder: 'e.g. Live band',
    eventsGuestSidePlaceholder: 'e.g. Family side, Friends side',
    guestsCustomSidePlaceholder: 'e.g. Family side',
  },
  bs: {
    eventsEmptySubtitle: 'Dodaj prvi događaj i počni planirati tvoju proslavu.',
    eventsNamePlaceholder: 'npr. Proslava Ana & Marko',
    expensesEmptySubtitle: 'Dodaj troškove i prati budžet proslave.',
    expensesTitlePlaceholder: 'npr. Bend',
    eventsGuestSidePlaceholder: 'npr. Porodica, Prijatelji',
    guestsCustomSidePlaceholder: 'npr. Porodica',
  },
  hr: {
    eventsEmptySubtitle: 'Dodaj prvi događaj i počni planirati tvoju proslavu.',
    eventsNamePlaceholder: 'npr. Proslava Ana & Marko',
    expensesEmptySubtitle: 'Dodaj troškove i prati budžet proslave.',
    expensesTitlePlaceholder: 'npr. Bend',
    eventsGuestSidePlaceholder: 'npr. Obitelj, Prijatelji',
    guestsCustomSidePlaceholder: 'npr. Obitelj',
  },
  sr: {
    eventsEmptySubtitle: 'Dodaj prvi događaj i počni planirati tvoju proslavu.',
    eventsNamePlaceholder: 'npr. Proslava Ana & Marko',
    expensesEmptySubtitle: 'Dodaj troškove i prati budžet proslave.',
    expensesTitlePlaceholder: 'npr. Bend',
    eventsGuestSidePlaceholder: 'npr. Porodica, Prijatelji',
    guestsCustomSidePlaceholder: 'npr. Porodica',
  },
  'sr-cy': {
    eventsEmptySubtitle: 'Додај први догађај и почни планирати твоју прославу.',
    eventsNamePlaceholder: 'нпр. Прослава Ана & Марко',
    expensesEmptySubtitle: 'Додај трошкове и прати буџет прославе.',
    expensesTitlePlaceholder: 'нпр. Bend',
    eventsGuestSidePlaceholder: 'нпр. Породица, Пријатељи',
    guestsCustomSidePlaceholder: 'нпр. Porodica',
  },
  de: {
    eventsEmptySubtitle:
      'Fügen Sie Ihre erste Veranstaltung hinzu und beginnen Sie mit der Planung Ihrer Feier.',
    eventsNamePlaceholder: 'z. B. Ana & Markos Party',
    expensesEmptySubtitle: 'Fügen Sie Ausgaben hinzu und verfolgen Sie Ihr Veranstaltungsbudget.',
    expensesTitlePlaceholder: 'z. B. Live-Band',
    eventsGuestSidePlaceholder: 'z. B. Familie, Freunde',
    guestsCustomSidePlaceholder: 'z. B. Familienseite',
  },
  fr: {
    eventsEmptySubtitle: 'Ajoutez votre premier événement et commencez à planifier votre fête.',
    eventsNamePlaceholder: 'ex. Fête Ana & Marko',
    expensesEmptySubtitle: 'Ajoutez des dépenses et suivez le budget de votre événement.',
    expensesTitlePlaceholder: 'ex. Groupe live',
    eventsGuestSidePlaceholder: 'ex. Famille, Amis',
    guestsCustomSidePlaceholder: 'ex. Côté famille',
  },
  es: {
    eventsEmptySubtitle: 'Añade tu primer evento y empieza a planificar tu celebración.',
    eventsNamePlaceholder: 'p. ej. Fiesta Ana y Marko',
    expensesEmptySubtitle: 'Añade gastos y controla el presupuesto del evento.',
    expensesTitlePlaceholder: 'p. ej. Grupo musical',
    eventsGuestSidePlaceholder: 'p. ej. Familia, Amigos',
    guestsCustomSidePlaceholder: 'p. ej. Familia',
  },
  'es-mx': {
    eventsEmptySubtitle: 'Agrega tu primer evento y empieza a planificar tu celebración.',
    eventsNamePlaceholder: 'p. ej. Fiesta Ana y Marko',
    expensesEmptySubtitle: 'Agrega gastos y controla el presupuesto del evento.',
    expensesTitlePlaceholder: 'p. ej. Grupo musical',
    eventsGuestSidePlaceholder: 'p. ej. Familia, Amigos',
    guestsCustomSidePlaceholder: 'p. ej. Familia',
  },
  it: {
    eventsEmptySubtitle: 'Aggiungi il tuo primo evento e inizia a pianificare la festa.',
    eventsNamePlaceholder: 'es. Festa Ana e Marko',
    expensesEmptySubtitle: 'Aggiungi spese e monitora il budget dell’evento.',
    expensesTitlePlaceholder: 'es. Gruppo musicale',
    eventsGuestSidePlaceholder: 'es. Famiglia, Amici',
    guestsCustomSidePlaceholder: 'es. Lato famiglia',
  },
  pt: {
    eventsEmptySubtitle: 'Adicione o seu primeiro evento e comece a planear a festa.',
    eventsNamePlaceholder: 'p. ex. Festa Ana e Marko',
    expensesEmptySubtitle: 'Adicione despesas e acompanhe o orçamento do evento.',
    expensesTitlePlaceholder: 'p. ex. Grupo musical',
    eventsGuestSidePlaceholder: 'p. ex. Família, Amigos',
    guestsCustomSidePlaceholder: 'p. ex. Família',
  },
  'pt-br': {
    eventsEmptySubtitle: 'Adicione seu primeiro evento e comece a planejar sua festa.',
    eventsNamePlaceholder: 'p. ex. Festa Ana e Marko',
    expensesEmptySubtitle: 'Adicione despesas e acompanhe o orçamento do evento.',
    expensesTitlePlaceholder: 'p. ex. Banda ao vivo',
    eventsGuestSidePlaceholder: 'p. ex. Família, Amigos',
    guestsCustomSidePlaceholder: 'p. ex. Família',
  },
  nl: {
    eventsEmptySubtitle: 'Voeg je eerste evenement toe en begin met het plannen van je feest.',
    eventsNamePlaceholder: 'bijv. Feest Anna & Marko',
    expensesEmptySubtitle: 'Voeg uitgaven toe en houd je evenementbudget bij.',
    expensesTitlePlaceholder: 'bijv. Live band',
    eventsGuestSidePlaceholder: 'bijv. Familie, Vrienden',
    guestsCustomSidePlaceholder: 'bijv. Familiezijde',
  },
  pl: {
    eventsEmptySubtitle: 'Dodaj pierwsze wydarzenie i zacznij planować swoją imprezę.',
    eventsNamePlaceholder: 'np. Impreza Ani i Marka',
    expensesEmptySubtitle: 'Dodawaj wydatki i śledź budżet imprezy.',
    expensesTitlePlaceholder: 'np. Zespół muzyczny',
    eventsGuestSidePlaceholder: 'np. Rodzina, Przyjaciele',
    guestsCustomSidePlaceholder: 'np. Strona rodziny',
  },
  cs: {
    eventsEmptySubtitle: 'Přidejte první událost a začněte plánovat svou oslavu.',
    eventsNamePlaceholder: 'např. Oslava Ana a Marko',
    expensesEmptySubtitle: 'Přidejte výdaje a sledujte rozpočet akce.',
    expensesTitlePlaceholder: 'např. Kapela',
    eventsGuestSidePlaceholder: 'např. Rodina, Přátelé',
    guestsCustomSidePlaceholder: 'např. Rodina',
  },
  sk: {
    eventsEmptySubtitle: 'Pridajte prvú udalosť a začnite plánovať svoju oslavu.',
    eventsNamePlaceholder: 'napr. Oslava Ana a Marko',
    expensesEmptySubtitle: 'Pridajte výdavky a sledujte rozpočet podujatia.',
    expensesTitlePlaceholder: 'napr. Kapela',
    eventsGuestSidePlaceholder: 'napr. Rodina, Priatelia',
    guestsCustomSidePlaceholder: 'napr. Rodina',
  },
  sl: {
    eventsEmptySubtitle: 'Dodajte prvi dogodek in začnite načrtovati proslavo.',
    eventsNamePlaceholder: 'npr. Proslava Ana in Marko',
    expensesEmptySubtitle: 'Dodajte stroške in spremljajte proračun dogodka.',
    expensesTitlePlaceholder: 'npr. Glasbena skupina',
    eventsGuestSidePlaceholder: 'npr. Družina, Prijatelji',
    guestsCustomSidePlaceholder: 'npr. Družina',
  },
  hu: {
    eventsEmptySubtitle: 'Add hozzá az első eseményt, és kezdd el tervezni az ünnepséget.',
    eventsNamePlaceholder: 'pl. Ana és Marko bulija',
    expensesEmptySubtitle: 'Add hozzá a kiadásokat, és kövesd az esemény költségvetését.',
    expensesTitlePlaceholder: 'pl. Zenekar',
    eventsGuestSidePlaceholder: 'pl. Család, Barátok',
    guestsCustomSidePlaceholder: 'pl. Család oldala',
  },
  ro: {
    eventsEmptySubtitle: 'Adaugă primul eveniment și începe să planifici petrecerea.',
    eventsNamePlaceholder: 'ex. Petrecerea Ana & Marko',
    expensesEmptySubtitle: 'Adaugă cheltuieli și urmărește bugetul evenimentului.',
    expensesTitlePlaceholder: 'ex. Formație',
    eventsGuestSidePlaceholder: 'ex. Familie, Prieteni',
    guestsCustomSidePlaceholder: 'ex. Familie',
  },
  bg: {
    eventsEmptySubtitle: 'Добавете първото си събитие и започнете да планирате празненството.',
    eventsNamePlaceholder: 'напр. Празненство Ана и Марко',
    expensesEmptySubtitle: 'Добавете разходи и следете бюджета на събитието.',
    expensesTitlePlaceholder: 'напр. Музикална група',
    eventsGuestSidePlaceholder: 'напр. Семейство, Приятели',
    guestsCustomSidePlaceholder: 'напр. Семейство',
  },
  mk: {
    eventsEmptySubtitle: 'Додадете го првиот настан и започнете да ја планирате proslavata.',
    eventsNamePlaceholder: 'напр. Proslava Ana & Marko',
    expensesEmptySubtitle: 'Додадете трошоци и следете го budžetot na nastanot.',
    expensesTitlePlaceholder: 'напр. Bend',
    eventsGuestSidePlaceholder: 'напр. Porodica, Prijatelji',
    guestsCustomSidePlaceholder: 'напр. Porodica',
  },
  sq: {
    eventsEmptySubtitle: 'Shto ngjarjen të parë dhe fillo të planifikosh festën.',
    eventsNamePlaceholder: 'p.sh. Festa Ana & Marko',
    expensesEmptySubtitle: 'Shto shpenzime dhe ndiq buxhetin e ngjarjes.',
    expensesTitlePlaceholder: 'p.sh. Grup muzikor',
    eventsGuestSidePlaceholder: 'p.sh. Familje, Miq',
    guestsCustomSidePlaceholder: 'p.sh. Familja',
  },
  ru: {
    eventsEmptySubtitle: 'Добавьте первое событие и начните планировать праздник.',
    eventsNamePlaceholder: 'напр. Праздник Ana & Marko',
    expensesEmptySubtitle: 'Добавьте расходы и отслеживайте бюджет мероприятия.',
    expensesTitlePlaceholder: 'напр. Живая группа',
    eventsGuestSidePlaceholder: 'напр. Семья, Друзья',
    guestsCustomSidePlaceholder: 'напр. Семья',
  },
  uk: {
    eventsEmptySubtitle: 'Додайте першу подію та почніть планувати святкування.',
    eventsNamePlaceholder: 'напр. Святкування Ana & Marko',
    expensesEmptySubtitle: 'Додайте витрати та відстежуйте бюджет події.',
    expensesTitlePlaceholder: 'напр. Живий гурт',
    eventsGuestSidePlaceholder: 'напр. Родина, Друзі',
    guestsCustomSidePlaceholder: 'напр. Родина',
  },
  el: {
    eventsEmptySubtitle: 'Προσθέστε την πρώτη εκδήλωση και ξεκινήστε να οργανώνετε τη γιορτή.',
    eventsNamePlaceholder: 'π.χ. Γιορτή Αννα & Μάρκο',
    expensesEmptySubtitle: 'Προσθέστε έξοδα και παρακολουθήστε τον προϋπολογισμό της εκδήλωσης.',
    expensesTitlePlaceholder: 'π.χ. Ζωντανή μπάντα',
    eventsGuestSidePlaceholder: 'π.χ. Οικογένεια, Φίλοι',
    guestsCustomSidePlaceholder: 'π.χ. Οικογένεια',
  },
  tr: {
    eventsEmptySubtitle: 'İlk etkinliğinizi ekleyin ve kutlamanızı planlamaya başlayın.',
    eventsNamePlaceholder: 'örn. Ana & Marko partisi',
    expensesEmptySubtitle: 'Gider ekleyin ve etkinlik bütçenizi takip edin.',
    expensesTitlePlaceholder: 'örn. Canlı grup',
    eventsGuestSidePlaceholder: 'örn. Aile, Arkadaşlar',
    guestsCustomSidePlaceholder: 'örn. Aile tarafı',
  },
  ar: {
    eventsEmptySubtitle: 'أضف أول فعالية وابدأ التخطيط لاحتفالك.',
    eventsNamePlaceholder: 'مثال: حفلة Ana & Marko',
    expensesEmptySubtitle: 'أضف المصروفات وتتبع ميزانية الفعالية.',
    expensesTitlePlaceholder: 'مثال: فرقة موسيقية',
    eventsGuestSidePlaceholder: 'مثال: العائلة، الأصدقاء',
    guestsCustomSidePlaceholder: 'مثال: جانب العائلة',
  },
  fa: {
    eventsEmptySubtitle: 'اولین رویداد خود را اضافه کنید و برنامه‌ریزی جشن را شروع کنید.',
    eventsNamePlaceholder: 'مثال: جشن Ana & Marko',
    expensesEmptySubtitle: 'هزینه اضافه کنید و بودجه رویداد را پیگیری کنید.',
    expensesTitlePlaceholder: 'مثال: گروه موسیقی',
    eventsGuestSidePlaceholder: 'مثال: خانواده، دوستان',
    guestsCustomSidePlaceholder: 'مثال: خانواده',
  },
  he: {
    eventsEmptySubtitle: 'הוסיפו את האירוע הראשון והתחילו לתכנן את החגיגה.',
    eventsNamePlaceholder: 'לדוגמה: מסיבת Ana & Marko',
    expensesEmptySubtitle: 'הוסיפו הוצאות ועקבו אחר תקציב האירוע.',
    expensesTitlePlaceholder: 'לדוגמה: להקה חיה',
    eventsGuestSidePlaceholder: 'לדוגמה: משפחה, חברים',
    guestsCustomSidePlaceholder: 'לדוגמה: צד המשפחה',
  },
  hi: {
    eventsEmptySubtitle: 'अपना पहला इवेंट जोड़ें और अपनी पार्टी की योजना बनाना शुरू करें।',
    eventsNamePlaceholder: 'उदा. Ana & Marko की पार्टी',
    expensesEmptySubtitle: 'खर्च जोड़ें और इवेंट बजट पर नज़र रखें।',
    expensesTitlePlaceholder: 'उदा. लाइव बैंड',
    eventsGuestSidePlaceholder: 'उदा. परिवार, दोस्त',
    guestsCustomSidePlaceholder: 'उदा. परिवार',
  },
  bn: {
    eventsEmptySubtitle: 'আপনার প্রথম ইভেন্ট যোগ করুন এবং উদযাপন পরিকল্পনা শুরু করুন।',
    eventsNamePlaceholder: 'যেমন Ana & Marko-র পার্টি',
    expensesEmptySubtitle: 'খরচ যোগ করুন এবং ইভেন্ট বাজেট ট্র্যাক করুন।',
    expensesTitlePlaceholder: 'যেমন লাইভ ব্যান্ড',
    eventsGuestSidePlaceholder: 'যেমন পরিবার, বন্ধু',
    guestsCustomSidePlaceholder: 'যেমন পরিবার',
  },
  da: {
    eventsEmptySubtitle: 'Tilføj din første begivenhed og begynd at planlægge din fest.',
    eventsNamePlaceholder: 'f.eks. Ana & Markos fest',
    expensesEmptySubtitle: 'Tilføj udgifter og følg dit begivenhedsbudget.',
    expensesTitlePlaceholder: 'f.eks. Liveband',
    eventsGuestSidePlaceholder: 'f.eks. Familie, Venner',
    guestsCustomSidePlaceholder: 'f.eks. Familieside',
  },
  sv: {
    eventsEmptySubtitle: 'Lägg till ditt första evenemang och börja planera ditt firande.',
    eventsNamePlaceholder: 't.ex. Ana & Markos fest',
    expensesEmptySubtitle: 'Lägg till utgifter och följ evenemangets budget.',
    expensesTitlePlaceholder: 't.ex. Liveband',
    eventsGuestSidePlaceholder: 't.ex. Familj, Vänner',
    guestsCustomSidePlaceholder: 't.ex. Familjesida',
  },
  fi: {
    eventsEmptySubtitle: 'Lisää ensimmäinen tapahtumasi ja aloita juhlan suunnittelu.',
    eventsNamePlaceholder: 'esim. Anan ja Markon juhlat',
    expensesEmptySubtitle: 'Lisää kuluja ja seuraa tapahtuman budjettia.',
    expensesTitlePlaceholder: 'esim. Livebändi',
    eventsGuestSidePlaceholder: 'esim. Perhe, Ystävät',
    guestsCustomSidePlaceholder: 'esim. Perhe',
  },
  et: {
    eventsEmptySubtitle: 'Lisa esimene sündmus ja alusta peo planeerimist.',
    eventsNamePlaceholder: 'nt Ana ja Marko pidu',
    expensesEmptySubtitle: 'Lisa kulud ja jälgi sündmuse eelarvet.',
    expensesTitlePlaceholder: 'nt Bänd',
    eventsGuestSidePlaceholder: 'nt Pere, Sõbrad',
    guestsCustomSidePlaceholder: 'nt Pere',
  },
  lt: {
    eventsEmptySubtitle: 'Pridėkite pirmą renginį ir pradėkite planuoti šventę.',
    eventsNamePlaceholder: 'pvz. Ana ir Marko šventė',
    expensesEmptySubtitle: 'Pridėkite išlaidas ir stebėkite renginio biudžetą.',
    expensesTitlePlaceholder: 'pvz. Gyvo garso grupė',
    eventsGuestSidePlaceholder: 'pvz. Šeima, Draugai',
    guestsCustomSidePlaceholder: 'pvz. Šeima',
  },
  lv: {
    eventsEmptySubtitle: 'Pievienojiet pirmo pasākumu un sāciet plānot svinības.',
    eventsNamePlaceholder: 'piem. Ana un Marko svinības',
    expensesEmptySubtitle: 'Pievienojiet izdevumus un sekojiet pasākuma budžetam.',
    expensesTitlePlaceholder: 'piem. Mūzikas grupa',
    eventsGuestSidePlaceholder: 'piem. Ģimene, Draugi',
    guestsCustomSidePlaceholder: 'piem. Ģimene',
  },
  ga: {
    eventsEmptySubtitle: 'Cuir do chéad imeacht leis agus cuir tús le pleanáil do cheiliúrtha.',
    eventsNamePlaceholder: 'm.sh. Cóisir Ana & Marko',
    expensesEmptySubtitle: 'Cuir costais leis agus coinnigh buiséad an imeachta faoi smacht.',
    expensesTitlePlaceholder: 'm.sh. Banna beo',
    eventsGuestSidePlaceholder: 'm.sh. Teaghlach, Cairde',
    guestsCustomSidePlaceholder: 'm.sh. Taobh teaghlaigh',
  },
  mt: {
    eventsEmptySubtitle: 'Żid l-ewwel avveniment u ibda pplanifica l-festa tiegħek.',
    eventsNamePlaceholder: 'eż. Festa Ana & Marko',
    expensesEmptySubtitle: 'Żid spejjeż u segwi l-baġit tal-avveniment.',
    expensesTitlePlaceholder: 'eż. Banda live',
    eventsGuestSidePlaceholder: 'eż. Familja, Ħbieb',
    guestsCustomSidePlaceholder: 'eż. Familja',
  },
  ja: {
    eventsEmptySubtitle: '最初のイベントを追加して、お祝いの準備を始めましょう。',
    eventsNamePlaceholder: '例：アナ＆マルコのパーティー',
    expensesEmptySubtitle: '支出を追加して、イベントの予算を管理しましょう。',
    expensesTitlePlaceholder: '例：ライブバンド',
    eventsGuestSidePlaceholder: '例：家族、友人',
    guestsCustomSidePlaceholder: '例：家族側',
  },
  ko: {
    eventsEmptySubtitle: '첫 이벤트를 추가하고 축하 파티 계획을 시작하세요.',
    eventsNamePlaceholder: '예: 아나 & 마르코 파티',
    expensesEmptySubtitle: '지출을 추가하고 이벤트 예산을 관리하세요.',
    expensesTitlePlaceholder: '예: 라이브 밴드',
    eventsGuestSidePlaceholder: '예: 가족, 친구',
    guestsCustomSidePlaceholder: '예: 가족',
  },
  zh: {
    eventsEmptySubtitle: '添加第一个活动，开始规划您的庆典。',
    eventsNamePlaceholder: '例如：安娜与马可的派对',
    expensesEmptySubtitle: '添加支出并跟踪活动预算。',
    expensesTitlePlaceholder: '例如：现场乐队',
    eventsGuestSidePlaceholder: '例如：家人、朋友',
    guestsCustomSidePlaceholder: '例如：家人',
  },
  vi: {
    eventsEmptySubtitle: 'Thêm sự kiện đầu tiên và bắt đầu lên kế hoạch cho buổi tiệc.',
    eventsNamePlaceholder: 'vd. Tiệc Ana & Marko',
    expensesEmptySubtitle: 'Thêm chi phí và theo dõi ngân sách sự kiện.',
    expensesTitlePlaceholder: 'vd. Ban nhạc',
    eventsGuestSidePlaceholder: 'vd. Gia đình, Bạn bè',
    guestsCustomSidePlaceholder: 'vd. Gia đình',
  },
  th: {
    eventsEmptySubtitle: 'เพิ่มงานแรกของคุณและเริ่มวางแผนงานฉลอง',
    eventsNamePlaceholder: 'เช่น งานปาร์ตี้ Ana & Marko',
    expensesEmptySubtitle: 'เพิ่มค่าใช้จ่ายและติดตามงบประมาณงาน',
    expensesTitlePlaceholder: 'เช่น วงดนตรี',
    eventsGuestSidePlaceholder: 'เช่น ครอบครัว เพื่อน',
    guestsCustomSidePlaceholder: 'เช่น ครอบครัว',
  },
  id: {
    eventsEmptySubtitle: 'Tambahkan acara pertama Anda dan mulai rencanakan pesta.',
    eventsNamePlaceholder: 'mis. Pesta Ana & Marko',
    expensesEmptySubtitle: 'Tambahkan pengeluaran dan pantau anggaran acara.',
    expensesTitlePlaceholder: 'mis. Band live',
    eventsGuestSidePlaceholder: 'mis. Keluarga, Teman',
    guestsCustomSidePlaceholder: 'mis. Keluarga',
  },
  ms: {
    eventsEmptySubtitle: 'Tambah acara pertama anda dan mula merancang sambutan.',
    eventsNamePlaceholder: 'cth. Parti Ana & Marko',
    expensesEmptySubtitle: 'Tambah perbelanjaan dan jejak bajet acara.',
    expensesTitlePlaceholder: 'cth. Kumpulan muzik',
    eventsGuestSidePlaceholder: 'cth. Keluarga, Rakan',
    guestsCustomSidePlaceholder: 'cth. Keluarga',
  },
};

for (const [locale, strings] of Object.entries(COPY)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip missing locale: ${locale}`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.events.emptySubtitle = strings.eventsEmptySubtitle;
  data.events.namePlaceholder = strings.eventsNamePlaceholder;
  data.expenses.emptySubtitle = strings.expensesEmptySubtitle;
  data.expenses.titlePlaceholder = strings.expensesTitlePlaceholder;

  if (strings.eventsGuestSidePlaceholder) {
    data.events.guestSidePlaceholder = strings.eventsGuestSidePlaceholder;
  }
  if (strings.guestsCustomSidePlaceholder && data.guests) {
    data.guests.customSidePlaceholder = strings.guestsCustomSidePlaceholder;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${Object.keys(COPY).length} locale files.`);
