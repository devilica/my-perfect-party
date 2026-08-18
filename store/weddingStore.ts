import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_INVITATION_TEMPLATE_ID, getSuggestedFontColor } from '@/constants/invitationTemplates';
import { DEFAULT_GUEST_CATEGORIES, normalizeGuestCategories, normalizeGuestCategory } from '@/constants/guestCategories';
import { DEFAULT_GUEST_SORT, isGuestSort } from '@/constants/guestSort';
import { isLanguage } from '@/constants/languages';
import { normalizeAttendanceStatus } from '@/constants/guestAttendance';
import { normalizeTableShape } from '@/constants/tableShapes';
import { BackupData } from '@/lib/backup';
import { generateId } from '@/lib/generateId';
import { getDefaultLanguage, translate } from '@/lib/i18n';
import { syncAllNotifications } from '@/lib/notifications';
import {
  canAssignGuestToTable,
  getGuestsAtTable,
  getNextSeatOrder,
  getTablesForEvent,
} from '@/lib/seatingStats';
import {
  AttendanceStatus,
  BulkTableBatch,
  CelebrationThemeId,
  Guest,
  GuestSort,
  Language,
  SeatingTable,
  WeddingEvent,
  Expense,
  Obligation,
  ObligationStatus,
  EventInvitation,
} from '@/types/models';

type LegacyRelationship = 'family' | 'friend' | 'work' | 'other';

type LegacyGuest = {
  id: string;
  eventId: unknown;
  name?: string;
  firstName?: string;
  lastName?: string;
  confirmed?: boolean;
  attendanceStatus?: AttendanceStatus | 'pending';
  phone?: string;
  relationship?: LegacyRelationship;
  category?: string;
  partySize?: number;
  tableId?: string;
  seatOrder?: number;
  note?: string;
  createdAt?: string;
};

const RELATIONSHIP_TO_CATEGORY: Record<LegacyRelationship, string> = {
  family: 'family',
  friend: 'friends',
  work: 'work',
  other: 'other',
};

function normalizeEventId(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '');
  return String(value ?? '');
}

function resolveGuestCategory(raw: LegacyGuest): string {
  if (raw.category) return normalizeGuestCategory(raw.category);
  if (raw.relationship) return RELATIONSHIP_TO_CATEGORY[raw.relationship];
  return DEFAULT_GUEST_CATEGORIES[0];
}

type PersistedState = {
  events: Array<
    WeddingEvent & {
      theme?: CelebrationThemeId;
      guestCategories?: string[];
    }
  >;
  guests: LegacyGuest[];
  tables?: Array<Omit<SeatingTable, 'eventId'> & { eventId: unknown }>;
  expenses: Array<Omit<Expense, 'eventId'> & { eventId: unknown }>;
  obligations?: Array<Omit<Obligation, 'eventId'> & { eventId: unknown }>;
  language?: Language;
  hasSelectedLanguage?: boolean;
  localeVersion?: number;
  appTheme?: CelebrationThemeId;
  unlockedAppThemes?: CelebrationThemeId[];
  backupEmail?: string;
  lastBackupAt?: string;
  guestSortByEvent?: Record<string, GuestSort>;
  reviewPromptDone?: boolean;
  notificationsEnabled?: boolean;
};

const LOCALE_VERSION = 3;

function normalizePersistedLanguage(saved: PersistedState): Language {
  if (isLanguage(saved.language)) return saved.language;
  return getDefaultLanguage();
}

function migrateGuest(raw: LegacyGuest): Guest {
  if (raw.firstName && raw.lastName !== undefined) {
    return {
      id: raw.id,
      eventId: normalizeEventId(raw.eventId),
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      phone: raw.phone,
      category: resolveGuestCategory(raw),
      attendanceStatus: normalizeAttendanceStatus(raw.attendanceStatus, raw.confirmed),
      partySize: raw.partySize ?? 1,
      tableId: raw.tableId,
      seatOrder: typeof raw.seatOrder === 'number' ? raw.seatOrder : undefined,
      note: raw.note,
      createdAt: raw.createdAt,
    };
  }

  const nameParts = (raw.name ?? '').trim().split(/\s+/);
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ');

  return {
    id: raw.id,
    eventId: normalizeEventId(raw.eventId),
    firstName,
    lastName,
    phone: raw.phone,
    category: resolveGuestCategory(raw),
    attendanceStatus: normalizeAttendanceStatus(raw.attendanceStatus, raw.confirmed),
    partySize: raw.partySize ?? 1,
    tableId: raw.tableId,
    seatOrder: typeof raw.seatOrder === 'number' ? raw.seatOrder : undefined,
    note: raw.note,
    createdAt: raw.createdAt,
  };
}

