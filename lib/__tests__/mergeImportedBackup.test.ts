import {
  mergeImportedBackup,
  resolveUniqueEventName,
  type ImportedBackupSlice,
  type MergeCurrentState,
} from '@/lib/mergeImportedBackup';
import type { WeddingEvent } from '@/types/models';

const emptyCurrent: MergeCurrentState = {
  events: [],
  guests: [],
  tables: [],
  expenses: [],
  obligations: [],
  unlockedAppThemes: ['default', 'wedding'],
};

function makeEvent(overrides: Partial<WeddingEvent> & Pick<WeddingEvent, 'id' | 'name'>): WeddingEvent {
  return {
    theme: 'wedding',
    guestCategories: ['family'],
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('resolveUniqueEventName', () => {
  it('returns base name when free', () => {
    const taken = new Set<string>();
    expect(resolveUniqueEventName('Proslava', taken)).toBe('Proslava');
    expect(taken.has('proslava')).toBe(true);
  });

  it('adds (1) suffix on collision', () => {
    const taken = new Set(['proslava']);
    expect(resolveUniqueEventName('Proslava', taken)).toBe('Proslava (1)');
  });

  it('is case-insensitive for collisions', () => {
    const taken = new Set(['proslava']);
    expect(resolveUniqueEventName('PROSLAVA', taken)).toBe('PROSLAVA (1)');
  });
});

describe('mergeImportedBackup', () => {
  it('appends a single imported event when current is empty', () => {
    const imported: ImportedBackupSlice = {
      events: [makeEvent({ id: 'ev-old', name: 'Nova' })],
      guests: [],
      tables: [],
      expenses: [],
      obligations: [],
      unlockedAppThemes: ['birthday'],
    };

    const result = mergeImportedBackup(emptyCurrent, imported);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].name).toBe('Nova');
    expect(result.events[0].id).not.toBe('ev-old');
    expect(result.unlockedAppThemes).toContain('birthday');
  });

  it('renames imported event when name matches existing (case-insensitive)', () => {
    const current: MergeCurrentState = {
      ...emptyCurrent,
      events: [makeEvent({ id: 'keep', name: 'Proslava' })],
    };
    const imported: ImportedBackupSlice = {
      events: [makeEvent({ id: 'ev-old', name: 'proslava' })],
      guests: [],
      tables: [],
      expenses: [],
      obligations: [],
      unlockedAppThemes: [],
    };

    const result = mergeImportedBackup(current, imported);
    expect(result.events[0].name).toBe('proslava (1)');
  });

  it('assigns (1) and (2) for duplicate names within same import batch', () => {
    const imported: ImportedBackupSlice = {
      events: [
        makeEvent({ id: 'a', name: 'Party' }),
        makeEvent({ id: 'b', name: 'Party' }),
      ],
      guests: [],
      tables: [],
      expenses: [],
      obligations: [],
      unlockedAppThemes: [],
    };

    const result = mergeImportedBackup(emptyCurrent, imported);
    expect(result.events.map((e) => e.name)).toEqual(['Party', 'Party (1)']);
  });

  it('remaps guest and table ids to new event and table ids', () => {
    const imported: ImportedBackupSlice = {
      events: [makeEvent({ id: 'ev-old', name: 'Gala' })],
      tables: [
        {
          id: 'tbl-old',
          eventId: 'ev-old',
          name: 'Sto 1',
          capacity: 8,
          sortOrder: 0,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      guests: [
        {
          id: 'g-old',
          eventId: 'ev-old',
          firstName: 'Ana',
          lastName: 'A',
          category: 'family',
          attendanceStatus: 'confirmed',
          partySize: 2,
          tableId: 'tbl-old',
        },
      ],
      expenses: [],
      obligations: [],
      unlockedAppThemes: [],
    };

    const result = mergeImportedBackup(emptyCurrent, imported);
    const eventId = result.events[0].id;
    const tableId = result.tables[0].id;

    expect(result.tables[0].eventId).toBe(eventId);
    expect(result.tables[0].id).not.toBe('tbl-old');
    expect(result.guests[0].eventId).toBe(eventId);
    expect(result.guests[0].tableId).toBe(tableId);
    expect(result.guests[0].id).not.toBe('g-old');
  });
});
