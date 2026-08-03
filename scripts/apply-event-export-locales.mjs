import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

/** @type {Record<string, { exportPdf: string; exportFailed: string; exportSharingUnavailable: string }>} */
const TRANSLATIONS = {
  bg: {
    exportPdf: 'Експорт в PDF',
    exportFailed: 'PDF файлът не можа да бъде експортиран. Опитайте отново.',
    exportSharingUnavailable: 'Споделянето не е налично на това устройство.',
  },
  bs: {
    exportPdf: 'Izvezi PDF',
    exportFailed: 'PDF se nije mogao izvesti. Pokušajte ponovo.',
    exportSharingUnavailable: 'Dijeljenje nije dostupno na ovom uređaju.',
  },
  cs: {
    exportPdf: 'Exportovat PDF',
    exportFailed: 'PDF se nepodařilo exportovat. Zkuste to znovu.',
    exportSharingUnavailable: 'Sdílení není na tomto zařízení dostupné.',
  },
  da: {
    exportPdf: 'Eksporter PDF',
    exportFailed: 'PDF kunne ikke eksporteres. Prøv igen.',
    exportSharingUnavailable: 'Deling er ikke tilgængelig på denne enhed.',
  },
  de: {
    exportPdf: 'PDF exportieren',
    exportFailed: 'PDF konnte nicht exportiert werden. Bitte erneut versuchen.',
    exportSharingUnavailable: 'Teilen ist auf diesem Gerät nicht verfügbar.',
  },
  el: {
    exportPdf: 'Εξαγωγή PDF',
    exportFailed: 'Δεν ήταν δυνατή η εξαγωγή του PDF. Δοκιμάστε ξανά.',
    exportSharingUnavailable: 'Η κοινή χρήση δεν είναι διαθέσιμη σε αυτή τη συσκευή.',
  },
  en: {
    exportPdf: 'Export PDF',
    exportFailed: 'Could not export the PDF. Please try again.',
    exportSharingUnavailable: 'Sharing is not available on this device.',
  },
  es: {
    exportPdf: 'Exportar PDF',
    exportFailed: 'No se pudo exportar el PDF. Inténtalo de nuevo.',
    exportSharingUnavailable: 'Compartir no está disponible en este dispositivo.',
  },
  et: {
    exportPdf: 'Ekspordi PDF',
    exportFailed: 'PDF-i ei õnnestunud eksportida. Proovi uuesti.',
    exportSharingUnavailable: 'Jagamine pole sellel seadmel saadaval.',
  },
  fi: {
    exportPdf: 'Vie PDF',
    exportFailed: 'PDF:ää ei voitu viedä. Yritä uudelleen.',
    exportSharingUnavailable: 'Jakaminen ei ole käytettävissä tällä laitteella.',
  },
  fr: {
    exportPdf: 'Exporter en PDF',
    exportFailed: "Impossible d'exporter le PDF. Veuillez réessayer.",
    exportSharingUnavailable: "Le partage n'est pas disponible sur cet appareil.",
  },
  ga: {
    exportPdf: 'Easpórtáil PDF',
    exportFailed: 'Níorbh fhéidir an PDF a easpórtáil. Bain triail eile as.',
    exportSharingUnavailable: 'Níl comhroinnt ar fáil ar an ngléas seo.',
  },
  hr: {
    exportPdf: 'Izvezi PDF',
    exportFailed: 'PDF se nije mogao izvesti. Pokušajte ponovo.',
    exportSharingUnavailable: 'Dijeljenje nije dostupno na ovom uređaju.',
  },
  hu: {
    exportPdf: 'PDF exportálása',
    exportFailed: 'A PDF exportálása nem sikerült. Próbálja újra.',
    exportSharingUnavailable: 'A megosztás nem érhető el ezen az eszközön.',
  },
  it: {
    exportPdf: 'Esporta PDF',
    exportFailed: 'Impossibile esportare il PDF. Riprova.',
    exportSharingUnavailable: 'La condivisione non è disponibile su questo dispositivo.',
  },
  lt: {
    exportPdf: 'Eksportuoti PDF',
    exportFailed: 'Nepavyko eksportuoti PDF. Bandykite dar kartą.',
    exportSharingUnavailable: 'Bendrinimas šiame įrenginyje nepasiekiamas.',
  },
  lv: {
    exportPdf: 'Eksportēt PDF',
    exportFailed: 'Neizdevās eksportēt PDF. Mēģiniet vēlreiz.',
    exportSharingUnavailable: 'Kopīgošana šajā ierīcē nav pieejama.',
  },
  mk: {
    exportPdf: 'Извези PDF',
    exportFailed: 'PDF не можеше да се извезе. Обидете се повторно.',
    exportSharingUnavailable: 'Споделувањето не е достапно на овој уред.',
  },
  mt: {
    exportPdf: 'Esporta PDF',
    exportFailed: 'Il-PDF ma setax jiġi esportat. Erġa’ pprova.',
    exportSharingUnavailable: 'Il-qsim mhux disponibbli fuq dan l-apparat.',
  },
  nl: {
    exportPdf: 'PDF exporteren',
    exportFailed: 'PDF kon niet worden geëxporteerd. Probeer het opnieuw.',
    exportSharingUnavailable: 'Delen is niet beschikbaar op dit apparaat.',
  },
  pl: {
    exportPdf: 'Eksportuj PDF',
    exportFailed: 'Nie udało się wyeksportować PDF. Spróbuj ponownie.',
    exportSharingUnavailable: 'Udostępnianie nie jest dostępne na tym urządzeniu.',
  },
  pt: {
    exportPdf: 'Exportar PDF',
    exportFailed: 'Não foi possível exportar o PDF. Tente novamente.',
    exportSharingUnavailable: 'A partilha não está disponível neste dispositivo.',
  },
  ro: {
    exportPdf: 'Exportă PDF',
    exportFailed: 'PDF-ul nu a putut fi exportat. Încercați din nou.',
    exportSharingUnavailable: 'Partajarea nu este disponibilă pe acest dispozitiv.',
  },
  sk: {
    exportPdf: 'Exportovať PDF',
    exportFailed: 'PDF sa nepodarilo exportovať. Skúste znova.',
    exportSharingUnavailable: 'Zdieľanie nie je na tomto zariadení dostupné.',
  },
  sl: {
    exportPdf: 'Izvozi PDF',
    exportFailed: 'PDF-ja ni bilo mogoče izvoziti. Poskusite znova.',
    exportSharingUnavailable: 'Skupna raba na tej napravi ni na voljo.',
  },
  sq: {
    exportPdf: 'Eksporto PDF',
    exportFailed: 'PDF nuk mund të eksportohej. Provoni përsëri.',
    exportSharingUnavailable: 'Ndarja nuk është e disponueshme në këtë pajisje.',
  },
  sr: {
    exportPdf: 'Izvezi PDF',
    exportFailed: 'PDF se nije mogao izvesti. Pokušajte ponovo.',
    exportSharingUnavailable: 'Deljenje nije dostupno na ovom uređaju.',
  },
  'sr-cy': {
    exportPdf: 'Извези PDF',
    exportFailed: 'PDF се није могао извести. Покушајте поново.',
    exportSharingUnavailable: 'Дељење није доступно на овом уређају.',
  },
  sv: {
    exportPdf: 'Exportera PDF',
    exportFailed: 'PDF kunde inte exporteras. Försök igen.',
    exportSharingUnavailable: 'Delning är inte tillgänglig på den här enheten.',
  },
  uk: {
    exportPdf: 'Експорт PDF',
    exportFailed: 'Не вдалося експортувати PDF. Спробуйте ще раз.',
    exportSharingUnavailable: 'Поширення недоступне на цьому пристрої.',
  },
};

let updated = 0;

for (const [locale, strings] of Object.entries(TRANSLATIONS)) {
  const filePath = path.join(localesDir, `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.events.exportPdf = strings.exportPdf;
  data.events.exportFailed = strings.exportFailed;
  data.events.exportSharingUnavailable = strings.exportSharingUnavailable;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  updated += 1;
}

console.log(`Updated event export strings in ${updated} locale files.`);
