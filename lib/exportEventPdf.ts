import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { isPredefinedCategory } from '@/constants/categories';
import { DEFAULT_TABLE_SHAPE, normalizeTableShape } from '@/constants/tableShapes';
import { buildHallPreviewSvgHtml } from '@/lib/buildHallPreviewSvg';
import { formatDisplayDate, formatDisplayDateTime } from '@/lib/dateUtils';
import { formatAmount, getExpenseSummary } from '@/lib/expenseStats';
import { getGuestStats, getGuestsForEvent, sortGuests } from '@/lib/guestStats';
import { getObligationStats, getObligationsForEvent } from '@/lib/obligationStats';
import {
  getGuestsAtTable,
  getSeatingStats,
  getTableOccupiedSeats,
  getTablesForEvent,
} from '@/lib/seatingStats';
import type { Language } from '@/types/models';
import {
  Expense,
  getGuestFullName,
  Guest,
  Obligation,
  ObligationStatus,
  SeatingTable,
  TableShape,
  WeddingEvent,
} from '@/types/models';

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export type ExportEventPdfInput = {
  eventId: string;
  language: Language;
  t: TranslateFn;
  events: WeddingEvent[];
  guests: Guest[];
  tables: SeatingTable[];
  expenses: Expense[];
  obligations: Obligation[];
};

export type ExportEventPdfResult = 'shared' | 'printed' | 'unavailable' | 'failed';

const TABLE_SHAPE_KEYS: Record<TableShape, string> = {
  round: 'seating.tableShapeRound',
  singleSided: 'seating.tableShapeSingleSided',
  rectangular: 'seating.tableShapeRectangular',
  square: 'seating.tableShapeSquare',
};

