import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const TABLE_SHAPE_TRANSLATIONS = {
  bg: {
    tableShape: 'Тип маса',
    tableShapeRound: 'Кръгла',
    tableShapeSingleSided: 'Едностранна',
    tableShapeRectangular: 'Правоъгълна',
    tableShapeSquare: 'Квадратна',
    squareCapacityError: 'Капацитетът на квадратна маса трябва да е делим на 4.',
  },
  bs: {
    tableShape: 'Tip stola',
    tableShapeRound: 'Okrugli',
    tableShapeSingleSided: 'Jednostrani',
    tableShapeRectangular: 'Pravougaoni',
    tableShapeSquare: 'Četvrtasti',
    squareCapacityError: 'Kapacitet četvrtastog stola mora biti djeljiv sa 4.',
  },
  cs: {
    tableShape: 'Typ stolu',
    tableShapeRound: 'Kulatý',
    tableShapeSingleSided: 'Jednostranný',
    tableShapeRectangular: 'Obdélníkový',
    tableShapeSquare: 'Čtvercový',
    squareCapacityError: 'Kapacita čtvercového stolu musí být dělitelná 4.',
  },
  da: {
    tableShape: 'Bordtype',
    tableShapeRound: 'Rund',
    tableShapeSingleSided: 'Enkelt siddende',
    tableShapeRectangular: 'Rektangulær',
    tableShapeSquare: 'Firkantet',
    squareCapacityError: 'Kapaciteten for et firkantet bord skal være delelig med 4.',
  },
  de: {
    tableShape: 'Tischtyp',
    tableShapeRound: 'Rund',
    tableShapeSingleSided: 'Einseitig',
    tableShapeRectangular: 'Rechteckig',
    tableShapeSquare: 'Quadratisch',
    squareCapacityError: 'Die Kapazität eines quadratischen Tisches muss durch 4 teilbar sein.',
  },
  el: {
    tableShape: 'Τύπος τραπεζιού',
    tableShapeRound: 'Στρογγυλό',
    tableShapeSingleSided: 'Μονόπλευρο',
    tableShapeRectangular: 'Ορθογώνιο',
    tableShapeSquare: 'Τετράγωνο',
    squareCapacityError: 'Η χωρητικότητα τετράγωνου τραπεζιού πρέπει να διαιρείται με το 4.',
  },
  es: {
    tableShape: 'Tipo de mesa',
    tableShapeRound: 'Redonda',
    tableShapeSingleSided: 'Unilateral',
    tableShapeRectangular: 'Rectangular',
    tableShapeSquare: 'Cuadrada',
    squareCapacityError: 'La capacidad de una mesa cuadrada debe ser divisible por 4.',
  },
  et: {
    tableShape: 'Laua tüüp',
    tableShapeRound: 'Ümmargune',
    tableShapeSingleSided: 'Ühepoolne',
    tableShapeRectangular: 'Ristkülikukujuline',
    tableShapeSquare: 'Ruudukujuline',
    squareCapacityError: 'Ruudukujulise laua mahutavus peab olema jagatav 4-ga.',
  },
  fi: {
    tableShape: 'Pöydän tyyppi',
    tableShapeRound: 'Pyöreä',
    tableShapeSingleSided: 'Yksipuolinen',
    tableShapeRectangular: 'Suorakulmainen',
    tableShapeSquare: 'Neliö',
    squareCapacityError: 'Neliöpöydän kapasiteetin on oltava jaollinen luvulla 4.',
  },
  fr: {
    tableShape: 'Type de table',
    tableShapeRound: 'Ronde',
    tableShapeSingleSided: 'Unilatérale',
    tableShapeRectangular: 'Rectangulaire',
    tableShapeSquare: 'Carrée',
    squareCapacityError: 'La capacité d\'une table carrée doit être divisible par 4.',
  },
  ga: {
    tableShape: 'Cineál boird',
    tableShapeRound: 'Cruinn',
    tableShapeSingleSided: 'Taobh amháin',
    tableShapeRectangular: 'Dronuilleogach',
    tableShapeSquare: 'Cearnach',
    squareCapacityError: 'Caithfidh acmhainn boird chearnach a bheith inroinnte faoi 4.',
  },
  hr: {
    tableShape: 'Tip stola',
    tableShapeRound: 'Okrugli',
    tableShapeSingleSided: 'Jednostrani',
    tableShapeRectangular: 'Pravokutni',
    tableShapeSquare: 'Kvadratni',
    squareCapacityError: 'Kapacitet kvadratnog stola mora biti djeljiv sa 4.',
  },
  hu: {
    tableShape: 'Asztaltípus',
    tableShapeRound: 'Kerek',
    tableShapeSingleSided: 'Egyoldalas',
    tableShapeRectangular: 'Téglalap',
    tableShapeSquare: 'Négyzet',
    squareCapacityError: 'A négyzetalakú asztal kapacitásának oszthatónak kell lennie 4-gyel.',
  },
  it: {
    tableShape: 'Tipo di tavolo',
    tableShapeRound: 'Rotondo',
    tableShapeSingleSided: 'Monolaterale',
    tableShapeRectangular: 'Rettangolare',
    tableShapeSquare: 'Quadrato',
    squareCapacityError: 'La capienza di un tavolo quadrato deve essere divisibile per 4.',
  },
  lt: {
    tableShape: 'Stalo tipas',
    tableShapeRound: 'Apvalus',
    tableShapeSingleSided: 'Vienpusis',
    tableShapeRectangular: 'Stačiakampis',
    tableShapeSquare: 'Kvadratinis',
    squareCapacityError: 'Kvadratinio stalo talpa turi būti dalijama iš 4.',
  },
  lv: {
    tableShape: 'Galda tips',
    tableShapeRound: 'Apaļš',
    tableShapeSingleSided: 'Vienpusējs',
    tableShapeRectangular: 'Taisnstūris',
    tableShapeSquare: 'Kvadrāts',
    squareCapacityError: 'Kvadrātveida galda ietilpībai jādalās ar 4.',
  },
  mk: {
    tableShape: 'Тип на маса',
    tableShapeRound: 'Кругла',
    tableShapeSingleSided: 'Еднострана',
    tableShapeRectangular: 'Правоаголна',
    tableShapeSquare: 'Квадратна',
    squareCapacityError: 'Капацитетот на квадратна маса мора да биде делив со 4.',
  },
  mt: {
    tableShape: "Tip ta' mejda",
    tableShapeRound: 'Tonda',
    tableShapeSingleSided: "Ta' naħa waħda",
    tableShapeRectangular: 'Rettangolari',
    tableShapeSquare: 'Kwadrata',
    squareCapacityError: 'Il-kapacità ta\' mejda kwadrata trid tkun diviżibbli b\'4.',
  },
  nl: {
    tableShape: 'Tafeltype',
    tableShapeRound: 'Rond',
    tableShapeSingleSided: 'Eenzijdig',
    tableShapeRectangular: 'Rechthoekig',
    tableShapeSquare: 'Vierkant',
    squareCapacityError: 'De capaciteit van een vierkante tafel moet deelbaar zijn door 4.',
  },
  pl: {
    tableShape: 'Typ stołu',
    tableShapeRound: 'Okrągły',
    tableShapeSingleSided: 'Jednostronny',
    tableShapeRectangular: 'Prostokątny',
    tableShapeSquare: 'Kwadratowy',
    squareCapacityError: 'Pojemność stołu kwadratowego musi być podzielna przez 4.',
  },
  pt: {
    tableShape: 'Tipo de mesa',
    tableShapeRound: 'Redonda',
    tableShapeSingleSided: 'Unilateral',
    tableShapeRectangular: 'Retangular',
    tableShapeSquare: 'Quadrada',
    squareCapacityError: 'A capacidade de uma mesa quadrada deve ser divisível por 4.',
  },
  ro: {
    tableShape: 'Tip masă',
    tableShapeRound: 'Rotundă',
    tableShapeSingleSided: 'Unilaterală',
    tableShapeRectangular: 'Dreptunghiulară',
    tableShapeSquare: 'Pătrată',
    squareCapacityError: 'Capacitatea unei mese pătrate trebuie să fie divizibilă cu 4.',
  },
  sk: {
    tableShape: 'Typ stola',
    tableShapeRound: 'Okrúhly',
    tableShapeSingleSided: 'Jednostranný',
    tableShapeRectangular: 'Obdĺžnikový',
    tableShapeSquare: 'Štvorcový',
    squareCapacityError: 'Kapacita štvorcového stola musí byť deliteľná 4.',
  },
  sl: {
    tableShape: 'Tip mize',
    tableShapeRound: 'Okrogla',
    tableShapeSingleSided: 'Enostranska',
    tableShapeRectangular: 'Pravokotna',
    tableShapeSquare: 'Kvadratna',
    squareCapacityError: 'Kapaciteta kvadratne mize mora biti deljiva s 4.',
  },
  sq: {
    tableShape: 'Lloji i tavolinës',
    tableShapeRound: 'Rrethore',
    tableShapeSingleSided: 'Njëanëshme',
    tableShapeRectangular: 'Drejtkëndore',
    tableShapeSquare: 'Katror',
    squareCapacityError: 'Kapaciteti i tavolinës katrore duhet të jetë i pjestueshëm me 4.',
  },
  'sr-cy': {
    tableShape: 'Тип стола',
    tableShapeRound: 'Округли',
    tableShapeSingleSided: '\u0408\u0435\u0434\u043d\u043e\u0441\u0442\u0440\u0430\u043d\u0438',
    tableShapeRectangular: '\u041f\u0440\u0430\u0432\u043e\u0443\u0433\u0430\u043e\u043d\u0438',
    tableShapeSquare: '\u0427\u0435\u0442\u0432\u0440\u0442\u0430\u0441\u0442\u0438',
    squareCapacityError: '\u041a\u0430\u043f\u0430\u0446\u0438\u0442\u0435\u0442 \u0447\u0435\u0442\u0432\u0440\u0430\u0441\u0442\u043e\u0433 \u0441\u0442\u043e\u043b\u0430 \u043c\u043e\u0440\u0430 \u0431\u0438\u0442\u0438 \u0434\u0435\u0459\u0438\u0432 \u0441\u0430 4.',
  },
  sv: {
    tableShape: 'Bordstyp',
    tableShapeRound: 'Rund',
    tableShapeSingleSided: 'Ensidig',
    tableShapeRectangular: 'Rektangulärt',
    tableShapeSquare: 'Fyrkantigt',
    squareCapacityError: 'Kapaciteten för ett fyrkantigt bord måste vara delbar med 4.',
  },
  uk: {
    tableShape: 'Тип столу',
    tableShapeRound: 'Круглий',
    tableShapeSingleSided: 'Односторонній',
    tableShapeRectangular: 'Прямокутний',
    tableShapeSquare: 'Квадратний',
    squareCapacityError: 'Місткість квадратного столу має бути кратною 4.',
  },
};

const TARGET_LOCALES = Object.keys(TABLE_SHAPE_TRANSLATIONS);

for (const locale of TARGET_LOCALES) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.assign(data.seating, TABLE_SHAPE_TRANSLATIONS[locale]);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${TARGET_LOCALES.length} locale files.`);
