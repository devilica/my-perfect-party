import { PredefinedCategory } from '@/types/models';

export const PREDEFINED_CATEGORIES: PredefinedCategory[] = [
  'music',
  'food',
  'photography',
  'venue',
  'decoration',
  'attire',
  'transport',
  'other',
];

export const CATEGORY_COLORS: Record<PredefinedCategory, string> = {
  music: '#9B6B9E',
  food: '#C4847A',
  photography: '#7B9E87',
  venue: '#D4A574',
  decoration: '#E8A598',
  attire: '#8B7EC8',
  transport: '#6B9EB8',
  other: '#A8A29E',
};

export function getCategoryColor(category: string): string {
  if (category in CATEGORY_COLORS) {
    return CATEGORY_COLORS[category as PredefinedCategory];
  }
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 55%)`;
}

export function isPredefinedCategory(category: string): category is PredefinedCategory {
  return PREDEFINED_CATEGORIES.includes(category as PredefinedCategory);
}
