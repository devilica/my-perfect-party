import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getModalBottomInset } from '@/lib/safeAreaInsets';
import { spacing } from '@/theme/colors';

export function useBottomSheetPadding(extra = spacing.md): number {
  const insets = useSafeAreaInsets();
  return getModalBottomInset(insets) + extra;
}
