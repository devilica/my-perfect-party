import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const SEATING_OCCUPANCY_TRANSLATIONS = {
  bg: {
    seatsOccupied: 'Заети места',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Свободни места',
    viewHall: 'Виж залата',
  },
  bs: {
    seatsOccupied: 'Popunjenost mjesta',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Slobodna mjesta',
    viewHall: 'Vidi salu',
  },
  cs: {
    seatsOccupied: 'Obsazená místa',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Volná místa',
    viewHall: 'Zobrazit sál',
  },
  da: {
    seatsOccupied: 'Optagede pladser',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Ledige pladser',
    viewHall: 'Se salen',
  },
  de: {
    seatsOccupied: 'Belegte Plätze',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Freie Plätze',
    viewHall: 'Saal ansehen',
  },
  el: {
    seatsOccupied: 'Κατειλημμένες θέσεις',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Ελεύθερες θέσεις',
    viewHall: 'Δείτε την αίθουσα',
  },
  es: {
    seatsOccupied: 'Asientos ocupados',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Asientos libres',
    viewHall: 'Ver salón',
  },
  et: {
    seatsOccupied: 'Hõivatud kohad',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Vabad kohad',
    viewHall: 'Vaata saali',
  },
  fi: {
    seatsOccupied: 'Varatut paikat',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Vapaat paikat',
    viewHall: 'Näytä sali',
  },
  fr: {
    seatsOccupied: 'Places occupées',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Places libres',
    viewHall: 'Voir la salle',
  },
  ga: {
    seatsOccupied: 'Suíocháin líonta',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Suíocháin saora',
    viewHall: 'Féach ar an halla',
  },
  hr: {
    seatsOccupied: 'Popunjenost mjesta',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Slobodna mjesta',
    viewHall: 'Vidi dvoranu',
  },
  hu: {
    seatsOccupied: 'Foglalt helyek',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Szabad helyek',
    viewHall: 'Terem megtekintése',
  },
  it: {
    seatsOccupied: 'Posti occupati',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Posti liberi',
    viewHall: 'Vedi sala',
  },
  lt: {
    seatsOccupied: 'Užimtos vietos',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Laisvos vietos',
    viewHall: 'Žiūrėti salę',
  },
  lv: {
    seatsOccupied: 'Aizņemtās vietas',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Brīvās vietas',
    viewHall: 'Skatīt zāli',
  },
  mk: {
    seatsOccupied: 'Зафатени места',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Слободни места',
    viewHall: 'Види ја салата',
  },
  mt: {
    seatsOccupied: 'Postijiet okkupati',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Postijiet liberi',
    viewHall: 'Ara s-sala',
  },
  nl: {
    seatsOccupied: 'Bezette plaatsen',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Vrije plaatsen',
    viewHall: 'Bekijk zaal',
  },
  pl: {
    seatsOccupied: 'Zajęte miejsca',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Wolne miejsca',
    viewHall: 'Zobacz salę',
  },
  pt: {
    seatsOccupied: 'Lugares ocupados',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Lugares livres',
    viewHall: 'Ver salão',
  },
  ro: {
    seatsOccupied: 'Locuri ocupate',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Locuri libere',
    viewHall: 'Vezi sala',
  },
  sk: {
    seatsOccupied: 'Obsadené miesta',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Voľné miesta',
    viewHall: 'Zobraziť sálu',
  },
  sl: {
    seatsOccupied: 'Zasedena mesta',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Prosta mesta',
    viewHall: 'Poglej dvorano',
  },
  sq: {
    seatsOccupied: 'Vende të zëna',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Vende të lira',
    viewHall: 'Shiko sallën',
  },
  'sr-cy': {
    seatsOccupied: 'Попуњеност места',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: '\u0421\u043b\u043e\u0431\u043e\u0434\u043d\u0430 \u043c\u0435\u0441\u0442\u0430',
    viewHall: '\u0412\u0438\u0434\u0438 \u0441\u0430\u043b\u0443',
  },
  sv: {
    seatsOccupied: 'Upptagna platser',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Lediga platser',
    viewHall: 'Visa salen',
  },
  uk: {
    seatsOccupied: 'Зайняті місця',
    seatsOccupiedValue: '{{occupied}} / {{total}}',
    seatsFree: 'Вільні місця',
    viewHall: 'Дивитися зал',
  },
};

const TARGET_LOCALES = Object.keys(SEATING_OCCUPANCY_TRANSLATIONS);

for (const locale of TARGET_LOCALES) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.assign(data.seating, SEATING_OCCUPANCY_TRANSLATIONS[locale]);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Updated ${locale}.json`);
}

console.log(`Done. Updated ${TARGET_LOCALES.length} locale files.`);
