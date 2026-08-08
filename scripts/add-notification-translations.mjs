import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const localesDir = join(import.meta.dirname, '..', 'locales');

const translations = {
  bg: {
    settings: {
      notificationsTitle: 'Напомняния',
      notificationsHint:
        'Локални напомняния 7 дни, 24 часа и 1 час преди събитието, според часа на телефона ви.',
      notificationsPermissionDenied:
        'Разрешението за известия не е дадено. Активирайте го в системните настройки.',
      notificationsUnsupported:
        'Напомнянията работят в инсталираното приложение, не в Expo Go.',
    },
    notifications: {
      channelName: 'Напомняния',
      obligationTodayTitle: 'Задача днес',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Задача утре',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Остават 7 дни',
      event7DaysBody: '{{eventName}} след 7 дни',
      event24HoursTitle: 'Утре е празникът',
      event24HoursBody: '{{eventName}} след 24 часа',
      event1HourTitle: 'Скоро започва',
      event1HourBody: '{{eventName}} след 1 час',
    },
  },
  cs: {
    settings: {
      notificationsTitle: 'Připomínky',
      notificationsHint:
        'Místní připomínky 7 dní, 24 hodin a 1 hodinu před událostí podle času v telefonu.',
      notificationsPermissionDenied:
        'Oprávnění k oznámením nebylo uděleno. Zapněte ho v nastavení systému.',
      notificationsUnsupported:
        'Připomínky fungují v nainstalované aplikaci, ne v Expo Go.',
    },
    notifications: {
      channelName: 'Připomínky',
      obligationTodayTitle: 'Úkol dnes',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Úkol zítra',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Zbývá 7 dní',
      event7DaysBody: '{{eventName}} za 7 dní',
      event24HoursTitle: 'Zítra je oslava',
      event24HoursBody: '{{eventName}} za 24 hodin',
      event1HourTitle: 'Brzy začíná',
      event1HourBody: '{{eventName}} za 1 hodinu',
    },
  },
  da: {
    settings: {
      notificationsTitle: 'Påmindelser',
      notificationsHint:
        'Lokale påmindelser 7 dage, 24 timer og 1 time før begivenheden, efter telefonens tid.',
      notificationsPermissionDenied:
        'Tilladelse til meddelelser blev ikke givet. Aktivér den i systemindstillingerne.',
      notificationsUnsupported:
        'Påmindelser virker i den installerede app, ikke i Expo Go.',
    },
    notifications: {
      channelName: 'Påmindelser',
      obligationTodayTitle: 'Opgave i dag',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Opgave i morgen',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: '7 dage tilbage',
      event7DaysBody: '{{eventName}} om 7 dage',
      event24HoursTitle: 'I morgen er det fest',
      event24HoursBody: '{{eventName}} om 24 timer',
      event1HourTitle: 'Starter snart',
      event1HourBody: '{{eventName}} om 1 time',
    },
  },
  de: {
    settings: {
      notificationsTitle: 'Erinnerungen',
      notificationsHint:
        'Lokale Erinnerungen 7 Tage, 24 Stunden und 1 Stunde vor dem Event, nach der Uhrzeit deines Telefons.',
      notificationsPermissionDenied:
        'Benachrichtigungsberechtigung wurde nicht erteilt. Aktiviere sie in den Systemeinstellungen.',
      notificationsUnsupported:
        'Erinnerungen funktionieren in der installierten App, nicht in Expo Go.',
    },
    notifications: {
      channelName: 'Erinnerungen',
      obligationTodayTitle: 'Aufgabe heute',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Aufgabe morgen',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Noch 7 Tage',
      event7DaysBody: '{{eventName}} in 7 Tagen',
      event24HoursTitle: 'Morgen ist Feier',
      event24HoursBody: '{{eventName}} in 24 Stunden',
      event1HourTitle: 'Beginnt bald',
      event1HourBody: '{{eventName}} in 1 Stunde',
    },
  },
  el: {
    settings: {
      notificationsTitle: 'Υπενθυμίσεις',
      notificationsHint:
        'Τοπικές υπενθυμίσεις 7 ημέρες, 24 ώρες και 1 ώρα πριν την εκδήλωση, σύμφωνα με την ώρα του τηλεφώνου.',
      notificationsPermissionDenied:
        'Δεν δόθηκε άδεια ειδοποιήσεων. Ενεργοποιήστε την στις ρυθμίσεις συστήματος.',
      notificationsUnsupported:
        'Οι υπενθυμίσεις λειτουργούν στην εγκατεστημένη εφαρμογή, όχι στο Expo Go.',
    },
    notifications: {
      channelName: 'Υπενθυμίσεις',
      obligationTodayTitle: 'Εργασία σήμερα',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Εργασία αύριο',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Απομένουν 7 ημέρες',
      event7DaysBody: '{{eventName}} σε 7 ημέρες',
      event24HoursTitle: 'Αύριο είναι η γιορτή',
      event24HoursBody: '{{eventName}} σε 24 ώρες',
      event1HourTitle: 'Ξεκινά σύντομα',
      event1HourBody: '{{eventName}} σε 1 ώρα',
    },
  },
  es: {
    settings: {
      notificationsTitle: 'Recordatorios',
      notificationsHint:
        'Recordatorios locales 7 días, 24 horas y 1 hora antes del evento, según la hora de tu teléfono.',
      notificationsPermissionDenied:
        'No se concedió permiso de notificaciones. Actívalo en los ajustes del sistema.',
      notificationsUnsupported:
        'Los recordatorios funcionan en la app instalada, no en Expo Go.',
    },
    notifications: {
      channelName: 'Recordatorios',
      obligationTodayTitle: 'Tarea hoy',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Tarea mañana',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Quedan 7 días',
      event7DaysBody: '{{eventName}} en 7 días',
      event24HoursTitle: 'Mañana es la fiesta',
      event24HoursBody: '{{eventName}} en 24 horas',
      event1HourTitle: 'Empieza pronto',
      event1HourBody: '{{eventName}} en 1 hora',
    },
  },
  et: {
    settings: {
      notificationsTitle: 'Meeldetuletused',
      notificationsHint:
        'Kohalikud meeldetuletused 7 päeva, 24 tundi ja 1 tund enne sündmust, telefoni aja järgi.',
      notificationsPermissionDenied:
        'Teavituste luba ei antud. Luba see süsteemi seadetes.',
      notificationsUnsupported:
        'Meeldetuletused töötavad installitud rakenduses, mitte Expo Go-s.',
    },
    notifications: {
      channelName: 'Meeldetuletused',
      obligationTodayTitle: 'Ülesanne täna',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Ülesanne homme',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Jäänud 7 päeva',
      event7DaysBody: '{{eventName}} 7 päeva pärast',
      event24HoursTitle: 'Homme on pidu',
      event24HoursBody: '{{eventName}} 24 tunni pärast',
      event1HourTitle: 'Algab varsti',
      event1HourBody: '{{eventName}} 1 tunni pärast',
    },
  },
  fi: {
    settings: {
      notificationsTitle: 'Muistutukset',
      notificationsHint:
        'Paikalliset muistutukset 7 päivää, 24 tuntia ja 1 tunti ennen tapahtumaa puhelimen ajan mukaan.',
      notificationsPermissionDenied:
        'Ilmoituslupaa ei myönnetty. Ota se käyttöön järjestelmäasetuksissa.',
      notificationsUnsupported:
        'Muistutukset toimivat asennetussa sovelluksessa, eivät Expo Go:ssa.',
    },
    notifications: {
      channelName: 'Muistutukset',
      obligationTodayTitle: 'Tehtävä tänään',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Tehtävä huomenna',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: '7 päivää jäljellä',
      event7DaysBody: '{{eventName}} 7 päivän kuluttua',
      event24HoursTitle: 'Huomenna on juhla',
      event24HoursBody: '{{eventName}} 24 tunnin kuluttua',
      event1HourTitle: 'Alkaa pian',
      event1HourBody: '{{eventName}} 1 tunnin kuluttua',
    },
  },
  fr: {
    settings: {
      notificationsTitle: 'Rappels',
      notificationsHint:
        'Rappels locaux 7 jours, 24 heures et 1 heure avant l’événement, selon l’heure du téléphone.',
      notificationsPermissionDenied:
        'L’autorisation de notification n’a pas été accordée. Activez-la dans les réglages système.',
      notificationsUnsupported:
        'Les rappels fonctionnent dans l’app installée, pas dans Expo Go.',
    },
    notifications: {
      channelName: 'Rappels',
      obligationTodayTitle: 'Tâche aujourd’hui',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Tâche demain',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Plus que 7 jours',
      event7DaysBody: '{{eventName}} dans 7 jours',
      event24HoursTitle: 'Demain, c’est la fête',
      event24HoursBody: '{{eventName}} dans 24 heures',
      event1HourTitle: 'Ça commence bientôt',
      event1HourBody: '{{eventName}} dans 1 heure',
    },
  },
  ga: {
    settings: {
      notificationsTitle: 'Meabhrúcháin',
      notificationsHint:
        'Meabhrúcháin áitiúla 7 lá, 24 uair agus 1 uair roimh an ócáid, de réir ama do ghutháin.',
      notificationsPermissionDenied:
        'Níor deonadh cead fógraí. Cumasaigh é i socruithe an chórais.',
      notificationsUnsupported:
        'Oibríonn meabhrúcháin san aip suiteáilte, ní in Expo Go.',
    },
    notifications: {
      channelName: 'Meabhrúcháin',
      obligationTodayTitle: 'Tasc inniu',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Tasc amárach',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: '7 lá fágtha',
      event7DaysBody: '{{eventName}} i 7 lá',
      event24HoursTitle: 'Amárach an ceiliúradh',
      event24HoursBody: '{{eventName}} i 24 uair',
      event1HourTitle: 'Ag tosú go luath',
      event1HourBody: '{{eventName}} i 1 uair',
    },
  },
  hr: {
    settings: {
      notificationsTitle: 'Podsjetnici',
      notificationsHint:
        'Lokalni podsjetnici 7 dana, 24 sata i 1 sat prije događaja, prema vremenu na tvom telefonu.',
      notificationsPermissionDenied:
        'Dozvola za obavijesti nije dana. Uključi je u postavkama telefona.',
      notificationsUnsupported:
        'Podsjetnici rade u instaliranoj aplikaciji, ne u Expo Go-u.',
    },
    notifications: {
      channelName: 'Podsjetnici',
      obligationTodayTitle: 'Obaveza danas',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Obaveza sutra',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Još sedam dana',
      event7DaysBody: '{{eventName}} za 7 dana',
      event24HoursTitle: 'Sutra je proslava',
      event24HoursBody: '{{eventName}} za 24 sata',
      event1HourTitle: 'Uskoro počinje',
      event1HourBody: '{{eventName}} za 1 sat',
    },
  },
  hu: {
    settings: {
      notificationsTitle: 'Emlékeztetők',
      notificationsHint:
        'Helyi emlékeztetők 7 nappal, 24 órával és 1 órával az esemény előtt, a telefon ideje szerint.',
      notificationsPermissionDenied:
        'Az értesítési engedély nem lett megadva. Kapcsold be a rendszerbeállításokban.',
      notificationsUnsupported:
        'Az emlékeztetők a telepített alkalmazásban működnek, Expo Go-ban nem.',
    },
    notifications: {
      channelName: 'Emlékeztetők',
      obligationTodayTitle: 'Feladat ma',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Feladat holnap',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Még 7 nap',
      event7DaysBody: '{{eventName}} 7 nap múlva',
      event24HoursTitle: 'Holnap az ünnep',
      event24HoursBody: '{{eventName}} 24 óra múlva',
      event1HourTitle: 'Hamarosan kezdődik',
      event1HourBody: '{{eventName}} 1 óra múlva',
    },
  },
  it: {
    settings: {
      notificationsTitle: 'Promemoria',
      notificationsHint:
        'Promemoria locali 7 giorni, 24 ore e 1 ora prima dell’evento, secondo l’ora del telefono.',
      notificationsPermissionDenied:
        'Permesso notifiche non concesso. Attivalo nelle impostazioni di sistema.',
      notificationsUnsupported:
        'I promemoria funzionano nell’app installata, non in Expo Go.',
    },
    notifications: {
      channelName: 'Promemoria',
      obligationTodayTitle: 'Compito oggi',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Compito domani',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Mancano 7 giorni',
      event7DaysBody: '{{eventName}} tra 7 giorni',
      event24HoursTitle: 'Domani è la festa',
      event24HoursBody: '{{eventName}} tra 24 ore',
      event1HourTitle: 'Inizia presto',
      event1HourBody: '{{eventName}} tra 1 ora',
    },
  },
  lt: {
    settings: {
      notificationsTitle: 'Priminimai',
      notificationsHint:
        'Vietiniai priminimai 7 dienos, 24 val. ir 1 val. prieš įvykį pagal telefono laiką.',
      notificationsPermissionDenied:
        'Pranešimų leidimas nesuteiktas. Įjunkite jį sistemos nustatymuose.',
      notificationsUnsupported:
        'Priminimai veikia įdieigtoje programoje, ne Expo Go.',
    },
    notifications: {
      channelName: 'Priminimai',
      obligationTodayTitle: 'Užduotis šiandien',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Užduotis rytoj',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Liko 7 dienos',
      event7DaysBody: '{{eventName}} po 7 dienų',
      event24HoursTitle: 'Rytoj šventė',
      event24HoursBody: '{{eventName}} po 24 val.',
      event1HourTitle: 'Netrukus prasideda',
      event1HourBody: '{{eventName}} po 1 val.',
    },
  },
  lv: {
    settings: {
      notificationsTitle: 'Atgādinājumi',
      notificationsHint:
        'Vietējie atgādinājumi 7 dienas, 24 stundas un 1 stundu pirms pasākuma pēc tālruņa laika.',
      notificationsPermissionDenied:
        'Paziņojumu atļauja nav piešķirta. Iespējojiet to sistēmas iestatījumos.',
      notificationsUnsupported:
        'Atgādinājumi darbojas instalētajā lietotnē, ne Expo Go.',
    },
    notifications: {
      channelName: 'Atgādinājumi',
      obligationTodayTitle: 'Uzdevums šodien',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Uzdevums rīt',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Atlikušas 7 dienas',
      event7DaysBody: '{{eventName}} pēc 7 dienām',
      event24HoursTitle: 'Rīt ir svinības',
      event24HoursBody: '{{eventName}} pēc 24 stundām',
      event1HourTitle: 'Drīz sāksies',
      event1HourBody: '{{eventName}} pēc 1 stundas',
    },
  },
  mk: {
    settings: {
      notificationsTitle: 'Потсетници',
      notificationsHint:
        'Локални потсетници 7 дена, 24 часа и 1 час пред настанот, според времето на телефонот.',
      notificationsPermissionDenied:
        'Дозволата за известувања не е дадена. Вклучете ја во системските поставки.',
      notificationsUnsupported:
        'Потсетниците работат во инсталираната апликација, не во Expo Go.',
    },
    notifications: {
      channelName: 'Потсетници',
      obligationTodayTitle: 'Обврска денес',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Обврска утре',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Уште 7 дена',
      event7DaysBody: '{{eventName}} за 7 дена',
      event24HoursTitle: 'Утре е прославата',
      event24HoursBody: '{{eventName}} за 24 часа',
      event1HourTitle: 'Наскоро започнува',
      event1HourBody: '{{eventName}} за 1 час',
    },
  },
  mt: {
    settings: {
      notificationsTitle: 'Tfakkirija',
      notificationsHint:
        'Tfakkirija lokali 7 ijiem, 24 siegħa u siegħa 1 qabel l-avveniment, skond il-ħin tat-telefon.',
      notificationsPermissionDenied:
        'Permess ta’ notifiki mhux mogħti. Attivah fil-settings tas-sistema.',
      notificationsUnsupported:
        'It-tfakkirija jaħdmu fl-app installata, mhux f’Expo Go.',
    },
    notifications: {
      channelName: 'Tfakkirija',
      obligationTodayTitle: 'Compitu llum',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Compitu għada',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Fadlu 7 ijiem',
      event7DaysBody: '{{eventName}} fi 7 ijiem',
      event24HoursTitle: 'Għada hi l-festa',
      event24HoursBody: '{{eventName}} fi 24 siegħa',
      event1HourTitle: 'Dalwaqt jibda',
      event1HourBody: '{{eventName}} fi siegħa 1',
    },
  },
  nl: {
    settings: {
      notificationsTitle: 'Herinneringen',
      notificationsHint:
        'Lokale herinneringen 7 dagen, 24 uur en 1 uur voor het evenement, volgens de tijd van je telefoon.',
      notificationsPermissionDenied:
        'Meldingstoestemming is niet verleend. Schakel deze in via systeeminstellingen.',
      notificationsUnsupported:
        'Herinneringen werken in de geïnstalleerde app, niet in Expo Go.',
    },
    notifications: {
      channelName: 'Herinneringen',
      obligationTodayTitle: 'Taak vandaag',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Taak morgen',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Nog 7 dagen',
      event7DaysBody: '{{eventName}} over 7 dagen',
      event24HoursTitle: 'Morgen is het feest',
      event24HoursBody: '{{eventName}} over 24 uur',
      event1HourTitle: 'Begint binnenkort',
      event1HourBody: '{{eventName}} over 1 uur',
    },
  },
  pl: {
    settings: {
      notificationsTitle: 'Przypomnienia',
      notificationsHint:
        'Lokalne przypomnienia 7 dni, 24 godziny i 1 godzinę przed wydarzeniem, według czasu telefonu.',
      notificationsPermissionDenied:
        'Nie udzielono zgody na powiadomienia. Włącz ją w ustawieniach systemu.',
      notificationsUnsupported:
        'Przypomnienia działają w zainstalowanej aplikacji, nie w Expo Go.',
    },
    notifications: {
      channelName: 'Przypomnienia',
      obligationTodayTitle: 'Zadanie dziś',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Zadanie jutro',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Zostało 7 dni',
      event7DaysBody: '{{eventName}} za 7 dni',
      event24HoursTitle: 'Jutro impreza',
      event24HoursBody: '{{eventName}} za 24 godziny',
      event1HourTitle: 'Wkrótce start',
      event1HourBody: '{{eventName}} za 1 godzinę',
    },
  },
  pt: {
    settings: {
      notificationsTitle: 'Lembretes',
      notificationsHint:
        'Lembretes locais 7 dias, 24 horas e 1 hora antes do evento, conforme a hora do telemóvel.',
      notificationsPermissionDenied:
        'Permissão de notificações não concedida. Ative-a nas definições do sistema.',
      notificationsUnsupported:
        'Os lembretes funcionam na app instalada, não no Expo Go.',
    },
    notifications: {
      channelName: 'Lembretes',
      obligationTodayTitle: 'Tarefa hoje',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Tarefa amanhã',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Faltam 7 dias',
      event7DaysBody: '{{eventName}} em 7 dias',
      event24HoursTitle: 'Amanhã é a festa',
      event24HoursBody: '{{eventName}} em 24 horas',
      event1HourTitle: 'Começa em breve',
      event1HourBody: '{{eventName}} em 1 hora',
    },
  },
  ro: {
    settings: {
      notificationsTitle: 'Memento-uri',
      notificationsHint:
        'Memento-uri locale cu 7 zile, 24 de ore și 1 oră înainte de eveniment, după ora telefonului.',
      notificationsPermissionDenied:
        'Permisiunea pentru notificări nu a fost acordată. Activeaz-o în setările sistemului.',
      notificationsUnsupported:
        'Memento-urile funcționează în aplicația instalată, nu în Expo Go.',
    },
    notifications: {
      channelName: 'Memento-uri',
      obligationTodayTitle: 'Sarcină azi',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Sarcină mâine',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Mai sunt 7 zile',
      event7DaysBody: '{{eventName}} peste 7 zile',
      event24HoursTitle: 'Mâine e petrecerea',
      event24HoursBody: '{{eventName}} peste 24 de ore',
      event1HourTitle: 'Începe curând',
      event1HourBody: '{{eventName}} peste 1 oră',
    },
  },
  sk: {
    settings: {
      notificationsTitle: 'Pripomienky',
      notificationsHint:
        'Miestne pripomienky 7 dní, 24 hodín a 1 hodinu pred udalosťou podľa času v telefóne.',
      notificationsPermissionDenied:
        'Povolenie na upozornenia nebolo udelené. Zapnite ho v nastaveniach systému.',
      notificationsUnsupported:
        'Pripomienky fungujú v nainštalovanej aplikácii, nie v Expo Go.',
    },
    notifications: {
      channelName: 'Pripomienky',
      obligationTodayTitle: 'Úloha dnes',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Úloha zajtra',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Zostáva 7 dní',
      event7DaysBody: '{{eventName}} o 7 dní',
      event24HoursTitle: 'Zajtra je oslava',
      event24HoursBody: '{{eventName}} o 24 hodín',
      event1HourTitle: 'Čoskoro začína',
      event1HourBody: '{{eventName}} o 1 hodinu',
    },
  },
  sl: {
    settings: {
      notificationsTitle: 'Opomniki',
      notificationsHint:
        'Lokalni opomniki 7 dni, 24 ur in 1 uro pred dogodkom, glede na čas telefona.',
      notificationsPermissionDenied:
        'Dovoljenje za obvestila ni bilo podeljeno. Omogočite ga v sistemskih nastavitvah.',
      notificationsUnsupported:
        'Opomniki delujejo v nameščeni aplikaciji, ne v Expo Go.',
    },
    notifications: {
      channelName: 'Opomniki',
      obligationTodayTitle: 'Naloga danes',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Naloga jutri',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Še 7 dni',
      event7DaysBody: '{{eventName}} čez 7 dni',
      event24HoursTitle: 'Jutri je praznovanje',
      event24HoursBody: '{{eventName}} čez 24 ur',
      event1HourTitle: 'Kmalu se začne',
      event1HourBody: '{{eventName}} čez 1 uro',
    },
  },
  sq: {
    settings: {
      notificationsTitle: 'Kujtesat',
      notificationsHint:
        'Kujtesa lokale 7 ditë, 24 orë dhe 1 orë para eventit, sipas kohës së telefonit.',
      notificationsPermissionDenied:
        'Leja për njoftime nuk u dha. Aktivizoje në cilësimet e sistemit.',
      notificationsUnsupported:
        'Kujtesat funksionojnë në aplikacionin e instaluar, jo në Expo Go.',
    },
    notifications: {
      channelName: 'Kujtesat',
      obligationTodayTitle: 'Detyrë sot',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Detyrë nesër',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Edhe 7 ditë',
      event7DaysBody: '{{eventName}} pas 7 ditësh',
      event24HoursTitle: 'Nesër është festa',
      event24HoursBody: '{{eventName}} pas 24 orësh',
      event1HourTitle: 'Fillon së shpejti',
      event1HourBody: '{{eventName}} pas 1 ore',
    },
  },
  sr: {
    settings: {
      notificationsTitle: 'Podsetnici',
      notificationsHint:
        'Lokalni podsetnici 7 dana, 24 sata i 1 sat pre događaja, prema vremenu na tvom telefonu.',
      notificationsPermissionDenied:
        'Dozvola za obaveštenja nije data. Uključi je u podešavanjima telefona.',
      notificationsUnsupported:
        'Podsetnici rade u instaliranoj aplikaciji, ne u Expo Go-u.',
    },
    notifications: {
      channelName: 'Podsetnici',
      obligationTodayTitle: 'Obaveza danas',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Obaveza sutra',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Još sedam dana',
      event7DaysBody: '{{eventName}} za 7 dana',
      event24HoursTitle: 'Sutra je proslava',
      event24HoursBody: '{{eventName}} za 24 sata',
      event1HourTitle: 'Uskoro počinje',
      event1HourBody: '{{eventName}} za 1 sat',
    },
  },
  'sr-cy': {
    settings: {
      notificationsTitle: 'Подсетници',
      notificationsHint:
        'Локални подсетници 7 дана, 24 сата и 1 sat пре догађаја, према vremenu на tvom telefonu.',
      notificationsPermissionDenied:
        'Dozvola za obaveštenja nije data. Uključi je u podešavanjima telefona.',
      notificationsUnsupported:
        'Podsetnici rade u instaliranoj aplikaciji, ne u Expo Go-u.',
    },
    notifications: {
      channelName: 'Подсетници',
      obligationTodayTitle: 'Обавеза данас',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Обавеза сутра',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Још sedam dana',
      event7DaysBody: '{{eventName}} za 7 dana',
      event24HoursTitle: 'Sutra je proslava',
      event24HoursBody: '{{eventName}} za 24 sata',
      event1HourTitle: 'Uskoro počinje',
      event1HourBody: '{{eventName}} za 1 sat',
    },
  },
  sv: {
    settings: {
      notificationsTitle: 'Påminnelser',
      notificationsHint:
        'Lokala påminnelser 7 dagar, 24 timmar och 1 timme före eventet, enligt telefonens tid.',
      notificationsPermissionDenied:
        'Aviseringstillstånd gavs inte. Aktivera det i systeminställningarna.',
      notificationsUnsupported:
        'Påminnelser fungerar i den installerade appen, inte i Expo Go.',
    },
    notifications: {
      channelName: 'Påminnelser',
      obligationTodayTitle: 'Uppgift idag',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Uppgift imorgon',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: '7 dagar kvar',
      event7DaysBody: '{{eventName}} om 7 dagar',
      event24HoursTitle: 'Imorgon är festen',
      event24HoursBody: '{{eventName}} om 24 timmar',
      event1HourTitle: 'Börjar snart',
      event1HourBody: '{{eventName}} om 1 timme',
    },
  },
  uk: {
    settings: {
      notificationsTitle: 'Нагадування',
      notificationsHint:
        'Локальні нагадування за 7 днів, 24 години та 1 годину до події, за часом телефона.',
      notificationsPermissionDenied:
        'Дозволу на сповіщення не надано. Увімкніть його в системних налаштуваннях.',
      notificationsUnsupported:
        'Нагадування працюють у встановленому додатку, не в Expo Go.',
    },
    notifications: {
      channelName: 'Нагадування',
      obligationTodayTitle: 'Завдання сьогодні',
      obligationTodayBody: '{{title}} — {{eventName}}',
      obligationTomorrowTitle: 'Завдання завтра',
      obligationTomorrowBody: '{{title}} — {{eventName}}',
      event7DaysTitle: 'Залишилось 7 днів',
      event7DaysBody: '{{eventName}} через 7 днів',
      event24HoursTitle: 'Завтра святкування',
      event24HoursBody: '{{eventName}} через 24 години',
      event1HourTitle: 'Незабаром почнеться',
      event1HourBody: '{{eventName}} через 1 годину',
    },
  },
};

function applyTranslations(localeCode, bundle) {
  const filePath = join(localesDir, `${localeCode}.json`);
  const json = JSON.parse(readFileSync(filePath, 'utf8'));

  json.settings = {
    ...json.settings,
    ...bundle.settings,
  };

  json.notifications = {
    ...bundle.notifications,
    event1DayTitle: bundle.notifications.event24HoursTitle,
    event1DayBody: bundle.notifications.event24HoursBody,
    eventTodayTitle: bundle.notifications.event1HourTitle,
    eventTodayBody: bundle.notifications.event1HourBody,
  };

  writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

for (const [localeCode, bundle] of Object.entries(translations)) {
  applyTranslations(localeCode, bundle);
}

console.log(`Updated notification translations in ${Object.keys(translations).length} locale files.`);
