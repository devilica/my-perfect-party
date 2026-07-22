import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/colors';

export function useBottomSheetPadding(extra = spacing.md): number {
  const insets = useSafeAreaInsets();
  return insets.bottom + extra;
}
