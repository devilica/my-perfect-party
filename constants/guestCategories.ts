export const DEFAULT_GUEST_CATEGORIES = ['Porodica', 'Prijatelji'];

export function toCategoryFilter(category: string) {
  return `category:${category}` as const;
}

export function isCategoryFilter(filter: string): filter is `category:${string}` {
  return filter.startsWith('category:');
}

export function getCategoryFromFilter(filter: `category:${string}`): string {
  return filter.slice('category:'.length);
}
