import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** @type {Record<string, { reviewPromptTitle: string; reviewPromptMessage: string; reviewPromptRate: string; reviewPromptLater: string }>} */
const TRANSLATIONS = {
  bg: {
    reviewPromptTitle: 'Харесва ли ви приложението?',
    reviewPromptMessage:
      'Ако „Моето перфектно парти“ ви помага да планирате, кратка рецензия в Google Play би значила много.',
    reviewPromptRate: 'Оцени сега',
    reviewPromptLater: 'По-късно',
  },
  bs: {
    reviewPromptTitle: 'Sviđa ti se aplikacija?',
    reviewPromptMessage:
      'Ako ti Moja savršena proslava pomaže u planiranju, kratka recenzija na Google Playu bi nam puno značila.',
    reviewPromptRate: 'Ocijeni sada',
    reviewPromptLater: 'Kasnije',
  },
  cs: {
    reviewPromptTitle: 'Líbí se vám aplikace?',
    reviewPromptMessage:
      'Pokud vám Moje dokonalá oslava pomáhá s plánováním, krátká recenze na Google Play by nám hodně pomohla.',
    reviewPromptRate: 'Ohodnotit nyní',
    reviewPromptLater: 'Později',
  },
  da: {
    reviewPromptTitle: 'Kan du lide appen?',
    reviewPromptMessage:
      'Hvis My Perfect Party hjælper dig med at planlægge, ville en kort anmeldelse på Google Play betyde meget.',
    reviewPromptRate: 'Bedøm nu',
    reviewPromptLater: 'Senere',
  },
  de: {
    reviewPromptTitle: 'Gefällt dir die App?',
    reviewPromptMessage:
      'Wenn dir Meine perfekte Feier beim Planen hilft, würde uns eine kurze Bewertung bei Google Play sehr freuen.',
    reviewPromptRate: 'Jetzt bewerten',
    reviewPromptLater: 'Später',
  },
  el: {
    reviewPromptTitle: 'Σας αρέσει η εφαρμογή;',
    reviewPromptMessage:
      'Αν το My Perfect Party σας βοηθά στον προγραμματισμό, μια σύντομη κριτική στο Google Play θα σήμαινε πολλά.',
    reviewPromptRate: 'Αξιολόγηση τώρα',
    reviewPromptLater: 'Αργότερα',
  },
  en: {
    reviewPromptTitle: 'Enjoying the app?',
    reviewPromptMessage:
      'If My Perfect Party helps you plan, a short Google Play review would mean a lot.',
    reviewPromptRate: 'Rate now',
    reviewPromptLater: 'Later',
  },
  es: {
    reviewPromptTitle: '¿Te gusta la app?',
    reviewPromptMessage:
      'Si Mi fiesta perfecta te ayuda a planificar, una breve reseña en Google Play significaría mucho.',
    reviewPromptRate: 'Valorar ahora',
    reviewPromptLater: 'Más tarde',
  },
  et: {
    reviewPromptTitle: 'Kas rakendus meeldib?',
    reviewPromptMessage:
      'Kui Minu täiuslik pidu aitab sul planeerida, oleks lühike arvustus Google Plays suureks toeks.',
    reviewPromptRate: 'Hinda kohe',
    reviewPromptLater: 'Hiljem',
  },
  fi: {
    reviewPromptTitle: 'Pidätkö sovelluksesta?',
    reviewPromptMessage:
      'Jos Täydelliset juhani auttaa suunnittelussa, lyhyt arvostelu Google Playssa merkitsisi paljon.',
    reviewPromptRate: 'Arvostele nyt',
    reviewPromptLater: 'Myöhemmin',
  },
  fr: {
    reviewPromptTitle: "Vous aimez l'application ?",
    reviewPromptMessage:
      'Si Ma fête parfaite vous aide à organiser, un court avis sur Google Play nous ferait très plaisir.',
    reviewPromptRate: 'Noter maintenant',
    reviewPromptLater: 'Plus tard',
  },
  ga: {
    reviewPromptTitle: 'An bhfuil an aip go maith?',
    reviewPromptMessage:
      'Má chuidíonn Mo Cheiliúradh Foirfe leat pleanáil, bheadh léirmheas gairid ar Google Play an-luachmhar.',
    reviewPromptRate: 'Tabhair léirmheas anois',
    reviewPromptLater: 'Níos déanaí',
  },
  hr: {
    reviewPromptTitle: 'Sviđa ti se aplikacija?',
    reviewPromptMessage:
      'Ako ti Moja savršena proslava pomaže u planiranju, kratka recenzija na Google Playu bi nam puno značila.',
    reviewPromptRate: 'Ocijeni sada',
    reviewPromptLater: 'Kasnije',
  },
  hu: {
    reviewPromptTitle: 'Tetszik az alkalmazás?',
    reviewPromptMessage:
      'Ha A tökéletes ünnepem segít a tervezésben, egy rövid Google Play értékelés sokat jelentene.',
    reviewPromptRate: 'Értékelés most',
    reviewPromptLater: 'Később',
  },
  it: {
    reviewPromptTitle: "Ti piace l'app?",
    reviewPromptMessage:
      'Se La mia festa perfetta ti aiuta a organizzare, una breve recensione su Google Play significherebbe molto.',
    reviewPromptRate: 'Valuta ora',
    reviewPromptLater: 'Più tardi',
  },
  lt: {
    reviewPromptTitle: 'Patinka programėlė?',
    reviewPromptMessage:
      'Jei Mano tobula šventė padeda planuoti, trumpas atsiliepimas „Google Play“ būtų labai naudingas.',
    reviewPromptRate: 'Įvertinti dabar',
    reviewPromptLater: 'Vėliau',
  },
  lv: {
    reviewPromptTitle: 'Patīk lietotne?',
    reviewPromptMessage:
      'Ja Mana ideālā svinēšana palīdz plānot, īsa atsauksme Google Play mums ļoti palīdzētu.',
    reviewPromptRate: 'Novērtēt tagad',
    reviewPromptLater: 'Vēlāk',
  },
  mk: {
    reviewPromptTitle: 'Ти се допаѓа апликацијата?',
    reviewPromptMessage:
      'Ако Мојата совршена прослава ти помага во планирањето, кратка рецензија на Google Play би значела многу.',
    reviewPromptRate: 'Оцени сега',
    reviewPromptLater: 'Подоцна',
  },
  mt: {
    reviewPromptTitle: 'Tħobb l-app?',
    reviewPromptMessage:
      'Jekk Il-Festa Perfetta Tiegħi tgħinek tippjana, reviżjoni qasira fuq Google Play tfisser ħafna.',
    reviewPromptRate: 'Irrevedi issa',
    reviewPromptLater: 'Aktar tard',
  },
  nl: {
    reviewPromptTitle: 'Vind je de app leuk?',
    reviewPromptMessage:
      'Als Mijn perfecte feest je helpt plannen, zou een korte recensie op Google Play veel betekenen.',
    reviewPromptRate: 'Nu beoordelen',
    reviewPromptLater: 'Later',
  },
  pl: {
    reviewPromptTitle: 'Podoba Ci się aplikacja?',
    reviewPromptMessage:
      'Jeśli Moja idealna impreza pomaga Ci planować, krótka opinia w Google Play wiele by dla nas znaczyła.',
    reviewPromptRate: 'Oceń teraz',
    reviewPromptLater: 'Później',
  },
  pt: {
    reviewPromptTitle: 'Gostas da app?',
    reviewPromptMessage:
      'Se A minha festa perfeita te ajuda a planear, uma breve avaliação no Google Play significaria muito.',
    reviewPromptRate: 'Avaliar agora',
    reviewPromptLater: 'Mais tarde',
  },
  ro: {
    reviewPromptTitle: 'Îți place aplicația?',
    reviewPromptMessage:
      'Dacă Petrecerea mea perfectă te ajută să planifici, o scurtă recenzie pe Google Play ar însemna mult.',
    reviewPromptRate: 'Evaluează acum',
    reviewPromptLater: 'Mai târziu',
  },
  sk: {
    reviewPromptTitle: 'Páči sa vám aplikácia?',
    reviewPromptMessage:
      'Ak vám Moja dokonalá oslava pomáha s plánovaním, krátka recenzia na Google Play by nám veľmi pomohla.',
    reviewPromptRate: 'Ohodnotiť teraz',
    reviewPromptLater: 'Neskôr',
  },
  sl: {
    reviewPromptTitle: 'Vam je aplikacija všeč?',
    reviewPromptMessage:
      'Če vam Moja popolna proslava pomaga pri načrtovanju, bi kratka ocena na Google Play veliko pomenila.',
    reviewPromptRate: 'Oceni zdaj',
    reviewPromptLater: 'Pozneje',
  },
  sq: {
    reviewPromptTitle: 'Të pëlqen aplikacioni?',
    reviewPromptMessage:
      'Nëse Festa ime e përsosur të ndihmon të planifikosh, një vlerësim i shkurtër në Google Play do të kishte shumë kuptim.',
    reviewPromptRate: 'Vlerëso tani',
    reviewPromptLater: 'Më vonë',
  },
  sr: {
    reviewPromptTitle: 'Sviđa ti se aplikacija?',
    reviewPromptMessage:
      'Ako ti Moja savršena proslava pomaže u planiranju, kratka recenzija na Google Playu bi nam puno značila.',
    reviewPromptRate: 'Oceni sada',
    reviewPromptLater: 'Kasnije',
  },
  'sr-cy': {
    reviewPromptTitle: 'Свиђа ти се апликација?',
    reviewPromptMessage:
      'Ако ти Моја савршена прослава помаже у планирању, кратка рецензија на Google Play-у би нам пуно значила.',
    reviewPromptRate: 'Оцени сада',
    reviewPromptLater: 'Касније',
  },
  sv: {
    reviewPromptTitle: 'Gillar du appen?',
    reviewPromptMessage:
      'Om Min perfekta fest hjälper dig planera skulle en kort recension på Google Play betyda mycket.',
    reviewPromptRate: 'Betygsätt nu',
    reviewPromptLater: 'Senare',
  },
  uk: {
    reviewPromptTitle: 'Подобається застосунок?',
    reviewPromptMessage:
      'Якщо Мій ідеальний празник допомагає вам планувати, короткий відгук у Google Play дуже допоможе.',
    reviewPromptRate: 'Оцінити зараз',
    reviewPromptLater: 'Пізніше',
  },
};

let updated = 0;

for (const [locale, strings] of Object.entries(TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.settings.reviewPromptTitle = strings.reviewPromptTitle;
  data.settings.reviewPromptMessage = strings.reviewPromptMessage;
  data.settings.reviewPromptRate = strings.reviewPromptRate;
  data.settings.reviewPromptLater = strings.reviewPromptLater;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
}

console.log(`Updated review prompt strings in ${updated} locale files.`);