function normalizeGuestSortByEvent(
  saved: Record<string, unknown> | undefined
): Record<string, GuestSort> {
  if (!saved || typeof saved !== 'object') return {};

  return Object.fromEntries(
    Object.entries(saved).filter((entry): entry is [string, GuestSort] =>
      isGuestSort(entry[1])
    )
  );
}

function normalizeAppTheme(value: unknown): CelebrationThemeId {
  const valid: CelebrationThemeId[] = [
    'default',
    'wedding',
    'birthday',
    'baptism',
    'newYear',
    'christmas',
    'graduation',
    'anniversary',
    'engagement',
    'other',
  ];
  if (typeof value === 'string' && valid.includes(value as CelebrationThemeId)) {
    return value as CelebrationThemeId;
  }
  return 'default';
}

const DEFAULT_UNLOCKED_APP_THEMES: CelebrationThemeId[] = ['default', 'wedding'];

const VALID_THEME_IDS: CelebrationThemeId[] = [
  'default',
  'wedding',
  'birthday',
  'baptism',
  'newYear',
  'christmas',
  'graduation',
  'anniversary',
  'engagement',
  'other',
];

function normalizeUnlockedAppThemes(
  saved: unknown,
  appTheme: CelebrationThemeId
): CelebrationThemeId[] {
  let themes = DEFAULT_UNLOCKED_APP_THEMES;

  if (Array.isArray(saved)) {
    const filtered = saved.filter(
      (id): id is CelebrationThemeId =>
        typeof id === 'string' && VALID_THEME_IDS.includes(id as CelebrationThemeId)
    );
    if (filtered.length > 0) {
      themes = filtered;
    }
  }

  if (!themes.includes('default')) {
    themes = ['default', ...themes];
  }

  if (!themes.includes('wedding')) {
    themes = ['wedding', ...themes];
  }

  if (!themes.includes(appTheme)) {
    themes = [...themes, appTheme];
  }

  return themes;
}

function normalizeImportedState(data: BackupData): {
  events: WeddingEvent[];
  guests: Guest[];
  tables: SeatingTable[];
  expenses: Expense[];
  obligations: Obligation[];
  language: Language;
  appTheme: CelebrationThemeId;
  unlockedAppThemes: CelebrationThemeId[];
} {
  const saved = data as PersistedState;
  const appTheme = normalizeAppTheme(saved.appTheme);

  return {
    language: saved.language ?? getDefaultLanguage(),
    appTheme,
    unlockedAppThemes: normalizeUnlockedAppThemes(saved.unlockedAppThemes, appTheme),
    events: (saved.events ?? []).map((raw) => {
      const { guestSides: _removed, ...event } = raw as WeddingEvent & { guestSides?: string[] };
      return {
        ...event,
        theme: (event.theme ?? 'wedding') as CelebrationThemeId,
        guestCategories: normalizeGuestCategories(
          event.guestCategories ?? [...DEFAULT_GUEST_CATEGORIES]
        ),
      };
    }),
    guests: (saved.guests ?? []).map(migrateGuest),
    tables: (saved.tables ?? []).map((table) => ({
      ...table,
      eventId: normalizeEventId(table.eventId),
      shape: normalizeTableShape(table.shape),
    })),
    expenses: (saved.expenses ?? []).map((expense) => ({
      ...expense,
      eventId: normalizeEventId(expense.eventId),
    })),
    obligations: (saved.obligations ?? []).map((obligation) => ({
      ...obligation,
      eventId: normalizeEventId(obligation.eventId),
      status: obligation.status ?? 'not_scheduled',
      sortOrder: obligation.sortOrder ?? 0,
    })),
  };
}

