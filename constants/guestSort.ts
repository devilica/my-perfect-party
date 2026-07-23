import { GuestSort } from '@/types/models';

export const GUEST_SORT_OPTIONS: GuestSort[] = [
  'added_desc',
  'added_asc',
  'name_asc',
  'name_desc',
  'partySize_desc',
  'partySize_asc',
];

export const DEFAULT_GUEST_SORT: GuestSort = 'added_desc';

export function isGuestSort(value: unknown): value is GuestSort {
  return typeof value === 'string' && GUEST_SORT_OPTIONS.includes(value as GuestSort);
}

export function getGuestSortLabelKey(sort: GuestSort): string {
  return `guests.sort.${sort}`;
}

export function getGuestSortLabel(sort: GuestSort, t: (key: string) => string): string {
  return t(getGuestSortLabelKey(sort));
}
