import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const HALL_OVERVIEW_HINT_TRANSLATIONS = {
  bg: 'Използвай +/− за мащаб. Плъзни залата, за да преместиш изгледа. Плъзни маса, за да я преместиш.',
  bs: 'Koristi +/− za zoom. Prevuci salu da pomjeriš prikaz. Prevuci sto da promijeniš poziciju.',
  cs: 'Použij +/− pro přiblížení. Přetáhni sál pro posun zobrazení. Přetáhni stůl pro změnu pozice.',
  da: 'Brug +/− til zoom. Træk salen for at flytte visningen. Træk et bord for at flytte det.',
  de: 'Nutze +/− zum Zoomen. Ziehe die Halle, um die Ansicht zu verschieben. Ziehe einen Tisch, um ihn zu verschieben.',
  el: 'Χρησιμοποίησε +/− για ζουμ. Σύρε την αίθουσα για να μετακινήσεις την προβολή. Σύρε τραπέζι για να το μετακινήσεις.',
  en: 'Use +/− to zoom. Drag the hall to move the view. Drag a table to reposition it.',
  es: 'Usa +/− para hacer zoom. Arrastra la sala para mover la vista. Arrastra una mesa para reposicionarla.',
  et: 'Kasuta +/− suumimiseks. Lohista saali, et vaadet liigutada. Lohista lauda, et seda liigutada.',
  fi: 'Käytä +/− zoomaukseen. Vedä salia siirtääksesi näkymää. Vedä pöytää siirtääksesi sitä.',
  fr: 'Utilise +/− pour zoomer. Fais glisser la salle pour déplacer la vue. Fais glisser une table pour la repositionner.',
  ga: 'Úsáid +/− le haghaidh súmála. Tarraing an halla chun an radharc a bhogadh. Tarraing boird chun í a athshuíomh.',
  hr: 'Koristi +/− za zoom. Povuci salu da pomakneš prikaz. Povuci stol da promijeniš poziciju.',
  hu: 'Használd a +/− gombokat nagyításhoz. Húzd a termet a nézet mozgatásához. Húzd az asztalt az áthelyezéshez.',
  it: 'Usa +/− per lo zoom. Trascina la sala per spostare la vista. Trascina un tavolo per riposizionarlo.',
  lt: 'Naudok +/− priartinimui. Vilkite salę, kad perstumtumėte vaizdą. Vilkite stalą, kad pakeistumėte jo vietą.',
  lv: 'Izmanto +/− tālummaiņai. Velc zāli, lai pārvietotu skatu. Velc galdu, lai mainītu tā pozīciju.',
  mk: 'Користи +/− за зум. Повлечи ја салата за да го поместиш приказот. Повлечи маса за да ја преместиш.',
  mt: 'Uża +/− għall-zoom. Iddreggja s-sala biex tbiddel il-vista. Iddreggja mejda biex tbiddel il-pożizzjoni.',
  nl: 'Gebruik +/− om te zoomen. Sleep de zaal om het beeld te verschuiven. Sleep een tafel om deze te verplaatsen.',
  pl: 'Użyj +/− do powiększenia. Przeciągnij salę, aby przesunąć widok. Przeciągnij stół, aby zmienić jego pozycję.',
  pt: 'Usa +/− para zoom. Arrasta a sala para mover a vista. Arrasta uma mesa para reposicioná-la.',
  ro: 'Folosește +/− pentru zoom. Trage sala pentru a muta vizualizarea. Trage o masă pentru a o repoziționa.',
  sk: 'Použite +/− na priblíženie. Potiahnite sálu na posun zobrazenia. Presuňte stôl zmenou polohy.',
  sl: 'Uporabi +/− za povečavo. Povleci dvorano, da premakneš pogled. Povleci mizo, da spremeniš položaj.',
  sq: 'Përdor +/− për zoom. Tërhiq sallën për të lëvizur pamjen. Tërhiq një tavolinë për ta zhvendosur.',
  sr: 'Koristi +/− za zoom. Prevuci salu da pomeraš prikaz. Prevuci sto da promeniš poziciju.',
  'sr-cy': 'Користи +/− за зум. Превуци салу да помериш приказ. Превуци сто да промениш позицију.',
  sv: 'Använd +/− för att zooma. Dra salen för att flytta vyn. Dra ett bord för att flytta det.',
  uk: 'Використовуй +/− для масштабу. Перетягни зал, щоб змістити перегляд. Перетягни стіл, щоб змінити його позицію.',
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
