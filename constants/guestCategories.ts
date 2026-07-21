export type PredefinedGuestCategory = 'family' | 'friends' | 'work' | 'other';

export const PREDEFINED_GUEST_CATEGORIES: PredefinedGuestCategory[] = [
  'family',
  'friends',
  'work',
  'other',
];

export const DEFAULT_GUEST_CATEGORIES: PredefinedGuestCategory[] = ['family', 'friends'];

const LEGACY_GUEST_CATEGORY_LABELS: Record<string, PredefinedGuestCategory> = {
  Porodica: 'family',
  Prijatelji: 'friends',
  Posao: 'work',
  Ostalo: 'other',
  Family: 'family',
  Friends: 'friends',
  Work: 'work',
  Other: 'other',
};

export function isPredefinedGuestCategory(
  category: string
): category is PredefinedGuestCategory {
  return PREDEFINED_GUEST_CATEGORIES.includes(category as PredefinedGuestCategory);
}

export function normalizeGuestCategory(category: string): string {
  const trimmed = category.trim();
  if (!trimmed) return trimmed;
  if (isPredefinedGuestCategory(trimmed)) return trimmed;
  return LEGACY_GUEST_CATEGORY_LABELS[trimmed] ?? trimmed;
}

export function normalizeGuestCategories(categories: string[]): string[] {
  const normalized = categories.map(normalizeGuestCategory);
  return [...new Set(normalized)];
}

export function getGuestCategoryLabel(
  category: string,
  t: (key: string) => string
): string {
  const normalized = normalizeGuestCategory(category);
  if (isPredefinedGuestCategory(normalized)) {
    return t(`guests.categories.${normalized}`);
  }
  return category;
}

export function toCategoryFilter(category: string) {
  return `category:${category}` as const;
}

export function isCategoryFilter(filter: string): filter is `category:${string}` {
  return filter.startsWith('category:');
}

export function getCategoryFromFilter(filter: `category:${string}`): string {
  return filter.slice('category:'.length);
}
