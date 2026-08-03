import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const THEME_CHANGE_AD_HINT_TRANSLATIONS = {
  bg: 'Гледайте реклама, за да смените темата.',
  bs: 'Pogledaj reklamu da promijeniš temu.',
  cs: 'Pro změnu motivu zhlédněte reklamu.',
  da: 'Se en reklame for at skifte tema.',
  de: 'Sehen Sie eine Werbung, um das Design zu wechseln.',
  el: 'Παρακολουθήστε μια διαφήμιση για να αλλάξετε θέμα.',
  es: 'Mira un anuncio para cambiar el tema.',
  et: 'Vaata reklaami, et teemat vahetada.',
  fi: 'Katso mainos vaihtaaksesi teemaa.',
  fr: 'Regardez une publicité pour changer de thème.',
  ga: 'Féach ar fhógra chun an téama a athrú.',
  hr: 'Pogledaj reklamu da promijeniš temu.',
  hu: 'Nézz meg egy reklámot a téma megváltoztatásához.',
  it: 'Guarda un annuncio per cambiare tema.',
  lt: 'Peržiūrėkite reklamą, kad pakeistumėte temą.',
  lv: 'Noskatieties reklāmu, lai mainītu tēmu.',
  mk: 'Гледај реклама за да ја смениш темата.',
  mt: 'Ara reklam biex tbiddel it-tema.',
  nl: 'Bekijk een advertentie om het thema te wijzigen.',
  pl: 'Obejrzyj reklamę, aby zmienić motyw.',
  pt: 'Veja um anúncio para mudar o tema.',
  ro: 'Vizionează o reclamă pentru a schimba tema.',
  sk: 'Pre zmenu motívu si pozrite reklamu.',
  sl: 'Za spremembo teme si oglejte oglas.',
  sq: 'Shiko një reklamë për të ndryshuar temën.',
  'sr-cy': 'Погледај рекламу да промијениш тему.',
  sv: 'Titta på en annons för att byta tema.',
  uk: 'Перегляньте рекламу, щоб змінити тему.',
};

for (const [locale, hint] of Object.entries(THEME_CHANGE_AD_HINT_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.settings.themeChangeAdHint = hint;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

console.log(`Updated themeChangeAdHint in ${Object.keys(THEME_CHANGE_AD_HINT_TRANSLATIONS).length} locale files.`);
