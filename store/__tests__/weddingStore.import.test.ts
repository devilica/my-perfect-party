jest.mock('@/lib/notifications', () => ({
  syncAllNotifications: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import type { BackupData } from '@/lib/backup';
import { useWeddingStore } from '@/store/weddingStore';

function resetStore() {
  useWeddingStore.setState({
    events: [],
    guests: [],
    tables: [],
    expenses: [],
    obligations: [],
    language: 'bs',
    hasSelectedLanguage: true,
    appTheme: 'default',
    unlockedAppThemes: ['default', 'wedding'],
    backupEmail: '',
    guestSortByEvent: {},
    reviewPromptDone: false,
    notificationsEnabled: false,
    _hasHydrated: true,
  });
}

describe('weddingStore importBackupData', () => {
  beforeEach(() => {
    resetStore();
  });

  it('migrates legacy guest name and relationship on import', () => {
    const data: BackupData = {
      language: 'bs',
      events: [
        {
          id: 'ev1',
          name: 'Proslava',
          date: '2026-06-01',
          createdAt: '2026-01-01T00:00:00.000Z',
          guestCategories: ['family'],
        },
      ],
      guests: [
        {
          id: 'g1',
          eventId: 'ev1',
          name: 'Ana Marić',
          relationship: 'family',
          confirmed: true,
        },
      ],
      tables: [
        {
          id: 'tbl1',
          eventId: 'ev1',
          name: 'Sto 1',
          capacity: 8,
          sortOrder: 0,
          shape: 'square',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      expenses: [],
      obligations: [],
    };

    useWeddingStore.getState().importBackupData(data);

    const state = useWeddingStore.getState();
    const importedEvent = state.events.find((e) => e.name === 'Proslava');
    expect(importedEvent).toBeDefined();
    expect(state.guests[0]).toMatchObject({
      firstName: 'Ana',
      lastName: 'Marić',
      category: 'family',
      attendanceStatus: 'confirmed',
      eventId: importedEvent!.id,
    });
    expect(importedEvent!.guestCategories).toEqual(['family']);
    expect(state.tables[0].shape).toBe('square');
    expect(state.tables[0].eventId).toBe(importedEvent!.id);
  });

  it('normalizes eventId when stored as array', () => {
    const data: BackupData = {
      language: 'en',
      events: [
        {
          id: 'ev-array',
          name: 'Event',
          theme: 'wedding',
          guestCategories: ['family'],
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      guests: [
        {
          id: 'g2',
          eventId: ['ev-array'],
          firstName: 'Marko',
          lastName: 'Marković',
          category: 'friends',
          attendanceStatus: 'needs_invite',
          partySize: 1,
        },
      ],
      tables: [],
      expenses: [],
      obligations: [],
    };

    useWeddingStore.getState().importBackupData(data);
    const state = useWeddingStore.getState();
    const event = state.events.find((e) => e.name === 'Event');
    expect(event).toBeDefined();
    expect(state.guests[0].eventId).toBe(event!.id);
    expect(state.guests[0].eventId).not.toBe('ev-array');
  });

  it('merges with existing events and renames duplicate names', () => {
    useWeddingStore.setState({
      events: [
        {
          id: 'existing-ev',
          name: 'Proslava',
          theme: 'wedding',
          guestCategories: ['family'],
          createdAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    });

    const data: BackupData = {
      language: 'bs',
      events: [
        {
          id: 'import-ev',
          name: 'Proslava',
          theme: 'birthday',
          guestCategories: ['friends'],
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      guests: [],
      tables: [],
      expenses: [],
      obligations: [],
    };

    useWeddingStore.getState().importBackupData(data);

    const state = useWeddingStore.getState();
    expect(state.events).toHaveLength(2);
    expect(state.events.find((e) => e.id === 'existing-ev')?.name).toBe('Proslava');
    expect(state.events.find((e) => e.id !== 'existing-ev')?.name).toBe('Proslava (1)');
    expect(state.language).toBe('bs');
  });
});
