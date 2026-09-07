import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isExpoGo } from '@/lib/adsEnvironment';
import { getModalBottomInset } from '@/lib/safeAreaInsets';
import { spacing } from '@/theme/colors';

export const FAB_SIZE = 56;
export const ANDROID_TAB_BAR_HEIGHT = 49;

export type FabOffsetVariant = 'stack' | 'tab';

export function useFabBottomOffset(variant: FabOffsetVariant = 'tab'): number {
  const insets = useSafeAreaInsets();
  let offset = spacing.lg + getModalBottomInset(insets);

  if (variant === 'stack' && Platform.OS === 'android' && !isExpoGo()) {
    offset += ANDROID_TAB_BAR_HEIGHT;
  }

  return offset;
}

export function useFabScrollPadding(
  fabCount = 1,
  variant: FabOffsetVariant = 'tab'
): number {
  return (
    useFabBottomOffset(variant) +
    fabCount * FAB_SIZE +
    Math.max(0, fabCount - 1) * spacing.sm +
    spacing.sm
  );
}
