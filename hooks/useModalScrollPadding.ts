import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme/colors';

export function useModalScrollPadding(): number {
  const insets = useSafeAreaInsets();
  return spacing.md + insets.bottom;
}
