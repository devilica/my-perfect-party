import { areAdsEnabled } from '@/lib/adsEnvironment';

export function BottomBannerAd() {
  if (!areAdsEnabled()) return null;

  const { BottomBannerAdImpl } = require('./BottomBannerAdImpl') as typeof import('./BottomBannerAdImpl');
  return <BottomBannerAdImpl />;
}
