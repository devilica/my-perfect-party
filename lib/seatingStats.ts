import {
  getGuestFullName,
  Guest,
  SeatingStats,
  SeatingTable,
  TableOccupancy,
} from '@/types/models';
import { getGuestsForEvent } from '@/lib/guestStats';

export type TableSeatSlot = {
  occupied: boolean;
  guestName?: string;
  guestId?: string;
};

export function buildTableSeatSlots(table: SeatingTable, guests: Guest[]): TableSeatSlot[] {
  const slots: TableSeatSlot[] = Array.from({ length: table.capacity }, () => ({
    occupied: false,
  }));

  let seatIndex = 0;
  for (const guest of getGuestsAtTable(guests, table.id)) {
    for (let i = 0; i < guest.partySize && seatIndex < table.capacity; i += 1) {
      slots[seatIndex] = {
        occupied: true,
        guestId: guest.id,
        guestName: i === 0 ? getGuestFullName(guest) : undefined,
      };
      seatIndex += 1;
    }
  }

  return slots;
}

export type TableFilter = 'all' | 'full' | 'available';

export function getTablesForEvent(tables: SeatingTable[], eventId: string): SeatingTable[] {
  return tables
    .filter((t) => t.eventId === eventId)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function filterTablesByOccupancy(
  tables: SeatingTable[],
  guests: Guest[],
  filter: TableFilter
): SeatingTable[] {
  if (filter === 'all') return tables;

  return tables.filter((table) => {
    const status = getTableOccupancyStatus(table, guests);
    if (filter === 'full') return status === 'full';
    return status === 'available';
  });
}

export function getTableOccupiedSeats(guests: Guest[], tableId: string): number {
  return guests
    .filter((g) => g.tableId === tableId)
    .reduce((sum, g) => sum + g.partySize, 0);
}

export function getTableRemainingSeats(table: SeatingTable, guests: Guest[]): number {
  const occupied = getTableOccupiedSeats(guests, table.id);
  return Math.max(0, table.capacity - occupied);
}

export function getTableOccupancyStatus(
  table: SeatingTable,
  guests: Guest[]
): TableOccupancy {
  const occupied = getTableOccupiedSeats(guests, table.id);
  if (occupied >= table.capacity) return 'full';
  if (table.capacity > 0 && occupied / table.capacity >= 0.8) return 'almostFull';
  return 'available';
}

export function getGuestsAtTable(guests: Guest[], tableId: string): Guest[] {
  return guests
    .map((guest, index) => ({ guest, index }))
    .filter(({ guest }) => guest.tableId === tableId)
    .sort((a, b) => {
      const orderA = a.guest.seatOrder;
      const orderB = b.guest.seatOrder;
      if (orderA != null && orderB != null && orderA !== orderB) return orderA - orderB;
      if (orderA != null && orderB == null) return -1;
      if (orderA == null && orderB != null) return 1;
      return a.index - b.index;
    })
    .map(({ guest }) => guest);
}

/** Next seatOrder when assigning a guest to a table. */
export function getNextSeatOrder(guests: Guest[], tableId: string): number {
  const atTable = getGuestsAtTable(guests, tableId);
  if (atTable.length === 0) return 0;
  return (
    Math.max(...atTable.map((guest, index) => guest.seatOrder ?? index)) + 1
  );
}

export function canAssignGuestToTable(
  guest: Guest,
  table: SeatingTable,
  allGuests: Guest[],
  targetTableId: string | null
): boolean {
  if (!targetTableId) return true;

  const occupied = getTableOccupiedSeats(allGuests, targetTableId);
  const currentOccupied =
    guest.tableId === targetTableId ? guest.partySize : 0;
  const remaining = table.capacity - occupied + currentOccupied;
  return guest.partySize <= remaining;
}

export function getSeatingStats(
  tables: SeatingTable[],
  guests: Guest[],
  eventId: string
): SeatingStats {
  const eventTables = getTablesForEvent(tables, eventId);
  let fullTables = 0;
  let almostFullTables = 0;
  let availableTables = 0;
  let totalCapacity = 0;
  let occupiedSeats = 0;

  for (const table of eventTables) {
    const status = getTableOccupancyStatus(table, guests);
    if (status === 'full') fullTables += 1;
    else if (status === 'almostFull') almostFullTables += 1;
    else availableTables += 1;
    totalCapacity += table.capacity;
    occupiedSeats += getTableOccupiedSeats(guests, table.id);
  }

  return {
    totalTables: eventTables.length,
    fullTables,
    almostFullTables,
    availableTables,
    totalCapacity,
    occupiedSeats,
  };
}

export function getAssignableTables(
  tables: SeatingTable[],
  guests: Guest[],
  eventId: string,
  guest: Guest
): SeatingTable[] {
  return getTablesForEvent(tables, eventId).filter((table) => {
    if (guest.tableId === table.id) return true;
    return canAssignGuestToTable(guest, table, guests, table.id);
  });
}

export function getAssignableGuestsForTable(
  guests: Guest[],
  table: SeatingTable,
  eventId: string
): Guest[] {
  return getGuestsForEvent(guests, eventId).filter(
    (guest) =>
      guest.tableId !== table.id &&
      canAssignGuestToTable(guest, table, guests, table.id)
  );
}

/** True when table count crosses 10 / 20 / 30 / … (free through 9). */
export function didCrossTableAdMilestone(oldCount: number, newCount: number): boolean {
  if (newCount < 10) return false;
  return Math.floor(newCount / 10) > Math.floor(oldCount / 10);
}
