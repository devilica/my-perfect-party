import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

import { REWARDED_INVITATION_UNIT_ID } from '@/constants/ads';

import type { RewardedInvitationAdResult } from './rewardedInvitationAd';

const adUnitId = __DEV__ ? TestIds.REWARDED : REWARDED_INVITATION_UNIT_ID;

let cachedAd: RewardedAd | null = null;
let isAdLoaded = false;
let isAdLoading = false;

function getRewardedAd(): RewardedAd {
  if (!cachedAd) {
    cachedAd = RewardedAd.createForAdRequest(adUnitId);
  }
  return cachedAd;
}

function resetCachedAd() {
  cachedAd = null;
  isAdLoaded = false;
  isAdLoading = false;
}

export function preloadRewardedInvitationAd() {
  if (isAdLoaded || isAdLoading) return;

  const ad = getRewardedAd();
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

export function showRewardedInvitationAd(): Promise<RewardedInvitationAdResult> {
  return new Promise((resolve) => {
    const ad = getRewardedAd();
    let earned = false;
    let settled = false;

    const finish = (result: RewardedInvitationAdResult) => {
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
