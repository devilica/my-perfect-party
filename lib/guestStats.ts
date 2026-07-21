import { ATTENDANCE_STATUSES } from '@/constants/guestAttendance';
import { Guest, GuestFilter, GuestStats } from '@/types/models';

export function getGuestsForEvent(guests: Guest[], eventId: string): Guest[] {
  return guests
    .filter((g) => g.eventId === eventId)
    .sort((a, b) => {
      const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
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
  searchQuery?: string
): Guest[] {
  let result = getGuestsForEvent(guests, eventId);

  switch (filter) {
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

  return result;
}

export function getNextAttendanceStatus(
  current: Guest['attendanceStatus']
): Guest['attendanceStatus'] {
  const index = ATTENDANCE_STATUSES.indexOf(current);
  if (index === -1) return ATTENDANCE_STATUSES[0];
  return ATTENDANCE_STATUSES[(index + 1) % ATTENDANCE_STATUSES.length];
}
