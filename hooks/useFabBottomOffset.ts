import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getEffectiveBottomInset } from '@/lib/safeAreaInsets';
import { spacing } from '@/theme/colors';

export const FAB_SIZE = 56;

export function useFabBottomOffset(): number {
  const insets = useSafeAreaInsets();
  const bottomInset = getEffectiveBottomInset(insets);
  return spacing.lg + bottomInset;
}

export function useFabScrollPadding(): number {
  return useFabBottomOffset() + FAB_SIZE + spacing.sm;
}