const OBLIGATION_STATUS_KEYS: Record<ObligationStatus, string> = {
  not_scheduled: 'obligations.status.notScheduled',
  scheduled: 'obligations.status.scheduled',
  confirmed: 'obligations.status.confirmed',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function textOrDash(value: string | undefined, t: TranslateFn): string {
  const trimmed = value?.trim();
  return trimmed ? escapeHtml(trimmed) : escapeHtml(t('common.none'));
}

function categoryLabel(category: string, t: TranslateFn): string {
  const trimmed = category.trim();
  if (!trimmed) return escapeHtml(t('common.none'));
  if (isPredefinedCategory(trimmed)) return escapeHtml(t(`categories.${trimmed}`));
  return escapeHtml(trimmed);
}

function buildEventHtml(input: ExportEventPdfInput): string | null {
  const { eventId, language, t, events, guests, tables, expenses, obligations } = input;
  const event = events.find((item) => item.id === eventId);
  if (!event) return null;

  const eventGuests = sortGuests(getGuestsForEvent(guests, eventId), 'name_asc');
  const eventTables = getTablesForEvent(tables, eventId);
  const eventExpenses = expenses.filter((item) => item.eventId === eventId);
  const eventObligations = getObligationsForEvent(obligations, eventId);

  const guestStats = getGuestStats(guests, eventId);
  const seatingStats = getSeatingStats(tables, guests, eventId);
  const expenseSummary = getExpenseSummary(expenses, eventId);
  const obligationStats = getObligationStats(obligations, eventId);

  const tableNameById = new Map(eventTables.map((table) => [table.id, table.name]));

  const dateLabel = event.date
    ? escapeHtml(formatDisplayDateTime(event.date, language) || formatDisplayDate(event.date, language))
    : escapeHtml(t('common.none'));

  const guestRows = eventGuests
    .map((guest) => {
      const tableName = guest.tableId ? tableNameById.get(guest.tableId) : undefined;
      return `<tr>
        <td>${escapeHtml(getGuestFullName(guest))}</td>
        <td>${guest.partySize}</td>
        <td>${textOrDash(guest.phone, t)}</td>
        <td>${textOrDash(guest.category, t)}</td>
        <td>${escapeHtml(t(`guests.status.${guest.attendanceStatus}`))}</td>
        <td>${textOrDash(tableName, t)}</td>
        <td>${textOrDash(guest.note, t)}</td>
      </tr>`;
    })
    .join('');

  const hallPreviewHtml = buildHallPreviewSvgHtml(
    eventTables,
    guests,
    t('seating.hallOverviewTitle'),
    t('seating.previewOccupied'),
    t('seating.previewFree')
  );

  const seatingBlocks = eventTables
    .map((table) => {
      const shape = normalizeTableShape(table.shape ?? DEFAULT_TABLE_SHAPE);
      const occupied = getTableOccupiedSeats(guests, table.id);
      const assignedGuests = getGuestsAtTable(guests, table.id);
      const assignedHtml = assignedGuests.length
        ? `<ul class="guest-list">${assignedGuests
            .map(
              (guest) =>
                `<li>${escapeHtml(getGuestFullName(guest))} (${guest.partySize})</li>`
            )
            .join('')}</ul>`
        : `<p>${escapeHtml(t('common.none'))}</p>`;

      return `<div class="block">
        <h3>${escapeHtml(table.name)}</h3>
        <p>${escapeHtml(t(TABLE_SHAPE_KEYS[shape]))} · ${escapeHtml(
          t('seating.occupied', { occupied, capacity: table.capacity })
        )}</p>
        ${assignedHtml}
      </div>`;
    })
    .join('');

  const expenseRows = eventExpenses
    .map((expense) => {
      const covered = expense.coveredByOther
        ? escapeHtml(
            expense.payerName?.trim()
              ? t('expenses.coveredBy', { name: expense.payerName.trim() })
              : t('overview.coveredByOthers')
          )
        : escapeHtml(t('expenses.yourExpense'));

      return `<tr>
        <td>${escapeHtml(expense.title)}</td>
        <td>${escapeHtml(formatAmount(expense.amount))}</td>
        <td>${categoryLabel(expense.category, t)}</td>
        <td>${covered}</td>
      </tr>`;
    })
    .join('');

  const obligationRows = eventObligations
    .map((obligation) => {
      const dateValue = obligation.date
        ? escapeHtml(formatDisplayDate(obligation.date, language))
        : escapeHtml(t('common.none'));

      return `<tr>
        <td>${escapeHtml(obligation.title)}</td>
        <td>${dateValue}</td>
        <td>${escapeHtml(t(OBLIGATION_STATUS_KEYS[obligation.status]))}</td>
        <td>${textOrDash(obligation.contact, t)}</td>
        <td>${textOrDash(obligation.note, t)}</td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(event.name)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #222; padding: 24px; font-size: 12px; line-height: 1.45; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h2 { font-size: 16px; margin: 28px 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    h3 { font-size: 13px; margin: 0 0 4px; }
    p { margin: 4px 0; }
    .meta p { margin: 2px 0; }
    .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-top: 12px; }
    .block { margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
    .guest-list { margin: 4px 0 0; padding-left: 18px; }
    .guest-list li { margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #f5f5f5; font-weight: 600; }
    .empty { color: #777; font-style: italic; }
    .hall-preview { margin: 12px 0 20px; page-break-inside: avoid; }
    .hall-preview h3 { margin-bottom: 8px; }
    .hall-legend { margin-top: 8px; color: #555; font-size: 11px; }
    .hall-legend .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
    .hall-legend .dot.occupied { background: #B85C5C; }
    .hall-legend .dot.free { background: #9BB59A; }
  </style>
</head>
<body>
  <h1>${escapeHtml(event.name)}</h1>
  <div class="meta">
    <p><strong>${escapeHtml(t('events.dateTime'))}:</strong> ${dateLabel}</p>
    <p><strong>${escapeHtml(t('events.location'))}:</strong> ${textOrDash(event.location, t)}</p>
    <p><strong>${escapeHtml(t('events.theme'))}:</strong> ${escapeHtml(t(`events.themes.${event.theme}`))}</p>
  </div>

  <h2>${escapeHtml(t('overview.title'))}</h2>
  <div class="summary">
    <p><strong>${escapeHtml(t('overview.totalPeople'))}:</strong> ${guestStats.totalPeople}</p>
    <p><strong>${escapeHtml(t('overview.confirmedPeople'))}:</strong> ${guestStats.confirmedPeople}</p>
    <p><strong>${escapeHtml(t('overview.confirmationRate'))}:</strong> ${guestStats.confirmationRate}%</p>
    <p><strong>${escapeHtml(t('overview.tablesTotal'))}:</strong> ${seatingStats.totalTables}</p>
    <p><strong>${escapeHtml(t('overview.totalExpenses'))}:</strong> ${escapeHtml(formatAmount(expenseSummary.total))}</p>
    <p><strong>${escapeHtml(t('overview.yourShare'))}:</strong> ${escapeHtml(formatAmount(expenseSummary.yourShare))}</p>
    <p><strong>${escapeHtml(t('overview.coveredByOthers'))}:</strong> ${escapeHtml(formatAmount(expenseSummary.coveredByOthers))}</p>
    <p><strong>${escapeHtml(t('overview.obligationCompletionRate'))}:</strong> ${obligationStats.completionRate}%</p>
  </div>

  <h2>${escapeHtml(t('guests.title'))}</h2>
  ${
    guestRows
      ? `<table>
    <thead>
      <tr>
        <th>${escapeHtml(t('guests.firstName'))} / ${escapeHtml(t('guests.lastName'))}</th>
        <th>${escapeHtml(t('guests.partySize'))}</th>
        <th>${escapeHtml(t('guests.phone'))}</th>
        <th>${escapeHtml(t('guests.category'))}</th>
        <th>${escapeHtml(t('overview.attendanceChartTitle'))}</th>
        <th>${escapeHtml(t('tabs.seating'))}</th>
        <th>${escapeHtml(t('guests.note'))}</th>
      </tr>
    </thead>
    <tbody>${guestRows}</tbody>
  </table>`
      : `<p class="empty">${escapeHtml(t('guests.emptyTitle'))}</p>`
  }

  <h2>${escapeHtml(t('seating.title'))}</h2>
  ${hallPreviewHtml}
  ${seatingBlocks || `<p class="empty">${escapeHtml(t('seating.emptyTitle'))}</p>`}

  <h2>${escapeHtml(t('expenses.title'))}</h2>
  ${
    expenseRows
      ? `<table>
    <thead>
      <tr>
        <th>${escapeHtml(t('expenses.expenseTitle'))}</th>
        <th>${escapeHtml(t('expenses.amount'))}</th>
        <th>${escapeHtml(t('expenses.category'))}</th>
        <th>${escapeHtml(t('overview.coveredByOthers'))}</th>
      </tr>
    </thead>
    <tbody>${expenseRows}</tbody>
  </table>`
      : `<p class="empty">${escapeHtml(t('expenses.emptyTitle'))}</p>`
  }

  <h2>${escapeHtml(t('obligations.title'))}</h2>
  ${
    obligationRows
      ? `<table>
    <thead>
      <tr>
        <th>${escapeHtml(t('obligations.titleLabel'))}</th>
        <th>${escapeHtml(t('obligations.date'))}</th>
        <th>${escapeHtml(t('obligations.statusLabel'))}</th>
        <th>${escapeHtml(t('obligations.contact'))}</th>
        <th>${escapeHtml(t('obligations.note'))}</th>
      </tr>
    </thead>
    <tbody>${obligationRows}</tbody>
  </table>`
      : `<p class="empty">${escapeHtml(t('obligations.emptyTitle'))}</p>`
  }
</body>
</html>`;
}

export async function exportEventPdf(input: ExportEventPdfInput): Promise<ExportEventPdfResult> {
  try {
    const html = buildEventHtml(input);
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
      dialogTitle: input.t('events.exportPdf'),
    });

    return 'shared';
  } catch {
    return 'failed';
  }
}
