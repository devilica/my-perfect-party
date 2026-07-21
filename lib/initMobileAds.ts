import { areAdsEnabled } from '@/lib/adsEnvironment';

export function initMobileAds() {
  if (!areAdsEnabled()) return Promise.resolve();

  const mobileAds = require('react-native-google-mobile-ads').default;
  return mobileAds()
    .initialize()
    .catch((error: unknown) => {
      console.warn('Mobile ads initialization failed:', error);
    });
}
