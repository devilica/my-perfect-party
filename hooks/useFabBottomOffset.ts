import { useBannerClearance } from '@/hooks/useBannerClearance';
import { spacing } from '@/theme/colors';

export const FAB_SIZE = 56;

export function useFabBottomOffset(): number {
  const bannerClearance = useBannerClearance();
  return spacing.lg + bannerClearance;
}

export function useFabScrollPadding(): number {
  return useFabBottomOffset() + FAB_SIZE + spacing.sm;
}
