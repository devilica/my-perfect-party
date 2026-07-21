import { isNativeAdsSupported } from '@/lib/adsEnvironment';

export function initMobileAds() {
  if (!isNativeAdsSupported()) return;

  const mobileAds = require('react-native-google-mobile-ads').default;
  mobileAds().initialize();
}
