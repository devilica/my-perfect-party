import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getEffectiveBottomInset } from '@/lib/safeAreaInsets';
import { spacing } from '@/theme/colors';

export const FAB_SIZE = 56;

export function useFabBottomOffset(): number {
  const insets = useSafeAreaInsets();
  const bottomInset = getEffectiveBottomInset(insets);
  return spacing.lg + bottomInset;
}

export function useFabScrollPadding(fabCount = 1): number {
  return (
    useFabBottomOffset() +
    fabCount * FAB_SIZE +
    Math.max(0, fabCount - 1) * spacing.sm +
    spacing.sm
  );
}
