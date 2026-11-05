/**
 * legal.ads.invitationBody: download may show ad; sharing is free.
 * Run: node scripts/patch-legal-invitation-share-copy.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** @type {Record<string, string>} */
const INVITATION_BODY = {
  en: 'Downloading an invitation image may require watching a short ad when you are online. Sharing is free.',
  bs: 'Preuzimanje slike pozivnice može zahtijevati kratku reklamu kada ste online. Dijeljenje je besplatno.',
  hr: 'Preuzimanje slike pozivnice može zahtijevati kratku reklamu kada ste online. Dijeljenje je besplatno.',
  sr: 'Preuzimanje slike pozivnice može zahtevati gledanje kratke reklame kada ste online. Deljenje je besplatno.',
  'sr-cy':
    'Преузимање слике позивnice може захтевati кратку reklamu на mreži. Дељење је besplatno.',
  de: 'Das Herunterladen eines Einladungsbildes kann online das Ansehen einer kurzen Anzeige erfordern. Teilen ist kostenlos.',
  fr: 'Le téléchargement d’une image d’invitation peut nécessiter une courte publicité en ligne. Le partage est gratuit.',
  es: 'Descargar una imagen de invitación puede requerir un anuncio breve en línea. Compartir es gratis.',
  'es-mx': 'Descargar una imagen de invitación puede requerir un anuncio breve en línea. Compartir es gratis.',
  it: 'Scaricare un’immagine dell’invito può richiedere un breve annuncio online. La condivisione è gratuita.',
  pt: 'Transferir uma imagem de convite pode exigir um anúncio curto online. Partilhar é gratuito.',
  'pt-br': 'Baixar uma imagem de convite pode exigir um anúncio curto online. Compartilhar é gratuito.',
  nl: 'Het downloaden van een uitnodigingsafbeelding kan online een korte advertentie vereisen. Delen is gratis.',
  pl: 'Pobranie obrazu zaproszenia może wymagać krótkiej reklamy online. Udostępnianie jest bezpłatne.',
  ru: 'Скачивание изображения приглашения может потребовать короткой рекламы онлайн. Отправка бесплатна.',
  uk: 'Завантаження зображення запрошення може вимагати короткої реклами онлайн. Надсилання безкоштовне.',
  cs: 'Stažení obrázku pozvánky může online vyžadovat krátkou reklamu. Sdílení je zdarma.',
  sk: 'Stiahnutie obrázka pozvánky môže online vyžadovať krátku reklamu. Zdieľanie je bezplatné.',
  sl: 'Prenos slike vabila lahko na spletu zahteva kratek oglas. Deljenje je brezplačno.',
  hu: 'A meghívókép letöltése online rövid hirdetést igényelhet. A megosztás ingyenes.',
  ro: 'Descărcarea unei imagini de invitație poate necesita o reclamă scurtă online. Partajarea este gratuită.',
  bg: 'Изтеглянето на изображение на покана може да изисква кратка реклама онлайн. Споделянето е безплатно.',
  el: 'Η λήψη εικόνας πρόσκλησης μπορεί να απαιτεί σύντομη διαφήμιση online. Η κοινοποίηση είναι δωρεάν.',
  tr: 'Davetiye görselini indirmek çevrimiçiyken kısa bir reklam gerektirebilir. Paylaşım ücretsizdir.',
  ar: 'قد يتطلب تنزيل صورة الدعوة إعلانًا قصيرًا عند الاتصال. المشاركة مجانية.',
  he: 'הורדת תמונת הזמנה עשויה לדרוש פרסומת קצרה באינטרנט. השיתוף חינם.',
  ja: 'オンラインで招待状画像をダウンロードする際、短い広告が表示される場合があります。共有は無料です。',
  ko: '온라인에서 초대장 이미지를 다운로드할 때 짧은 광고가 필요할 수 있습니다. 공유는 무료입니다.',
  zh: '在线下载请柬图片可能需要观看短广告。分享免费。',
  hi: 'ऑनलाइन होने पर निमंत्रण छवि डाउनलोड करने के लिए छोटा विज्ञापन लग सकता है। साझा करना मुफ़्त है।',
  bn: 'অনলাইনে আমন্ত্রণ ছবি ডাউনলোড করতে ছোট বিজ্ঞাপন লাগতে পারে। শেয়ার বিনামূল্যে।',
  vi: 'Tải ảnh thiệp mời khi trực tuyến có thể cần quảng cáo ngắn. Chia sẻ miễn phí.',
  th: 'การดาวน์โหลดภาพคำเชิญเมื่อออนไลน์อาจต้องดูโฆษณาสั้นๆ การแชร์ฟรี',
  id: 'Mengunduh gambar undangan saat online mungkin memerlukan iklan singkat. Berbagi gratis.',
  ms: 'Muat turun imej jemputan dalam talian mungkin memerlukan iklan pendek. Berkongsi percuma.',
  fa: 'دانلود تصویر دعوت‌نامه آنلاین ممکن است تبلیغ کوتاه بخواهد. اشتراک‌گذاری رایگان است.',
  sq: 'Shkarkimi i fotos së ftesës online mund të kërkojë reklamë të shkurtër. Ndarja është falas.',
  mk: 'Preuzimanjeto na slika od pokana online moze da bara kratka reklama. Spodeluvanjeto e besplatno.',
  da: 'Download af et invitationsbillede online kan kræve en kort annonce. Deling er gratis.',
  sv: 'Att ladda ner en inbjudningsbild online kan kräva en kort annons. Delning är gratis.',
  fi: 'Kutsukuvan lataaminen verkossa voi vaatia lyhyen mainoksen. Jakaminen on ilmaista.',
  et: 'Kutsepildi allalaadimine võrgus võib nõuda lühikest reklaami. Jagamine on tasuta.',
  lt: 'Kvietimo vaizdo atsisiuntimas prisijungus gali reikalauti trumpos reklamos. Bendrinimas nemokamas.',
  lv: 'Ielūguma attēla lejupielāde tiešsaistē var prasīt īsu reklāmu. Kopīgošana ir bez maksas.',
  ga: 'D’fhéadfadh fógra gearr a bheith de dhíth chun íomhá cuireadh a íoslódáil ar líne. Tá comhroinnt saor in aisce.',
  mt: 'It-tniżżil ta’ stampa ta’ stedina online jista’ jeħtieġ reklam qasir. Il-kondiviżjoni hija b’xejn.',
};

const fallback = INVITATION_BODY.en;

for (const file of fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'))) {
  const locale = file.replace(/\.json$/, '');
  const filePath = path.join(localesDir, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!json.legal?.ads) continue;

  json.legal.ads.invitationBody = INVITATION_BODY[locale] ?? fallback;
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log('Patched legal.ads.invitationBody in locales/*.json');
