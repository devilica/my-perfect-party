import { GuestFilter } from '@/types/models';

export const ATTENDANCE_FILTERS: GuestFilter[] = [
  'all',
  'needs_invite',
  'invitation_sent',
  'confirmed',
  'declined',
  'unassigned',
];

export function getGuestFilterLabelKey(filter: GuestFilter): string {
  return `guests.filters.${filter}`;
}

export function getGuestFilterLabel(filter: GuestFilter, t: (key: string) => string): string {
  return t(getGuestFilterLabelKey(filter));
}
