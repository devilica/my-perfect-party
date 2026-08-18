import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { formatDisplayDate, formatDisplayDateTime } from '@/lib/dateUtils';
import { getGuestsAtTable, getTablesForEvent } from '@/lib/seatingStats';
import type { Language } from '@/types/models';
import {
  getGuestFullName,
  Guest,
  SeatingTable,
  WeddingEvent,
} from '@/types/models';

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export type ExportSeatingListInput = {
  eventId: string;
  language: Language;
  t: TranslateFn;
  events: WeddingEvent[];
  guests: Guest[];
  tables: SeatingTable[];
};

export type ExportSeatingListResult = 'shared' | 'printed' | 'unavailable' | 'failed';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isArrivalGuest(guest: Guest): boolean {
  return guest.attendanceStatus !== 'declined';
}

function guestLine(guest: Guest, t: TranslateFn): string {
  const name = escapeHtml(getGuestFullName(guest));
  if (guest.partySize <= 1) return name;
  return `${name} <span class="plus">${escapeHtml(t('seating.listPlusOnes', { count: guest.partySize - 1 }))}</span>`;
}

function buildSeatingListHtml(input: ExportSeatingListInput): string | null {
  const { eventId, language, t, events, guests, tables } = input;
  const event = events.find((item) => item.id === eventId);
  if (!event) return null;

  const eventTables = getTablesForEvent(tables, eventId);
  const eventGuests = guests.filter((guest) => guest.eventId === eventId && isArrivalGuest(guest));

  const dateLabel = event.date
    ? formatDisplayDateTime(event.date, language) || formatDisplayDate(event.date, language)
    : '';

  const columns =
    eventTables.length <= 4 ? 2 : eventTables.length <= 10 ? 3 : 4;

  const tableCards = eventTables
    .map((table) => {
      const atTable = getGuestsAtTable(eventGuests, table.id);
      const people = atTable.reduce((sum, guest) => sum + guest.partySize, 0);
      const names =
        atTable.length > 0
          ? atTable.map((guest) => `<li>${guestLine(guest, t)}</li>`).join('')
          : `<li class="empty">${escapeHtml(t('seating.listEmptyTable'))}</li>`;

      return `<article class="table-card">
        <header>
          <h2>${escapeHtml(table.name)}</h2>
          <p>${escapeHtml(t('seating.seatsOccupiedValue', { occupied: people, total: table.capacity }))}</p>
        </header>
        <ol>${names}</ol>
      </article>`;
    })
    .join('');

  const directory = eventGuests
    .filter((guest) => guest.tableId)
    .map((guest) => {
      const table = eventTables.find((item) => item.id === guest.tableId);
      return {
        name: getGuestFullName(guest),
        tableName: table?.name ?? '',
        plus: guest.partySize > 1 ? guest.partySize - 1 : 0,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, language))
    .map((row) => {
      const plus =
        row.plus > 0
          ? ` <span class="plus">${escapeHtml(t('seating.listPlusOnes', { count: row.plus }))}</span>`
          : '';
      return `<li><span class="dir-name">${escapeHtml(row.name)}${plus}</span><span class="dir-dots"></span><span class="dir-table">${escapeHtml(row.tableName)}</span></li>`;
    })
    .join('');

  const location = event.location?.trim()
    ? `<span class="dot">·</span><span>${escapeHtml(event.location)}</span>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(event.name)} — ${escapeHtml(t('seating.listTitle'))}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #251B19;
      background: #FFF8F4;
      font-family: Georgia, 'Times New Roman', serif;
    }
    .page {
      min-height: 100%;
      padding: 18px 22px 20px;
      background: #FFF8F4;
    }
    .brand {
      text-align: center;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-size: 10px;
      color: #C9686F;
      font-family: 'Segoe UI', sans-serif;
      margin: 0 0 4px;
    }
    h1 {
      margin: 0;
      text-align: center;
      font-size: 28px;
      color: #861E2B;
      font-weight: 700;
    }
    .subtitle {
      margin: 4px 0 0;
      text-align: center;
      font-size: 13px;
      color: #655D59;
      font-family: 'Segoe UI', sans-serif;
    }
    .meta {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 6px;
      font-size: 12px;
      color: #655D59;
      font-family: 'Segoe UI', sans-serif;
    }
    .rule {
      height: 1px;
      margin: 14px auto 16px;
      max-width: 280px;
      background: linear-gradient(90deg, transparent, #D5A36A, transparent);
    }
    .tables {
      column-count: ${columns};
      column-gap: 14px;
    }
    .table-card {
      break-inside: avoid;
      page-break-inside: avoid;
      background: #FFFCFA;
      border: 1px solid #F2C5C1;
      border-top: 3px solid #C9686F;
      border-radius: 10px;
      padding: 10px 12px 8px;
      margin: 0 0 12px;
    }
    .table-card h2 {
      margin: 0;
      font-size: 16px;
      color: #861E2B;
    }
    .table-card header p {
      margin: 2px 0 8px;
      font-size: 10px;
      color: #655D59;
      font-family: 'Segoe UI', sans-serif;
    }
    .table-card ol {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .table-card li {
      padding: 3px 0;
      border-bottom: 1px dotted #F2C5C1;
      font-size: 12px;
      line-height: 1.35;
    }
    .table-card li:last-child { border-bottom: none; }
    .plus { color: #C9686F; font-weight: 700; font-size: 11px; }
    .empty { color: #655D59; font-style: italic; }
    .directory {
      margin-top: 18px;
      padding-top: 10px;
      border-top: 1px solid #F2C5C1;
    }
    .directory h3 {
      margin: 0 0 8px;
      text-align: center;
      font-size: 14px;
      color: #861E2B;
    }
    .directory ol {
      column-count: ${Math.min(columns + 1, 4)};
      column-gap: 18px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-family: 'Segoe UI', sans-serif;
      font-size: 11px;
    }
    .directory li {
      display: flex;
      align-items: baseline;
      gap: 6px;
      break-inside: avoid;
      padding: 2px 0;
    }
    .dir-name { color: #251B19; }
    .dir-dots {
      flex: 1;
      border-bottom: 1px dotted #D48680;
      min-width: 12px;
      transform: translateY(-3px);
    }
    .dir-table { color: #B92F43; font-weight: 700; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="page">
    <p class="brand">${escapeHtml(t('app.name'))}</p>
    <h1>${escapeHtml(event.name)}</h1>
    <p class="subtitle">${escapeHtml(t('seating.listFindTable'))}</p>
    <div class="meta">
      ${dateLabel ? `<span>${escapeHtml(dateLabel)}</span>` : ''}
      ${location}
    </div>
    <div class="rule"></div>
    ${
      tableCards
        ? `<section class="tables">${tableCards}</section>`
        : `<p class="empty">${escapeHtml(t('seating.emptyTitle'))}</p>`
    }
    ${
      directory
        ? `<section class="directory">
            <h3>${escapeHtml(t('seating.listDirectory'))}</h3>
            <ol>${directory}</ol>
          </section>`
        : ''
    }
  </div>
</body>
</html>`;
}

export async function exportSeatingListPdf(
  input: ExportSeatingListInput
): Promise<ExportSeatingListResult> {
  try {
    const html = buildSeatingListHtml(input);
    if (!html) return 'failed';

    if (Platform.OS === 'web') {
      await Print.printAsync({ html });
      return 'printed';
    }

    const file = await Print.printToFileAsync({ html });
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) return 'unavailable';

    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: input.t('seating.downloadList'),
    });

    return 'shared';
  } catch {
    return 'failed';
  }
}