type WeddingState = {
  events: WeddingEvent[];
  guests: Guest[];
  tables: SeatingTable[];
  expenses: Expense[];
  obligations: Obligation[];
  language: Language;
  hasSelectedLanguage: boolean;
  appTheme: CelebrationThemeId;
  unlockedAppThemes: CelebrationThemeId[];
  backupEmail: string;
  lastBackupAt?: string;
  guestSortByEvent: Record<string, GuestSort>;
  reviewPromptDone: boolean;
  notificationsEnabled: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setLanguage: (language: Language) => void;
  confirmLanguageSelection: (language: Language) => void;
  setAppTheme: (themeId: CelebrationThemeId) => void;
  unlockAppTheme: (themeId: CelebrationThemeId) => void;
  isAppThemeUnlocked: (themeId: CelebrationThemeId) => boolean;
  setBackupEmail: (email: string) => void;
  markBackupCompleted: () => void;
  markReviewPromptDone: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  exportBackupData: () => BackupData;
  importBackupData: (data: BackupData) => void;
  addEvent: (
    data: Omit<WeddingEvent, 'id' | 'createdAt' | 'guestCategories'> & {
      guestCategories?: string[];
    }
  ) => string;
  updateEvent: (id: string, data: Partial<Omit<WeddingEvent, 'id' | 'createdAt'>>) => void;
  updateEventInvitation: (eventId: string, data: Partial<EventInvitation>) => void;
  deleteEvent: (id: string) => void;
  addGuestCategory: (eventId: string, name: string) => void;
  addGuest: (data: Omit<Guest, 'id' | 'createdAt'>) => string | null;
  updateGuest: (id: string, data: Partial<Omit<Guest, 'id' | 'eventId' | 'createdAt'>>) => boolean;
  deleteGuest: (id: string) => void;
  setGuestSort: (eventId: string, sort: GuestSort) => void;
  getGuestSort: (eventId: string) => GuestSort;
  setGuestAttendance: (id: string, status: AttendanceStatus) => void;
  assignGuestToTable: (guestId: string, tableId: string | null) => boolean;
  moveGuestAtTable: (guestId: string, direction: 'up' | 'down') => boolean;
  swapGuestsAtTable: (guestIdA: string, guestIdB: string) => boolean;
  isGuestDuplicate: (
    eventId: string,
    firstName: string,
    lastName: string,
    excludeId?: string
  ) => boolean;
  addTable: (data: Omit<SeatingTable, 'id' | 'createdAt' | 'sortOrder'>) => string;
  updateTable: (
    id: string,
    data: Partial<Omit<SeatingTable, 'id' | 'eventId' | 'createdAt'>>
  ) => void;
  deleteTable: (id: string) => void;
  bulkCreateTables: (eventId: string, batches: BulkTableBatch[]) => string[];
  addExpense: (data: Omit<Expense, 'id'>) => string;
  updateExpense: (id: string, data: Partial<Omit<Expense, 'id' | 'eventId'>>) => void;
  deleteExpense: (id: string) => void;
  addObligation: (data: Omit<Obligation, 'id' | 'sortOrder' | 'createdAt'>) => string;
  updateObligation: (
    id: string,
    data: Partial<Omit<Obligation, 'id' | 'eventId' | 'createdAt'>>
  ) => void;
  deleteObligation: (id: string) => void;
  setObligationStatus: (id: string, status: ObligationStatus) => void;
  addObligationTemplates: (eventId: string, titles: string[]) => number;
};

function triggerNotificationSync(get: () => WeddingState) {
  const state = get();
  void syncAllNotifications({
    enabled: state.notificationsEnabled,
    events: state.events,
    obligations: state.obligations,
    language: state.language,
  });
}

