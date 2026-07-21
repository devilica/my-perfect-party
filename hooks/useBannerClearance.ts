import { useSegments } from 'expo-router';

import { BANNER_CLEARANCE } from '@/constants/ads';
import { useIsOnline } from '@/hooks/useIsOnline';
import { isNativeAdsSupported } from '@/lib/adsEnvironment';

export function useBannerClearance(): number {
  const segments = useSegments();
  const isOnline = useIsOnline();
  const onMainScreen = !segments.some((segment) => segment === 'modals');

  return onMainScreen && isOnline && isNativeAdsSupported() ? BANNER_CLEARANCE : 0;
}
