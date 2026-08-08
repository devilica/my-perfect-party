import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

import { REWARDED_TABLE_UNIT_ID } from '@/constants/ads';

import type { RewardedTableAdResult } from './rewardedTableAd';

const adUnitId = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : REWARDED_TABLE_UNIT_ID;

let cachedAd: RewardedInterstitialAd | null = null;
let isAdLoaded = false;
let isAdLoading = false;

function getRewardedTableAd(): RewardedInterstitialAd {
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

export function preloadRewardedTableAd() {
  if (isAdLoaded || isAdLoading) return;

  const ad = getRewardedTableAd();
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

export function showRewardedTableAd(): Promise<RewardedTableAdResult> {
  return new Promise((resolve) => {
    const ad = getRewardedTableAd();
    let earned = false;
    let settled = false;

    const finish = (result: RewardedTableAdResult) => {
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
