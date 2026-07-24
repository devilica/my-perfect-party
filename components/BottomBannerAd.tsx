import { BottomBannerAdPreview } from '@/components/BottomBannerAdPreview';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled, shouldShowAdPreviews } from '@/lib/adsEnvironment';

export function BottomBannerAd() {
  const isOnline = useIsOnline();

  if (shouldShowAdPreviews()) {
    return <BottomBannerAdPreview />;
  }

  if (!areAdsEnabled() || !isOnline) {
    return null;
  }

  const { BottomBannerAdImpl } =
    require('./BottomBannerAdImpl') as typeof import('./BottomBannerAdImpl');
  return <BottomBannerAdImpl />;
}
