import {
  canAssignGuestToTable,
  didCrossTableAdMilestone,
  getSeatingStats,
} from '@/lib/seatingStats';
import type { Guest, SeatingTable } from '@/types/models';

function makeGuest(overrides: Partial<Guest> & Pick<Guest, 'id' | 'eventId'>): Guest {
  return {
    firstName: 'Test',
    lastName: 'Guest',
    category: 'friends',
    attendanceStatus: 'confirmed',
    partySize: 1,
    ...overrides,
  };
}

function makeTable(overrides: Partial<SeatingTable> & Pick<SeatingTable, 'id' | 'eventId'>): SeatingTable {
  return {
    name: 'Table',
    capacity: 8,
    sortOrder: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('seatingStats', () => {
  const eventId = 'event-1';

  describe('canAssignGuestToTable', () => {
    it('allows assignment when table has enough remaining seats', () => {
      const table = makeTable({ id: 't1', eventId, capacity: 4 });
      const guest = makeGuest({ id: 'g1', eventId, partySize: 2 });
      expect(canAssignGuestToTable(guest, table, [], 't1')).toBe(true);
    });

    it('rejects when party size exceeds remaining capacity', () => {
      const table = makeTable({ id: 't1', eventId, capacity: 4 });
      const seated = makeGuest({ id: 'g2', eventId, partySize: 3, tableId: 't1' });
      const guest = makeGuest({ id: 'g1', eventId, partySize: 2 });
      expect(canAssignGuestToTable(guest, table, [seated], 't1')).toBe(false);
    });

    it('credits party size when guest is already on the same table', () => {
      const table = makeTable({ id: 't1', eventId, capacity: 8 });
      const guest = makeGuest({ id: 'g1', eventId, partySize: 3, tableId: 't1' });
      const seated = makeGuest({ id: 'g2', eventId, partySize: 2, tableId: 't1' });
      expect(canAssignGuestToTable(guest, table, [guest, seated], 't1')).toBe(true);
    });

    it('allows clearing table assignment', () => {
      const table = makeTable({ id: 't1', eventId });
      const guest = makeGuest({ id: 'g1', eventId });
      expect(canAssignGuestToTable(guest, table, [], null)).toBe(true);
    });
  });

  describe('getSeatingStats', () => {
    it('counts full and available tables for an event', () => {
      const tables: SeatingTable[] = [
        makeTable({ id: 't1', eventId, capacity: 2 }),
        makeTable({ id: 't2', eventId, capacity: 10 }),
        makeTable({ id: 't3', eventId: 'other', capacity: 2 }),
      ];
      const guests: Guest[] = [
        makeGuest({ id: 'g1', eventId, partySize: 2, tableId: 't1' }),
      ];
      const stats = getSeatingStats(tables, guests, eventId);
      expect(stats.totalTables).toBe(2);
      expect(stats.fullTables).toBe(1);
      expect(stats.availableTables).toBe(1);
      expect(stats.occupiedSeats).toBe(2);
      expect(stats.totalCapacity).toBe(12);
    });
  });

  describe('didCrossTableAdMilestone', () => {
    it('returns false below 10 tables', () => {
      expect(didCrossTableAdMilestone(8, 9)).toBe(false);
    });

    it('returns true when crossing from 9 to 10', () => {
      expect(didCrossTableAdMilestone(9, 10)).toBe(true);
    });

    it('returns true when crossing from 19 to 20', () => {
      expect(didCrossTableAdMilestone(19, 20)).toBe(true);
    });

    it('returns false when staying within same decade', () => {
      expect(didCrossTableAdMilestone(10, 11)).toBe(false);
    });
  });
});
