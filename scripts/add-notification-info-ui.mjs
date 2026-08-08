import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const localesDir = join(import.meta.dirname, '..', 'locales');

const notificationUiLabels = {
  en: {
    notificationsLabel: 'Notifications',
    notificationsInfoTitle: 'Notifications',
    notificationsInfoMessage:
      'Local notifications on your device.\n\nEvents: 7 days, 24 hours, and 1 hour before the start (using your phone\'s time).\n\nTasks: 24 hours before and at the due time (noon if no time is set).',
  },
  bs: {
    notificationsLabel: 'Obavještenja',
    notificationsInfoTitle: 'Obavještenja',
    notificationsInfoMessage:
      'Lokalna obavještenja na tvom uređaju.\n\nDogađaji: 7 dana, 24 sata i 1 sat prije početka (prema vremenu na telefonu).\n\nObaveze: 24 sata prije i u vrijeme obaveze (podne ako nema sata).',
  },
  hr: {
    notificationsLabel: 'Obavijesti',
    notificationsInfoTitle: 'Obavijesti',
    notificationsInfoMessage:
      'Lokalne obavijesti na tvom uređaju.\n\nDogađaji: 7 dana, 24 sata i 1 sat prije početka (prema vremenu na telefonu).\n\nObaveze: 24 sata prije i u vrijeme obaveze (podne ako nema sata).',
  },
  sr: {
    notificationsLabel: 'Obaveštenja',
    notificationsInfoTitle: 'Obaveštenja',
    notificationsInfoMessage:
      'Lokalna obaveštenja na tvom uređaju.\n\nDogađaji: 7 dana, 24 sata i 1 sat pre početka (prema vremenu na telefonu).\n\nObaveze: 24 sata pre i u vreme obaveze (podne ako nema sata).',
  },
  'sr-cy': {
    notificationsLabel: 'Обавештења',
    notificationsInfoTitle: 'Обавештења',
    notificationsInfoMessage:
      'Локална обавештења на вашем уређају.\n\nДогађаји: 7 дана, 24 сата и 1 sat пре почетка (према vremenu na vašem telefonu).\n\nОбавезе: 24 sata пре и u terminu (podne ako nema sata).',
  },
  mk: {
    notificationsLabel: 'Известувања',
    notificationsInfoTitle: 'Известувања',
    notificationsInfoMessage:
      'Локални известувања на вашиот уред.\n\nНастани: 7 дена, 24 часа и 1 час пред почетокот (според времето на телефонот).\n\nОбврски: 24 часа пред и во времето на обврската (напладне ако нема час).',
  },
  sl: {
    notificationsLabel: 'Obvestila',
    notificationsInfoTitle: 'Obvestila',
    notificationsInfoMessage:
      'Lokalna obvestila na vaši napravi.\n\nDogodki: 7 dni, 24 ur in 1 uro pred začetkom (glede na čas telefona).\n\nObveznosti: 24 ur prej in ob času obveznosti (ob poldne, če ni ure).',
  },
  bg: {
    notificationsLabel: 'Известия',
    notificationsInfoTitle: 'Известия',
    notificationsInfoMessage:
      'Локални известия на устройството ви.\n\nСъбития: 7 дни, 24 часа и 1 час пред началото (според часа на телефона).\n\nЗадачи: 24 часа преди и в часа на задачата (обед, ако няма час).',
  },
  cs: {
    notificationsLabel: 'Oznámení',
    notificationsInfoTitle: 'Oznámení',
    notificationsInfoMessage:
      'Místní oznámení ve vašem zařízení.\n\nUdálosti: 7 dní, 24 hodin a 1 hodinu před začátkem (podle času v telefonu).\n\nÚkoly: 24 hodin předem a v čase splnění (poledne, pokud není uveden čas).',
  },
  da: {
    notificationsLabel: 'Meddelelser',
    notificationsInfoTitle: 'Meddelelser',
    notificationsInfoMessage:
      'Lokale meddelelser på din enhed.\n\nBegivenheder: 7 dage, 24 timer og 1 time før start (efter telefonens tid).\n\nOpgaver: 24 timer før og på forfaldstidspunktet (middag hvis intet klokkeslæt).',
  },
  de: {
    notificationsLabel: 'Benachrichtigungen',
    notificationsInfoTitle: 'Benachrichtigungen',
    notificationsInfoMessage:
      'Lokale Benachrichtigungen auf deinem Gerät.\n\nEvents: 7 Tage, 24 Stunden und 1 Stunde vor Beginn (nach der Uhrzeit deines Telefons).\n\nAufgaben: 24 Stunden vorher und zum Fälligkeitszeitpunkt (Mittag, wenn keine Uhrzeit gesetzt ist).',
  },
  el: {
    notificationsLabel: 'Ειδοποιήσεις',
    notificationsInfoTitle: 'Ειδοποιήσεις',
    notificationsInfoMessage:
      'Τοπικές ειδοποιήσεις στη συσκευή σας.\n\nΕκδηλώσεις: 7 ημέρες, 24 ώρες και 1 ώρα πριν την έναρξη (σύμφωνα με την ώρα του τηλεφώνου).\n\nΕργασίες: 24 ώρες πριν και την ώρα λήξης (μεσημέρι αν δεν έχει οριστεί ώρα).',
  },
  es: {
    notificationsLabel: 'Notificaciones',
    notificationsInfoTitle: 'Notificaciones',
    notificationsInfoMessage:
      'Notificaciones locales en tu dispositivo.\n\nEventos: 7 días, 24 horas y 1 hora antes del inicio (según la hora de tu teléfono).\n\nTareas: 24 horas antes y a la hora prevista (mediodía si no hay hora).',
  },
  et: {
    notificationsLabel: 'Teavitused',
    notificationsInfoTitle: 'Teavitused',
    notificationsInfoMessage:
      'Kohalikud teavitused sinu seadmes.\n\nSündmused: 7 päeva, 24 tundi ja 1 tund enne algust (telefoni aja järgi).\n\nÜlesanded: 24 tundi varem ja tähtajal (kell 12, kui kellaaega pole).',
  },
  fi: {
    notificationsLabel: 'Ilmoitukset',
    notificationsInfoTitle: 'Ilmoitukset',
    notificationsInfoMessage:
      'Paikalliset ilmoitukset laitteellasi.\n\nTapahtumat: 7 päivää, 24 tuntia ja 1 tunti ennen alkua (puhelimen ajan mukaan).\n\nTehtävät: 24 tuntia ennen ja määräaikana (keskipäivällä, jos aikaa ei ole).',
  },
  fr: {
    notificationsLabel: 'Notifications',
    notificationsInfoTitle: 'Notifications',
    notificationsInfoMessage:
      'Notifications locales sur votre appareil.\n\nÉvénements : 7 jours, 24 heures et 1 heure avant le début (selon l\'heure du téléphone).\n\nTâches : 24 heures avant et à l\'heure prévue (midi si aucune heure n\'est définie).',
  },
  ga: {
    notificationsLabel: 'Fógraí',
    notificationsInfoTitle: 'Fógraí',
    notificationsInfoMessage:
      'Fógraí áitiúla ar do ghléas.\n\nImeachtaí: 7 lá, 24 uair agus 1 uair roimh an tús (de réir ama do ghutháin).\n\nTascanna: 24 uair roimh ré agus ag an am dlite (meán lae mura bhfuil am socraithe).',
  },
  hu: {
    notificationsLabel: 'Értesítések',
    notificationsInfoTitle: 'Értesítések',
    notificationsInfoMessage:
      'Helyi értesítések az eszközödön.\n\nEsemények: 7 nappal, 24 órával és 1 órával a kezdés előtt (a telefon ideje szerint).\n\nFeladatok: 24 órával előtte és a határidőn (délben, ha nincs megadva idő).',
  },
  it: {
    notificationsLabel: 'Notifiche',
    notificationsInfoTitle: 'Notifiche',
    notificationsInfoMessage:
      'Notifiche locali sul tuo dispositivo.\n\nEventi: 7 giorni, 24 ore e 1 ora prima dell\'inizio (secondo l\'ora del telefono).\n\nCompiti: 24 ore prima e all\'orario previsto (mezzogiorno se non è impostata un\'ora).',
  },
  lt: {
    notificationsLabel: 'Pranešimai',
    notificationsInfoTitle: 'Pranešimai',
    notificationsInfoMessage:
      'Vietiniai pranešimai jūsų įrenginyje.\n\nĮvykiai: 7 dienos, 24 val. ir 1 val. prieš pradžią (pagal telefono laiką).\n\nUžduotys: 24 val. prieš ir termino metu (vidurdienį, jei nenurodyta valanda).',
  },
  lv: {
    notificationsLabel: 'Paziņojumi',
    notificationsInfoTitle: 'Paziņojumi',
    notificationsInfoMessage:
      'Lokālie paziņojumi jūsu ierīcē.\n\nPasākumi: 7 dienas, 24 stundas un 1 stunda pirms sākuma (pēc tālruņa laika).\n\nUzdevumi: 24 stundas iepriekš un termiņa laikā (pusdienlaiks, ja laiks nav norādīts).',
  },
  mt: {
    notificationsLabel: 'Notifiki',
    notificationsInfoTitle: 'Notifiki',
    notificationsInfoMessage:
      'Notifiki lokali fuq it-tagħmir tiegħek.\n\nAvvenimenti: 7 ijiem, 24 siegħa u siegħa 1 qabel il-bidu (skond il-ħin tat-telefon).\n\nKompiti: 24 siegħa qabel u fil-ħin skadenti (nofsinhar jekk m\'hemmx ħin).',
  },
  nl: {
    notificationsLabel: 'Meldingen',
    notificationsInfoTitle: 'Meldingen',
    notificationsInfoMessage:
      'Lokale meldingen op je apparaat.\n\nEvenementen: 7 dagen, 24 uur en 1 uur voor de start (volgens de tijd van je telefoon).\n\nTaken: 24 uur van tevoren en op het tijdstip (middag als er geen tijd is ingesteld).',
  },
  pl: {
    notificationsLabel: 'Powiadomienia',
    notificationsInfoTitle: 'Powiadomienia',
    notificationsInfoMessage:
      'Lokalne powiadomienia na Twoim urządzeniu.\n\nWydarzenia: 7 dni, 24 godziny i 1 godzinę przed rozpoczęciem (według czasu telefonu).\n\nZadania: 24 godziny wcześniej i w terminie (południe, jeśli nie ustawiono godziny).',
  },
  pt: {
    notificationsLabel: 'Notificações',
    notificationsInfoTitle: 'Notificações',
    notificationsInfoMessage:
      'Notificações locais no seu dispositivo.\n\nEventos: 7 dias, 24 horas e 1 hora antes do início (conforme a hora do telemóvel).\n\nTarefas: 24 horas antes e na hora prevista (meio-dia se não houver hora).',
  },
  ro: {
    notificationsLabel: 'Notificări',
    notificationsInfoTitle: 'Notificări',
    notificationsInfoMessage:
      'Notificări locale pe dispozitivul tău.\n\nEvenimente: 7 zile, 24 de ore și 1 oră înainte de început (după ora telefonului).\n\nSarcini: 24 de ore înainte și la termen (la prânz dacă nu este setată ora).',
  },
  sk: {
    notificationsLabel: 'Upozornenia',
    notificationsInfoTitle: 'Upozornenia',
    notificationsInfoMessage:
      'Lokálne upozornenia vo vašom zariadení.\n\nUdalosti: 7 dní, 24 hodín a 1 hodinu pred začiatkom (podľa času v telefóne).\n\nÚlohy: 24 hodín vopred a v čase splnenia (poludnie, ak nie je uvedený čas).',
  },
  sq: {
    notificationsLabel: 'Njoftime',
    notificationsInfoTitle: 'Njoftime',
    notificationsInfoMessage:
      'Njoftime lokale në pajisjen tuaj.\n\nNgjarje: 7 ditë, 24 orë dhe 1 orë para fillimit (sipas kohës së telefonit).\n\nDetyra: 24 orë para dhe në kohën e afatit (mesditë nëse nuk ka orë).',
  },
  sv: {
    notificationsLabel: 'Aviseringar',
    notificationsInfoTitle: 'Aviseringar',
    notificationsInfoMessage:
      'Lokala aviseringar på din enhet.\n\nHändelser: 7 dagar, 24 timmar och 1 timme före start (enligt telefonens tid).\n\nUppgifter: 24 timmar före och vid förfallotid (middag om ingen tid anges).',
  },
  uk: {
    notificationsLabel: 'Сповіщення',
    notificationsInfoTitle: 'Сповіщення',
    notificationsInfoMessage:
      'Локальні сповіщення на вашому пристрої.\n\nПодії: за 7 днів, 24 години та 1 годину до початку (за часом телефона).\n\nЗавдання: за 24 години та в час виконання (опівдні, якщо час не вказано).',
  },
};

for (const [localeCode, keys] of Object.entries(notificationUiLabels)) {
  const filePath = join(localesDir, `${localeCode}.json`);
  const json = JSON.parse(readFileSync(filePath, 'utf8'));
  json.settings = { ...json.settings, ...keys };
  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log(`Updated notification UI labels in ${Object.keys(notificationUiLabels).length} locale files.`);
