import { ATTENDANCE_STATUSES } from '@/constants/guestAttendance';
import { DEFAULT_GUEST_SORT } from '@/constants/guestSort';
import { Guest, GuestFilter, GuestSort, GuestStats } from '@/types/models';

function compareGuestNames(a: Guest, b: Guest): number {
  const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
  const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
  return nameA.localeCompare(nameB);
}

function compareGuestCreatedAt(a: Guest, b: Guest): number {
  const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
  const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
  return timeA - timeB;
}

export function sortGuests(guests: Guest[], sort: GuestSort = DEFAULT_GUEST_SORT): Guest[] {
  const sorted = [...guests];

  sorted.sort((a, b) => {
    switch (sort) {
      case 'added_desc': {
        const byDate = compareGuestCreatedAt(b, a);
        return byDate !== 0 ? byDate : compareGuestNames(a, b);
      }
      case 'added_asc': {
        const byDate = compareGuestCreatedAt(a, b);
        return byDate !== 0 ? byDate : compareGuestNames(a, b);
      }
      case 'name_desc':
        return compareGuestNames(b, a);
      case 'partySize_desc': {
        const bySize = b.partySize - a.partySize;
        return bySize !== 0 ? bySize : compareGuestNames(a, b);
      }
      case 'partySize_asc': {
        const bySize = a.partySize - b.partySize;
        return bySize !== 0 ? bySize : compareGuestNames(a, b);
      }
      case 'name_asc':
      default:
        return compareGuestNames(a, b);
    }
  });

  return sorted;
}

export function getGuestsForEvent(guests: Guest[], eventId: string): Guest[] {
  return guests.filter((g) => g.eventId === eventId);
}

/** True when people headcount crosses 31 / 61 / 91 / … (free through 30). */
export function didCrossGuestAdMilestone(
  oldTotalPeople: number,
  newTotalPeople: number
): boolean {
  if (newTotalPeople <= 30) return false;
  return (
    Math.floor((newTotalPeople - 1) / 30) > Math.floor((oldTotalPeople - 1) / 30)
  );
}

export function getGuestStats(guests: Guest[], eventId: string): GuestStats {
  const eventGuests = getGuestsForEvent(guests, eventId);
  const totalInvites = eventGuests.length;
  const totalPeople = eventGuests.reduce((sum, g) => sum + g.partySize, 0);
  const confirmedPeople = eventGuests
    .filter((g) => g.attendanceStatus === 'confirmed')
    .reduce((sum, g) => sum + g.partySize, 0);
  const needsInvitePeople = eventGuests
    .filter((g) => g.attendanceStatus === 'needs_invite')
    .reduce((sum, g) => sum + g.partySize, 0);
  const invitationSentPeople = eventGuests
    .filter((g) => g.attendanceStatus === 'invitation_sent')
    .reduce((sum, g) => sum + g.partySize, 0);
  const pendingPeople = eventGuests
    .filter(
      (g) =>
        g.attendanceStatus === 'needs_invite' || g.attendanceStatus === 'invitation_sent'
    )
    .reduce((sum, g) => sum + g.partySize, 0);
  const declinedPeople = eventGuests
    .filter((g) => g.attendanceStatus === 'declined')
    .reduce((sum, g) => sum + g.partySize, 0);
  const assignedPeople = eventGuests
    .filter((g) => g.tableId)
    .reduce((sum, g) => sum + g.partySize, 0);
  const unassignedPeople = totalPeople - assignedPeople;
  const confirmationRate =
    totalPeople === 0 ? 0 : Math.round((confirmedPeople / totalPeople) * 100);
  const attendanceChartTotal =
    needsInvitePeople + invitationSentPeople + confirmedPeople + declinedPeople;

  return {
    totalInvites,
    totalPeople,
    confirmedPeople,
    pendingPeople,
    needsInvitePeople,
    invitationSentPeople,
    declinedPeople,
    assignedPeople,
    unassignedPeople,
    confirmationRate,
    attendanceChartTotal,
  };
}

export function filterGuests(
  guests: Guest[],
  eventId: string,
  filter: GuestFilter,
  searchQuery?: string,
  sort: GuestSort = DEFAULT_GUEST_SORT
): Guest[] {
  let result = getGuestsForEvent(guests, eventId);

  switch (filter) {
    case 'needs_invite':
      result = result.filter((g) => g.attendanceStatus === 'needs_invite');
      break;
    case 'invitation_sent':
      result = result.filter((g) => g.attendanceStatus === 'invitation_sent');
      break;
    case 'confirmed':
      result = result.filter((g) => g.attendanceStatus === 'confirmed');
      break;
    case 'declined':
      result = result.filter((g) => g.attendanceStatus === 'declined');
      break;
    case 'unassigned':
      result = result.filter((g) => !g.tableId);
      break;
    default:
      break;
  }

  const query = searchQuery?.trim().toLowerCase();
  if (query) {
    result = result.filter((g) => {
      const full = `${g.firstName} ${g.lastName}`.toLowerCase();
      return full.includes(query) || g.phone?.includes(query);
    });
  }

  return sortGuests(result, sort);
}

export function getNextAttendanceStatus(
  current: Guest['attendanceStatus']
): Guest['attendanceStatus'] {
  const index = ATTENDANCE_STATUSES.indexOf(current);
  if (index === -1) return ATTENDANCE_STATUSES[0];
  return ATTENDANCE_STATUSES[(index + 1) % ATTENDANCE_STATUSES.length];
}
