import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';

export function OverviewNativeAd() {
  const isOnline = useIsOnline();

  if (!areAdsEnabled() || !isOnline) {
    return null;
  }

  const { OverviewNativeAdImpl } =
    require('./OverviewNativeAdImpl') as typeof import('./OverviewNativeAdImpl');
  return <OverviewNativeAdImpl />;
}
