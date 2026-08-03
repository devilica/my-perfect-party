import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** @type {Record<string, { reviewTitle: string; reviewDescription: string; reviewUnavailable: string }>} */
const TRANSLATIONS = {
  bg: {
    reviewTitle: 'Оценете приложението',
    reviewDescription: 'Харесва ли ви приложението? Оставете отзив в Google Play.',
    reviewUnavailable: 'Не може да се отвори Google Play.',
  },
  bs: {
    reviewTitle: 'Ocijeni aplikaciju',
    reviewDescription: 'Sviđa ti se aplikacija? Ostavi recenziju na Google Playu.',
    reviewUnavailable: 'Nije moguće otvoriti Google Play.',
  },
  cs: {
    reviewTitle: 'Ohodnotit aplikaci',
    reviewDescription: 'Líbí se vám aplikace? Zanechte recenzi na Google Play.',
    reviewUnavailable: 'Nepodařilo se otevřít Google Play.',
  },
  da: {
    reviewTitle: 'Bedøm appen',
    reviewDescription: 'Kan du lide appen? Skriv en anmeldelse på Google Play.',
    reviewUnavailable: 'Kunne ikke åbne Google Play.',
  },
  de: {
    reviewTitle: 'App bewerten',
    reviewDescription: 'Gefällt dir die App? Hinterlasse eine Bewertung bei Google Play.',
    reviewUnavailable: 'Google Play konnte nicht geöffnet werden.',
  },
  el: {
    reviewTitle: 'Αξιολογήστε την εφαρμογή',
    reviewDescription: 'Σας αρέσει η εφαρμογή; Αφήστε μια κριτική στο Google Play.',
    reviewUnavailable: 'Δεν ήταν δυνατό το άνοιγμα του Google Play.',
  },
  en: {
    reviewTitle: 'Rate the app',
    reviewDescription: 'Enjoying the app? Leave a review on Google Play.',
    reviewUnavailable: 'Could not open Google Play.',
  },
  es: {
    reviewTitle: 'Valorar la app',
    reviewDescription: '¿Te gusta la app? Deja una reseña en Google Play.',
    reviewUnavailable: 'No se pudo abrir Google Play.',
  },
  et: {
    reviewTitle: 'Hinda rakendust',
    reviewDescription: 'Meeldib rakendus? Jäta arvustus Google Playsse.',
    reviewUnavailable: 'Google Playd ei saanud avada.',
  },
  fi: {
    reviewTitle: 'Arvostele sovellus',
    reviewDescription: 'Pidätkö sovelluksesta? Jätä arvostelu Google Playhin.',
    reviewUnavailable: 'Google Playta ei voitu avata.',
  },
  fr: {
    reviewTitle: "Noter l'application",
    reviewDescription: "Vous aimez l'application ? Laissez un avis sur Google Play.",
    reviewUnavailable: "Impossible d'ouvrir Google Play.",
  },
  ga: {
    reviewTitle: 'Tabhair léirmheas ar an aip',
    reviewDescription: 'An bhfuil an aip go maith? Fág léirmheas ar Google Play.',
    reviewUnavailable: 'Níorbh fhéidir Google Play a oscailt.',
  },
  hr: {
    reviewTitle: 'Ocijeni aplikaciju',
    reviewDescription: 'Sviđa ti se aplikacija? Ostavi recenziju na Google Playu.',
    reviewUnavailable: 'Nije moguće otvoriti Google Play.',
  },
  hu: {
    reviewTitle: 'Értékeld az alkalmazást',
    reviewDescription: 'Tetszik az alkalmazás? Írj értékelést a Google Playen.',
    reviewUnavailable: 'Nem sikerült megnyitni a Google Playt.',
  },
  it: {
    reviewTitle: "Valuta l'app",
    reviewDescription: "Ti piace l'app? Lascia una recensione su Google Play.",
    reviewUnavailable: 'Impossibile aprire Google Play.',
  },
  lt: {
    reviewTitle: 'Įvertinkite programėlę',
    reviewDescription: 'Patinka programėlė? Palikite atsiliepimą „Google Play“.',
    reviewUnavailable: 'Nepavyko atidaryti „Google Play“.',
  },
  lv: {
    reviewTitle: 'Novērtēt lietotni',
    reviewDescription: 'Patīk lietotne? Atstāj atsauksmi Google Play.',
    reviewUnavailable: 'Neizdevās atvērt Google Play.',
  },
  mk: {
    reviewTitle: 'Оцени ја апликацијата',
    reviewDescription: 'Ти се допаѓа апликацијата? Остави рецензија на Google Play.',
    reviewUnavailable: 'Не може да се отвори Google Play.',
  },
  mt: {
    reviewTitle: 'Irrevedi l-app',
    reviewDescription: 'Tħobb l-app? Ħalli reviżjoni fuq Google Play.',
    reviewUnavailable: 'Ma setax jinfetaħ Google Play.',
  },
  nl: {
    reviewTitle: 'Beoordeel de app',
    reviewDescription: 'Vind je de app leuk? Laat een recensie achter op Google Play.',
    reviewUnavailable: 'Google Play kon niet worden geopend.',
  },
  pl: {
    reviewTitle: 'Oceń aplikację',
    reviewDescription: 'Podoba Ci się aplikacja? Zostaw opinię w Google Play.',
    reviewUnavailable: 'Nie udało się otworzyć Google Play.',
  },
  pt: {
    reviewTitle: 'Avaliar a app',
    reviewDescription: 'Gostas da app? Deixa uma avaliação no Google Play.',
    reviewUnavailable: 'Não foi possível abrir o Google Play.',
  },
  ro: {
    reviewTitle: 'Evaluează aplicația',
    reviewDescription: 'Îți place aplicația? Lasă o recenzie pe Google Play.',
    reviewUnavailable: 'Nu s-a putut deschide Google Play.',
  },
  sk: {
    reviewTitle: 'Ohodnotiť aplikáciu',
    reviewDescription: 'Páči sa vám aplikácia? Zanechajte recenziu na Google Play.',
    reviewUnavailable: 'Nepodarilo sa otvoriť Google Play.',
  },
  sl: {
    reviewTitle: 'Oceni aplikacijo',
    reviewDescription: 'Vam je aplikacija všeč? Pustite mnenje na Google Play.',
    reviewUnavailable: 'Google Play ni bilo mogoče odpreti.',
  },
  sq: {
    reviewTitle: 'Vlerëso aplikacionin',
    reviewDescription: 'Të pëlqen aplikacioni? Lë një vlerësim në Google Play.',
    reviewUnavailable: 'Nuk mund të hapet Google Play.',
  },
  sr: {
    reviewTitle: 'Oceni aplikaciju',
    reviewDescription: 'Sviđa ti se aplikacija? Ostavi recenziju na Google Playu.',
    reviewUnavailable: 'Nije moguće otvoriti Google Play.',
  },
  'sr-cy': {
    reviewTitle: 'Оцени апликацију',
    reviewDescription: 'Свиђа ти се апликација? Остави рецензију на Google Play-у.',
    reviewUnavailable: 'Није могуће отворити Google Play.',
  },
  sv: {
    reviewTitle: 'Betygsätt appen',
    reviewDescription: 'Gillar du appen? Lämna ett omdöme på Google Play.',
    reviewUnavailable: 'Kunde inte öppna Google Play.',
  },
  uk: {
    reviewTitle: 'Оцінити застосунок',
    reviewDescription: 'Подобається застосунок? Залиште відгук у Google Play.',
    reviewUnavailable: 'Не вдалося відкрити Google Play.',
  },
};

let updated = 0;

for (const [locale, strings] of Object.entries(TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.settings.reviewTitle = strings.reviewTitle;
  data.settings.reviewDescription = strings.reviewDescription;
  data.settings.reviewUnavailable = strings.reviewUnavailable;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
}

console.log(`Updated review strings in ${updated} locale files.`);
