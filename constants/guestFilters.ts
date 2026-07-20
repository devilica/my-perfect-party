import { GuestFilter } from '@/types/models';

export const ATTENDANCE_FILTERS: GuestFilter[] = [
  'all',
  'confirmed',
  'unconfirmed',
  'unassigned',
];

export function getCategoryFilters(categories: string[]): GuestFilter[] {
  return categories.map((category) => `category:${category}` as GuestFilter);
}

export function getGuestFilterOptions(eventCategories: string[]): GuestFilter[] {
  return [...ATTENDANCE_FILTERS, ...getCategoryFilters(eventCategories)];
}

export function getGuestFilterLabelKey(filter: GuestFilter): string | null {
  if (filter === 'all') return 'guests.filters.all';
  if (filter === 'confirmed') return 'guests.filters.confirmed';
  if (filter === 'unconfirmed') return 'guests.filters.unconfirmed';
  if (filter === 'unassigned') return 'guests.filters.unassigned';
  if (filter.startsWith('category:')) return null;
  return null;
}

export function getGuestFilterLabel(filter: GuestFilter, t: (key: string) => string): string {
  const key = getGuestFilterLabelKey(filter);
  if (key) return t(key);
  if (filter.startsWith('category:')) return filter.slice('category:'.length);
  return filter;
}
