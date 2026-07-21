import { isNativeAdsSupported } from '@/lib/adsEnvironment';

export function BottomBannerAd() {
  if (!isNativeAdsSupported()) return null;

  const { BottomBannerAdImpl } = require('./BottomBannerAdImpl') as typeof import('./BottomBannerAdImpl');
  return <BottomBannerAdImpl />;
}
