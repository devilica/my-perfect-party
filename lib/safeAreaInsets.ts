import { Platform } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

/** Standard Android nav bar height when OEM reports 0 inset under edge-to-edge */
const ANDROID_NAV_BAR_FALLBACK = 48;
const MIN_TRUSTED_INSET = 8;

export function getEffectiveBottomInset(insets: EdgeInsets): number {
  if (Platform.OS !== 'android') return insets.bottom;
  if (insets.bottom >= MIN_TRUSTED_INSET) return insets.bottom;
  return ANDROID_NAV_BAR_FALLBACK;
}
