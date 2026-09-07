import { Platform } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export const ANDROID_NAV_BAR_FALLBACK = 48;

export function getBottomInset(insets: EdgeInsets): number {
  return insets.bottom;
}

export function getModalBottomInset(insets: EdgeInsets): number {
  if (Platform.OS === 'android' && insets.bottom === 0) {
    return ANDROID_NAV_BAR_FALLBACK;
  }
  return insets.bottom;
}

/** @deprecated Prefer getModalBottomInset for modals or getBottomInset for stack overlays */
export function getEffectiveBottomInset(insets: EdgeInsets): number {
  return getModalBottomInset(insets);
}
