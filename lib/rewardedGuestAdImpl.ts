import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

import { REWARDED_GUEST_UNIT_ID } from '@/constants/ads';

import type { RewardedGuestAdResult } from './rewardedGuestAd';

const adUnitId = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : REWARDED_GUEST_UNIT_ID;

let cachedAd: RewardedInterstitialAd | null = null;
let isAdLoaded = false;
let isAdLoading = false;

function getRewardedGuestAd(): RewardedInterstitialAd {
  if (!cachedAd) {
    cachedAd = RewardedInterstitialAd.createForAdRequest(adUnitId);
  }
  return cachedAd;
}

function resetCachedAd() {
  cachedAd = null;
  isAdLoaded = false;
  isAdLoading = false;
}

export function preloadRewardedGuestAd() {
  if (isAdLoaded || isAdLoading) return;

  const ad = getRewardedGuestAd();
  isAdLoading = true;

  const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
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

export function showRewardedGuestAd(): Promise<RewardedGuestAdResult> {
  return new Promise((resolve) => {
    const ad = getRewardedGuestAd();
    let earned = false;
    let settled = false;

    const finish = (result: RewardedGuestAdResult) => {
      if (settled) return;
      settled = true;
      resetCachedAd();
      resolve(result);
    };

    const unsubEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    });

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      unsubEarned();
      unsubClosed();
      unsubError();
      unsubLoaded();
      finish(earned ? 'rewarded' : 'closed');
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      unsubEarned();
      unsubClosed();
      unsubError();
      unsubLoaded();
      finish('failed');
    });

    const showLoadedAd = () => {
      unsubLoaded();
      isAdLoaded = false;
      ad.show();
    };

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, showLoadedAd);

    if (isAdLoaded) {
      unsubLoaded();
      showLoadedAd();
      return;
    }

    isAdLoading = true;
    ad.load();
  });
}
