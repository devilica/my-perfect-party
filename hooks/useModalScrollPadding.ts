import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getModalBottomInset } from '@/lib/safeAreaInsets';
import { spacing } from '@/theme/colors';

export function useModalScrollPadding(): number {
  const insets = useSafeAreaInsets();
  return spacing.md + getModalBottomInset(insets);
}
