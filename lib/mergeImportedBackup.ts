import { generateId } from '@/lib/generateId';
import {
  CelebrationThemeId,
  Expense,
  Guest,
  Obligation,
  SeatingTable,
  WeddingEvent,
} from '@/types/models';

export type ImportedBackupSlice = {
  events: WeddingEvent[];
  guests: Guest[];
  tables: SeatingTable[];
  expenses: Expense[];
  obligations: Obligation[];
  unlockedAppThemes: CelebrationThemeId[];
};

export type MergeCurrentState = {
  events: WeddingEvent[];
  guests: Guest[];
  tables: SeatingTable[];
  expenses: Expense[];
  obligations: Obligation[];
  unlockedAppThemes: CelebrationThemeId[];
};

export type MergedImportResult = {
  events: WeddingEvent[];
  guests: Guest[];
  tables: SeatingTable[];
  expenses: Expense[];
  obligations: Obligation[];
  unlockedAppThemes: CelebrationThemeId[];
};

function nameKey(name: string): string {
  return name.trim().toLowerCase();
}

/** Picks a display name not in `takenLowercase` (keys are lowercase trimmed). */
export function resolveUniqueEventName(baseName: string, takenLowercase: Set<string>): string {
  const trimmed = baseName.trim() || 'Event';
  const baseKey = nameKey(trimmed);

  if (!takenLowercase.has(baseKey)) {
    takenLowercase.add(baseKey);
    return trimmed;
  }

  let suffix = 1;
  while (suffix < 10_000) {
    const candidate = `${trimmed} (${suffix})`;
    const key = nameKey(candidate);
    if (!takenLowercase.has(key)) {
      takenLowercase.add(key);
      return candidate;
    }
    suffix += 1;
  }

  const fallback = `${trimmed} (${generateId().slice(0, 8)})`;
  takenLowercase.add(nameKey(fallback));
  return fallback;
}

function mergeUnlockedThemes(
  current: CelebrationThemeId[],
  imported: CelebrationThemeId[]
): CelebrationThemeId[] {
  const merged = [...current];
  for (const theme of imported) {
    if (!merged.includes(theme)) {
      merged.push(theme);
    }
  }
  return merged;
}

function remapEventId(
  eventId: string,
  eventIdMap: Map<string, string>,
  importedEventIds: Set<string>
): string | null {
  if (!importedEventIds.has(eventId)) {
    return null;
  }
  return eventIdMap.get(eventId) ?? null;
}

export function mergeImportedBackup(
  current: MergeCurrentState,
  imported: ImportedBackupSlice
): MergedImportResult {
  const takenNames = new Set(current.events.map((e) => nameKey(e.name)));

  const eventIdMap = new Map<string, string>();
  const importedEventIds = new Set<string>();

  const mergedEvents: WeddingEvent[] = imported.events.map((event) => {
    importedEventIds.add(event.id);
    const newId = generateId();
    eventIdMap.set(event.id, newId);
    return {
      ...event,
      id: newId,
      name: resolveUniqueEventName(event.name, takenNames),
    };
  });

  const tableIdMap = new Map<string, string>();
  const mergedTables: SeatingTable[] = [];

  for (const table of imported.tables) {
    const newEventId = remapEventId(table.eventId, eventIdMap, importedEventIds);
    if (!newEventId) continue;

    const newTableId = generateId();
    tableIdMap.set(table.id, newTableId);
    mergedTables.push({
      ...table,
      id: newTableId,
      eventId: newEventId,
    });
  }

  const mergedGuests: Guest[] = [];

  for (const guest of imported.guests) {
    const newEventId = remapEventId(guest.eventId, eventIdMap, importedEventIds);
    if (!newEventId) continue;

    let tableId = guest.tableId;
    if (tableId) {
      tableId = tableIdMap.get(tableId) ?? undefined;
    }

    mergedGuests.push({
      ...guest,
      id: generateId(),
      eventId: newEventId,
      tableId,
    });
  }

  const mergedExpenses: Expense[] = [];

  for (const expense of imported.expenses) {
    const newEventId = remapEventId(expense.eventId, eventIdMap, importedEventIds);
    if (!newEventId) continue;

    mergedExpenses.push({
      ...expense,
      id: generateId(),
      eventId: newEventId,
    });
  }

  const mergedObligations: Obligation[] = [];

  for (const obligation of imported.obligations) {
    const newEventId = remapEventId(obligation.eventId, eventIdMap, importedEventIds);
    if (!newEventId) continue;

    mergedObligations.push({
      ...obligation,
      id: generateId(),
      eventId: newEventId,
    });
  }

  return {
    events: mergedEvents,
    guests: mergedGuests,
    tables: mergedTables,
    expenses: mergedExpenses,
    obligations: mergedObligations,
    unlockedAppThemes: mergeUnlockedThemes(current.unlockedAppThemes, imported.unlockedAppThemes),
  };
}
