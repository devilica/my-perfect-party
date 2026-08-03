import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const HALL_OVERVIEW_HINT_TRANSLATIONS = {
  bg: 'Плъзнете наляво и надясно. Щипнете или използвайте +/− за мащаб. Плъзнете маса, за да я преместите.',
  bs: 'Prevuci prikaz lijevo i desno. Štipaj ili koristi +/− za zoom. Prevuci sto da promijeniš poziciju.',
  cs: 'Přejeďte vlevo a vpravo. Pinch nebo použijte +/− pro zoom. Přetáhněte stůl pro změnu pozice.',
  da: 'Stryg til venstre og højre. Knib eller brug +/− for zoom. Træk et bord for at flytte det.',
  de: 'Wischen Sie nach links und rechts. Ziehen Sie zum Zoomen oder nutzen Sie +/−. Ziehen Sie einen Tisch, um ihn zu verschieben.',
  el: 'Σύρετε αριστερά και δεξιά. Τσιμπήστε ή χρησιμοποιήστε +/− για zoom. Σύρετε τραπέζι για να το μετακινήσετε.',
  es: 'Desliza a izquierda y derecha. Pellizca o usa +/− para zoom. Arrastra una mesa para reposicionarla.',
  et: 'Libista vasakule ja paremale. Näpista või kasuta +/− suumimiseks. Lohista lauda, et seda liigutada.',
  fi: 'Pyyhkäise vasemmalle ja oikealle. Nipistä tai käytä +/− zoomaukseen. Vedä pöytää siirtääksesi sitä.',
  fr: 'Glissez à gauche et à droite. Pincez ou utilisez +/− pour zoomer. Faites glisser une table pour la repositionner.',
  ga: 'Svaidhpeáil ar chlé agus ar dheis. Pinch nó úsáid +/− le haghaidh súmála. Tarraing boird chun í a athshuíomh.',
  hr: 'Povucite prikaz lijevo i desno. Štipajte ili koristite +/− za zoom. Povucite stol da promijenite poziciju.',
  hu: 'Húzza balra és jobbra. Csípje össze vagy használja a +/− gombokat nagyításhoz. Húzza az asztalt az áthelyezéshez.',
  it: 'Scorri a sinistra e destra. Pizzica o usa +/− per lo zoom. Trascina un tavolo per riposizionarlo.',
  lt: 'Braukite kairėn ir dešinėn. Spustelėkite arba naudokite +/− priartinimui. Vilkite stalą, kad pakeistumėte jo vietą.',
  lv: 'Velciet pa kreisi un pa labi. Sašpiniet vai izmantojiet +/− tālummaiņai. Velciet galdu, lai mainītu tā pozīciju.',
  mk: 'Поминете лево и десно. Стиснете или користете +/− за зум. Повлечете маса за да ја преместите.',
  mt: 'Iddreggja xellug u lemin. Aqleb jew uża +/− għall-zoom. Iddreggja mejda biex tbiddel il-pożizzjoni.',
  nl: 'Veeg naar links en rechts. Knijp of gebruik +/− om te zoomen. Sleep een tafel om deze te verplaatsen.',
  pl: 'Przesuń w lewo i w prawo. Uszczypnij lub użyj +/− do powiększenia. Przeciągnij stół, aby zmienić jego pozycję.',
  pt: 'Deslize para esquerda e direita. Pinça ou use +/− para zoom. Arraste uma mesa para reposicioná-la.',
  ro: 'Glisați stânga și dreapta. Ciupiți sau folosiți +/− pentru zoom. Trageți o masă pentru a o repoziționa.',
  sk: 'Potiahnite vľavo a vpravo. Pinch alebo použite +/− na priblíženie. Presuňte stôl zmenou polohy.',
  sl: 'Povlecite levo in desno. Stisnite ali uporabite +/− za povečavo. Povlecite mizo, da spremenite položaj.',
  sq: 'Rrëshqit majtas dhe djathtas. Shtyp ose përdor +/− për zoom. Tërhiq një tavolinë për ta zhvendosur.',
  'sr-cy': 'Превуците приказ лево и десно. Стисните или користите +/− за зум. Превуците сто да промените позицију.',
  sv: 'Svep åt vänster och höger. Nyp eller använd +/− för att zooma. Dra ett bord för att flytta det.',
  uk: 'Проведіть пальцем ліворуч і праворуч. Зведіть пальці або використовуйте +/− для масштабу. Перетягніть стіл, щоб змінити його позицію.',
};

for (const [locale, hint] of Object.entries(HALL_OVERVIEW_HINT_TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.seating.hallOverviewHint = hint;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

console.log(
  `Updated hallOverviewHint in ${Object.keys(HALL_OVERVIEW_HINT_TRANSLATIONS).length} locale files.`
);
