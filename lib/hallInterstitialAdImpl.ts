import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

import { HALL_INTERSTITIAL_UNIT_ID } from '@/constants/ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : HALL_INTERSTITIAL_UNIT_ID;

let cachedAd: InterstitialAd | null = null;
let isAdLoaded = false;
let isAdLoading = false;

function getHallInterstitialAd(): InterstitialAd {
  if (!cachedAd) {
    cachedAd = InterstitialAd.createForAdRequest(adUnitId);
  }
  return cachedAd;
}

function resetCachedAd() {
  cachedAd = null;
  isAdLoaded = false;
  isAdLoading = false;
}

export function preloadHallInterstitial() {
  if (isAdLoaded || isAdLoading) return;

  const ad = getHallInterstitialAd();
  isAdLoading = true;

  const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
    unsubLoaded();
    unsubError();
    isAdLoaded = true;
    isAdLoading = false;
  });

  const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
    unsubLoaded();
    unsubError();
    isAdLoading = false;
    resetCachedAd();
  });

  ad.load();
}

export function showHallInterstitial(): Promise<void> {
  return new Promise((resolve) => {
    const ad = getHallInterstitialAd();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      resetCachedAd();
      preloadHallInterstitial();
      resolve();
    };

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      unsubClosed();
      unsubError();
      unsubLoaded();
      finish();
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      unsubClosed();
      unsubError();
      unsubLoaded();
      finish();
    });

    const showLoadedAd = () => {
      unsubLoaded();
      isAdLoaded = false;
      ad.show();
    };

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, showLoadedAd);

    if (isAdLoaded) {
      unsubLoaded();
      showLoadedAd();
      return;
    }

    isAdLoading = true;
    ad.load();
  });
}
