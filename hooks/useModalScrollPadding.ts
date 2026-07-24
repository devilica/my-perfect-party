import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getEffectiveBottomInset } from '@/lib/safeAreaInsets';
import { spacing } from '@/theme/colors';

export function useModalScrollPadding(): number {
  const insets = useSafeAreaInsets();
  return spacing.md + getEffectiveBottomInset(insets);
}
