import { useSegments } from 'expo-router';

import { useBannerHeight } from '@/hooks/BannerLayoutContext';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';

export function useBannerClearance(): number {
  const segments = useSegments();
  const bannerHeight = useBannerHeight();
  const isOnline = useIsOnline();
  const onMainScreen = !segments.some((segment) => segment === 'modals');

  return onMainScreen && isOnline && areAdsEnabled() ? bannerHeight : 0;
}