export const useWeddingStore = create<WeddingState>()(
  persist(
    (set, get) => ({
      events: [],
      guests: [],
      tables: [],
      expenses: [],
      obligations: [],
      language: getDefaultLanguage(),
      hasSelectedLanguage: false,
      appTheme: 'default' as CelebrationThemeId,
      unlockedAppThemes: [...DEFAULT_UNLOCKED_APP_THEMES],
      backupEmail: '',
      lastBackupAt: undefined,
      guestSortByEvent: {},
      reviewPromptDone: false,
      notificationsEnabled: false,
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setLanguage: (language) => {
        set({ language });
        triggerNotificationSync(get);
      },

      confirmLanguageSelection: (language) => {
        set({ language, hasSelectedLanguage: true });
        triggerNotificationSync(get);
      },

      setAppTheme: (appTheme) => set({ appTheme }),

      markReviewPromptDone: () => set({ reviewPromptDone: true }),

      setNotificationsEnabled: (enabled) => {
        set({ notificationsEnabled: enabled });
        triggerNotificationSync(get);
      },

      unlockAppTheme: (themeId) => {
        set((state) => {
          if (state.unlockedAppThemes.includes(themeId)) return state;
          return { unlockedAppThemes: [...state.unlockedAppThemes, themeId] };
        });
      },

      isAppThemeUnlocked: (themeId) => get().unlockedAppThemes.includes(themeId),

      setBackupEmail: (email) => set({ backupEmail: email.trim() }),

      markBackupCompleted: () => set({ lastBackupAt: new Date().toISOString() }),

      exportBackupData: () => {
        const state = get();
        return {
          events: state.events,
          guests: state.guests,
          tables: state.tables,
          expenses: state.expenses,
          obligations: state.obligations,
          language: state.language,
          appTheme: state.appTheme,
          unlockedAppThemes: state.unlockedAppThemes,
        };
      },

      importBackupData: (data) => {
        const normalized = normalizeImportedState(data);
        set(normalized);
        triggerNotificationSync(get);
      },

      addEvent: (data) => {
        const id = generateId();
        const event: WeddingEvent = {
          ...data,
          guestCategories: normalizeGuestCategories(
            data.guestCategories ?? [...DEFAULT_GUEST_CATEGORIES]
          ),
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ events: [event, ...state.events] }));
        triggerNotificationSync(get);
        return id;
      },

      addGuestCategory: (eventId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;

        set((state) => ({
          events: state.events.map((event) => {
            if (event.id !== eventId) return event;
            if (event.guestCategories.includes(trimmed)) return event;
            return {
              ...event,
              guestCategories: [...event.guestCategories, trimmed],
            };
          }),
        }));
      },

      updateEvent: (id, data) => {
        const normalizedData =
          data.guestCategories !== undefined
            ? {
                ...data,
                guestCategories: normalizeGuestCategories(data.guestCategories),
              }
            : data;

        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...normalizedData } : event
          ),
        }));
        triggerNotificationSync(get);
      },

      updateEventInvitation: (eventId, data) => {
        set((state) => ({
          events: state.events.map((event) => {
            if (event.id !== eventId) return event;
            const current = event.invitation;
            const merged: EventInvitation = {
              ...(current ?? {
                templateId: DEFAULT_INVITATION_TEMPLATE_ID,
                backgroundOpacity: 0.85,
                lineSpacing: 1,
                headerIcon: 'heart-outline',
                headerTitle: '',
                hostNames: event.name,
                namesFontFamily: 'script',
                fontSize: 36,
                fontColor: getSuggestedFontColor(DEFAULT_INVITATION_TEMPLATE_ID),
                eventDateText: '',
                subEvents: [],
                customTexts: [],
                rsvpMessage: '',
                watermarkRemoved: false,
                updatedAt: new Date().toISOString(),
              }),
              ...data,
              customTexts: data.customTexts ?? current?.customTexts ?? [],
              watermarkRemoved: data.watermarkRemoved ?? current?.watermarkRemoved ?? false,
              updatedAt: new Date().toISOString(),
            };
            return { ...event, invitation: merged };
          }),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          guests: state.guests.filter((guest) => guest.eventId !== id),
          tables: state.tables.filter((table) => table.eventId !== id),
          expenses: state.expenses.filter((expense) => expense.eventId !== id),
          obligations: state.obligations.filter((obligation) => obligation.eventId !== id),
        }));
        triggerNotificationSync(get);
      },

      addGuest: (data) => {
        const firstName = data.firstName.trim();
        const lastName = data.lastName.trim();
        if (!firstName) return null;
        if (get().isGuestDuplicate(data.eventId, firstName, lastName)) return null;

        const id = generateId();
        const guest: Guest = {
          ...data,
          id,
          firstName,
          lastName,
          partySize: Math.max(1, data.partySize),
          createdAt: new Date().toISOString(),
        };

        if (guest.tableId) {
          const table = get().tables.find((t) => t.id === guest.tableId);
          if (!table || !canAssignGuestToTable(guest, table, get().guests, guest.tableId)) {
            guest.tableId = undefined;
            guest.seatOrder = undefined;
          } else if (guest.seatOrder == null) {
            guest.seatOrder = getNextSeatOrder(get().guests, guest.tableId);
          }
        }

        set((state) => ({ guests: [...state.guests, guest] }));
        return id;
      },

      updateGuest: (id, data) => {
        const existing = get().guests.find((g) => g.id === id);
        if (!existing) return false;

        const firstName =
          data.firstName !== undefined ? data.firstName.trim() : existing.firstName;
        const lastName =
          data.lastName !== undefined ? data.lastName.trim() : existing.lastName;

        if (!firstName) return false;
        if (get().isGuestDuplicate(existing.eventId, firstName, lastName, id)) return false;

        const nextGuest: Guest = {
          ...existing,
          ...data,
          firstName,
          lastName,
          partySize: Math.max(1, data.partySize ?? existing.partySize),
        };

        if (!nextGuest.tableId) {
          nextGuest.seatOrder = undefined;
        } else {
          const table = get().tables.find((t) => t.id === nextGuest.tableId);
          if (
            !table ||
            !canAssignGuestToTable(nextGuest, table, get().guests, nextGuest.tableId)
          ) {
            return false;
          }
          if (existing.tableId !== nextGuest.tableId || nextGuest.seatOrder == null) {
            nextGuest.seatOrder = getNextSeatOrder(
              get().guests.filter((g) => g.id !== id),
              nextGuest.tableId
            );
          }
        }

        set((state) => ({
          guests: state.guests.map((guest) => (guest.id === id ? nextGuest : guest)),
        }));
        return true;
      },

      deleteGuest: (id) => {
        set((state) => ({
          guests: state.guests.filter((guest) => guest.id !== id),
        }));
      },

      setGuestSort: (eventId, sort) => {
        set((state) => ({
          guestSortByEvent: {
            ...state.guestSortByEvent,
            [eventId]: sort,
          },
        }));
      },

      getGuestSort: (eventId) => get().guestSortByEvent[eventId] ?? DEFAULT_GUEST_SORT,

      setGuestAttendance: (id, status) => {
        set((state) => ({
          guests: state.guests.map((guest) =>
            guest.id === id ? { ...guest, attendanceStatus: status } : guest
          ),
        }));
      },

      assignGuestToTable: (guestId, tableId) => {
        const guest = get().guests.find((g) => g.id === guestId);
        if (!guest) return false;

        if (!tableId) {
          set((state) => ({
            guests: state.guests.map((g) =>
              g.id === guestId ? { ...g, tableId: undefined, seatOrder: undefined } : g
            ),
          }));
          return true;
        }

        const table = get().tables.find((t) => t.id === tableId);
        if (!table || !canAssignGuestToTable(guest, table, get().guests, tableId)) {
          return false;
        }

        const seatOrder =
          guest.tableId === tableId && guest.seatOrder != null
            ? guest.seatOrder
            : getNextSeatOrder(get().guests, tableId);

        set((state) => ({
          guests: state.guests.map((g) =>
            g.id === guestId ? { ...g, tableId, seatOrder } : g
          ),
        }));
        return true;
      },

      moveGuestAtTable: (guestId, direction) => {
        const guest = get().guests.find((g) => g.id === guestId);
        if (!guest?.tableId) return false;

        const ordered = getGuestsAtTable(get().guests, guest.tableId);
        const index = ordered.findIndex((g) => g.id === guestId);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return false;

        const nextOrder = [...ordered];
        const [moved] = nextOrder.splice(index, 1);
        nextOrder.splice(targetIndex, 0, moved);
        const orderById = new Map(nextOrder.map((g, i) => [g.id, i]));

        set((state) => ({
          guests: state.guests.map((g) =>
            orderById.has(g.id) ? { ...g, seatOrder: orderById.get(g.id) } : g
          ),
        }));
        return true;
      },

      swapGuestsAtTable: (guestIdA, guestIdB) => {
        if (guestIdA === guestIdB) return false;
        const guestA = get().guests.find((g) => g.id === guestIdA);
        const guestB = get().guests.find((g) => g.id === guestIdB);
        if (!guestA?.tableId || guestA.tableId !== guestB?.tableId) return false;

        const ordered = getGuestsAtTable(get().guests, guestA.tableId);
        const indexA = ordered.findIndex((g) => g.id === guestIdA);
        const indexB = ordered.findIndex((g) => g.id === guestIdB);
        if (indexA < 0 || indexB < 0) return false;

        const nextOrder = [...ordered];
        nextOrder[indexA] = ordered[indexB];
        nextOrder[indexB] = ordered[indexA];
        const orderById = new Map(nextOrder.map((g, i) => [g.id, i]));

        set((state) => ({
          guests: state.guests.map((g) =>
            orderById.has(g.id) ? { ...g, seatOrder: orderById.get(g.id) } : g
          ),
        }));
        return true;
      },

      isGuestDuplicate: (eventId, firstName, lastName, excludeId) => {
        const normalizedFirst = firstName.trim().toLowerCase();
        const normalizedLast = lastName.trim().toLowerCase();
        return get().guests.some(
          (guest) =>
            guest.eventId === eventId &&
            guest.id !== excludeId &&
            guest.firstName.trim().toLowerCase() === normalizedFirst &&
            guest.lastName.trim().toLowerCase() === normalizedLast
        );
      },

      addTable: (data) => {
        const id = generateId();
        const eventTables = getTablesForEvent(get().tables, data.eventId);
        const maxOrder = eventTables.reduce((max, t) => Math.max(max, t.sortOrder), 0);
        const table: SeatingTable = {
          ...data,
          id,
          capacity: Math.max(1, data.capacity),
          shape: normalizeTableShape(data.shape),
          sortOrder: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tables: [...state.tables, table] }));
        return id;
      },

      updateTable: (id, data) => {
        const existing = get().tables.find((t) => t.id === id);
        if (!existing) return;

        const nextCapacity = Math.max(1, data.capacity ?? existing.capacity);
        const occupied = get()
          .guests.filter((g) => g.tableId === id)
          .reduce((sum, g) => sum + g.partySize, 0);
        if (nextCapacity < occupied) return;

        set((state) => ({
          tables: state.tables.map((table) =>
            table.id === id
              ? { ...table, ...data, capacity: nextCapacity }
              : table
          ),
        }));
      },

      deleteTable: (id) => {
        set((state) => ({
          tables: state.tables.filter((table) => table.id !== id),
          guests: state.guests.map((guest) =>
            guest.tableId === id ? { ...guest, tableId: undefined, seatOrder: undefined } : guest
          ),
        }));
      },

      bulkCreateTables: (eventId, batches) => {
        const ids: string[] = [];
        let sortOrder = getTablesForEvent(get().tables, eventId).reduce(
          (max, t) => Math.max(max, t.sortOrder),
          0
        );
        let tableNumber = getTablesForEvent(get().tables, eventId).length;

        const newTables: SeatingTable[] = [];

        for (const batch of batches) {
          for (let i = 0; i < batch.count; i++) {
            tableNumber += 1;
            sortOrder += 1;
            const id = generateId();
            ids.push(id);
            newTables.push({
              id,
              eventId,
              name: translate(get().language, 'seating.defaultTableName', { number: tableNumber }),
              capacity: Math.max(1, batch.capacity),
              shape: normalizeTableShape(batch.shape),
              sortOrder,
              createdAt: new Date().toISOString(),
            });
          }
        }

        set((state) => ({ tables: [...state.tables, ...newTables] }));
        return ids;
      },

      addExpense: (data) => {
        const id = generateId();
        const expense: Expense = { ...data, id };
        set((state) => ({ expenses: [...state.expenses, expense] }));
        return id;
      },

      updateExpense: (id, data) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...data } : expense
          ),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },

      addObligation: (data) => {
        const id = generateId();
        const eventObligations = get().obligations.filter((o) => o.eventId === data.eventId);
        const maxOrder = eventObligations.reduce((max, o) => Math.max(max, o.sortOrder), 0);
        const obligation: Obligation = {
          ...data,
          id,
          title: data.title.trim(),
          sortOrder: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ obligations: [...state.obligations, obligation] }));
        triggerNotificationSync(get);
        return id;
      },

      updateObligation: (id, data) => {
        set((state) => ({
          obligations: state.obligations.map((obligation) =>
            obligation.id === id
              ? {
                  ...obligation,
                  ...data,
                  title: data.title !== undefined ? data.title.trim() : obligation.title,
                }
              : obligation
          ),
        }));
        triggerNotificationSync(get);
      },

      deleteObligation: (id) => {
        set((state) => ({
          obligations: state.obligations.filter((obligation) => obligation.id !== id),
        }));
        triggerNotificationSync(get);
      },

      setObligationStatus: (id, status) => {
        set((state) => ({
          obligations: state.obligations.map((obligation) =>
            obligation.id === id ? { ...obligation, status } : obligation
          ),
        }));
      },

      addObligationTemplates: (eventId, titles) => {
        const existingTitles = new Set(
          get()
            .obligations.filter((o) => o.eventId === eventId)
            .map((o) => o.title.trim().toLowerCase())
        );
        let added = 0;
        let sortOrder = get()
          .obligations.filter((o) => o.eventId === eventId)
          .reduce((max, o) => Math.max(max, o.sortOrder), 0);
        const newObligations: Obligation[] = [];

        for (const rawTitle of titles) {
          const title = rawTitle.trim();
          if (!title) continue;
          const key = title.toLowerCase();
          if (existingTitles.has(key)) continue;

          existingTitles.add(key);
          sortOrder += 1;
          added += 1;
          newObligations.push({
            id: generateId(),
            eventId,
            title,
            status: 'not_scheduled',
            sortOrder,
            createdAt: new Date().toISOString(),
          });
        }

        if (newObligations.length === 0) return 0;

        set((state) => ({
          obligations: [...state.obligations, ...newObligations],
        }));
        triggerNotificationSync(get);
        return added;
      },
    }),
    {
      name: 'wedding-planner-bh-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        events: state.events,
        guests: state.guests,
        tables: state.tables,
        expenses: state.expenses,
        obligations: state.obligations,
        language: state.language,
        hasSelectedLanguage: state.hasSelectedLanguage,
        localeVersion: LOCALE_VERSION,
        appTheme: state.appTheme,
        unlockedAppThemes: state.unlockedAppThemes,
        backupEmail: state.backupEmail,
        lastBackupAt: state.lastBackupAt,
        guestSortByEvent: state.guestSortByEvent,
        reviewPromptDone: state.reviewPromptDone,
        notificationsEnabled: state.notificationsEnabled,
      }),
      merge: (persisted, current) => {
        const saved = persisted as PersistedState | undefined;
        if (!saved) return current;

        const normalized = normalizeImportedState(saved as BackupData);

        return {
          ...current,
          ...saved,
          ...normalized,
          language: normalizePersistedLanguage(saved),
          hasSelectedLanguage:
            saved.hasSelectedLanguage ?? saved.localeVersion !== undefined,
          appTheme: normalizeAppTheme(saved.appTheme),
          unlockedAppThemes: normalizeUnlockedAppThemes(
            saved.unlockedAppThemes,
            normalizeAppTheme(saved.appTheme)
          ),
          backupEmail: saved.backupEmail ?? current.backupEmail ?? '',
          lastBackupAt: saved.lastBackupAt ?? current.lastBackupAt,
          guestSortByEvent: normalizeGuestSortByEvent(saved.guestSortByEvent),
          reviewPromptDone: saved.reviewPromptDone ?? current.reviewPromptDone ?? false,
          notificationsEnabled: saved.notificationsEnabled ?? current.notificationsEnabled ?? false,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
