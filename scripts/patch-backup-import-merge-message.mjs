/**
 * Sets settings.backupImportConfirmMessage for merge import (add events, rename duplicates).
 * Run: node scripts/patch-backup-import-merge-message.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** Per-locale merge import confirm body. English used when locale file missing here. */
const MESSAGES = {
  en: 'Events from the backup will be added to your existing data. If an event has the same name as one you already have, the imported event will be renamed (1), (2), and so on.',
  bs: 'Događaji iz sigurnosne kopije bit će dodani uz postojeće podatke. Ako događaj ima isti naziv kao postojeći, uvezeni događaj će dobiti naziv sa (1), (2) i sl.',
  hr: 'Događaji iz sigurnosne kopije bit će dodani uz postojeće podatke. Ako događaj ima isti naziv kao postojeći, uvezeni događaj dobit će naziv s (1), (2) itd.',
  sr: 'Događaji iz rezervne kopije biće dodati uz postojeće podatke. Ako događaj ima isti naziv kao postojeći, uvezeni događaj će dobiti naziv sa (1), (2) i sl.',
  'sr-cy': 'Догађаји из резервне копије биће додати уз постојеће податке. Ако догађај има исти назив као постојећи, увезени догађај ће добити назив са (1), (2) и сл.',
  de: 'Ereignisse aus dem Backup werden zu Ihren bestehenden Daten hinzugefügt. Bei gleichem Namen wird das importierte Ereignis umbenannt (1), (2) usw.',
  fr: 'Les événements de la sauvegarde seront ajoutés à vos données existantes. En cas de même nom, l’événement importé sera renommé (1), (2), etc.',
  es: 'Los eventos de la copia de seguridad se añadirán a tus datos existentes. Si un evento tiene el mismo nombre, el importado se renombrará (1), (2), etc.',
  'es-mx':
    'Los eventos del respaldo se agregarán a tus datos existentes. Si un evento tiene el mismo nombre, el importado se renombrará (1), (2), etc.',
  it: 'Gli eventi dal backup verranno aggiunti ai dati esistenti. Se un evento ha lo stesso nome, quello importato verrà rinominato (1), (2), ecc.',
  pt: 'Os eventos da cópia de segurança serão adicionados aos dados existentes. Se um evento tiver o mesmo nome, o importado será renomeado (1), (2), etc.',
  'pt-br':
    'Os eventos do backup serão adicionados aos dados existentes. Se um evento tiver o mesmo nome, o importado será renomeado (1), (2), etc.',
  nl: 'Evenementen uit de back-up worden toegevoegd aan je bestaande gegevens. Bij dezelfde naam krijgt het geïmporteerde evenement (1), (2), enz.',
  pl: 'Wydarzenia z kopii zapasowej zostaną dodane do istniejących danych. Przy tej samej nazwie importowane wydarzenie otrzyma nazwę (1), (2) itd.',
  ru: 'События из резервной копии будут добавлены к существующим данным. При совпадении имени импортированное событие будет переименовано (1), (2) и т. д.',
  uk: 'Події з резервної копії будуть додані до наявних даних. За однакової назви імпортовану подію буде перейменовано (1), (2) тощо.',
  tr: 'Yedekteki etkinlikler mevcut verilerinize eklenecek. Aynı ad varsa içe aktarılan etkinlik (1), (2) vb. olarak yeniden adlandırılır.',
  ar: 'ستُضاف الأحداث من النسخة الاحتياطية إلى بياناتك الحالية. إذا كان للحدث نفس الاسم، سيتم إعادة تسمية المستورد (1)، (2)، إلخ.',
  he: 'אירועים מהגיבוי יתווספו לנתונים הקיימים. אם לאירוע אותו שם, יובא בשם (1), (2) וכו׳.',
  ja: 'バックアップのイベントは既存のデータに追加されます。同じ名前の場合、インポートしたイベントは (1)、(2) のように名前が変わります。',
  ko: '백업의 이벤트가 기존 데이터에 추가됩니다. 같은 이름이면 가져온 이벤트는 (1), (2) 등으로 이름이 바뀝니다.',
  zh: '备份中的活动将添加到现有数据。若名称相同，导入的活动将重命名为 (1)、(2) 等。',
  hi: 'बैकअप के इवेंट आपके मौजूदा डेटा में जोड़े जाएंगे। समान नाम पर आयातित इवेंट (1), (2) आदि नाम पाएगा।',
  bn: 'ব্যাকআপের ইভেন্টগুলো আপনার বিদ্যমান ডেটায় যোগ হবে। একই নাম হলে ইম্পোর্ট করা ইভেন্ট (1), (2) ইত্যাদি নাম পাবে।',
  vi: 'Sự kiện từ bản sao lưu sẽ được thêm vào dữ liệu hiện có. Nếu trùng tên, sự kiện nhập sẽ được đổi tên (1), (2), v.v.',
  th: 'กิจกรรมจากการสำรองจะถูกเพิ่มเข้ากับข้อมูลที่มีอยู่ หากชื่อซ้ำ กิจกรรมที่นำเข้าจะถูกเปลี่ยนชื่อเป็น (1), (2) เป็นต้น',
  id: 'Acara dari cadangan akan ditambahkan ke data Anda. Jika namanya sama, acara impor akan dinamai ulang (1), (2), dst.',
  ms: 'Acara daripada sandaran akan ditambah pada data sedia ada. Jika namanya sama, acara import akan dinamakan semula (1), (2), dll.',
  fa: 'رویدادهای پشتیبان به داده‌های فعلی شما اضافه می‌شوند. در صورت یکسان بودن نام، رویداد واردشده (1)، (2) و غیره نام‌گذاری می‌شود.',
  sq: 'Ngjarjet nga rezerva shtohen te të dhënat ekzistuese. Për të njëjtin emër, ngjarja e importuar riemërohet (1), (2), etj.',
  mk: 'Настаните од резервната копија ќе се додадат на постоечките податоци. При исто име, увезениот настан ќе се преименува (1), (2) итн.',
  bg: 'Събитията от архива ще бъдат добавени към съществуващите данни. При същото име импортираното събитие ще бъде преименувано (1), (2) и т.н.',
  el: 'Τα συμβάντα από το αντίγραφο θα προστεθούν στα υπάρχοντα δεδομένα. Αν το όνομα είναι ίδιο, το εισαγόμενο θα μετονομαστεί (1), (2) κ.λπ.',
  ro: 'Evenimentele din backup vor fi adăugate la datele existente. La același nume, evenimentul importat va fi redenumit (1), (2), etc.',
  hu: 'A biztonsági mentés eseményei hozzáadódnak a meglévő adatokhoz. Azonos névnél az importált esemény (1), (2) stb. névet kap.',
  cs: 'Události ze zálohy budou přidány k existujícím datům. Při stejném názvu bude importovaná událost přejmenována na (1), (2) atd.',
  sk: 'Udalosti zo zálohy sa pridajú k existujúcim údajom. Pri rovnakom názve sa importovaná udalosť premenuje na (1), (2) atď.',
  sl: 'Dogodki iz varnostne kopije bodo dodani k obstoječim podatkom. Pri enakem imenu bo uvoženi dogodek preimenovan v (1), (2) itd.',
  hr: 'Događaji iz sigurnosne kopije bit će dodani uz postojeće podatke. Ako događaj ima isti naziv kao postojeći, uvezeni događaj dobit će naziv s (1), (2) itd.',
  da: 'Begivenheder fra backup tilføjes til dine eksisterende data. Ved samme navn omdøbes den importerede begivenhed til (1), (2) osv.',
  sv: 'Händelser från säkerhetskopian läggs till i dina befintliga data. Vid samma namn byter importerad händelse namn till (1), (2) osv.',
  fi: 'Varmuuskopion tapahtumat lisätään olemassa oleviin tietoihin. Sama nimi → tuotu tapahtuma nimetään uudelleen (1), (2) jne.',
  et: 'Varukoopia sündmused lisatakse olemasolevate andmete juurde. Sama nime korral nimetatakse imporditud sündmus ümber (1), (2) jne.',
  lt: 'Įvykiai iš atsarginės kopijos bus pridėti prie esamų duomenų. Jei pavadinimas sutampa, importuotas įvykis bus pervadintas (1), (2) ir t. t.',
  lv: 'Notikumi no dublējuma tiks pievienoti esošajiem datiem. Ja nosaukums sakrīt, importētais notikums tiks pārdēvēts (1), (2) utt.',
  ga: 'Cuirfear imeachtaí ón gcúltaca le do shonraí reatha. Má tá an t-ainm céanna ann, ainmneofar an t-imeacht allmhairithe (1), (2), srl.',
  mt: 'L-avvenimenti mill-backup jiżdiedu mad-data eżistenti. Jekk l-isem huwa l-istess, l-avveniment importat jingħata isem (1), (2), eċċ.',
};

const fallback = MESSAGES.en;

for (const file of fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'))) {
  const locale = file.replace(/\.json$/, '');
  const filePath = path.join(localesDir, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!json.settings) continue;

  json.settings.backupImportConfirmMessage = MESSAGES[locale] ?? fallback;
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log('Patched backupImportConfirmMessage in locales/*.json');
