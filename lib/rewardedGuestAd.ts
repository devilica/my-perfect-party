import { areAdsEnabled, shouldShowAdPreviews } from '@/lib/adsEnvironment';
import { showRewardedAdPreview } from '@/lib/rewardedAdPreviewController';

export type RewardedGuestAdResult =
  | 'rewarded'
  | 'closed'
  | 'unavailable'
  | 'failed';

export function preloadRewardedGuestAd() {
  if (!areAdsEnabled()) return;

  const { preloadRewardedGuestAd: preload } =
    require('./rewardedGuestAdImpl') as typeof import('./rewardedGuestAdImpl');
  preload();
}

export function showRewardedGuestAd(): Promise<RewardedGuestAdResult> {
  if (shouldShowAdPreviews()) {
    return showRewardedAdPreview();
  }

  if (!areAdsEnabled()) {
    return Promise.resolve('rewarded');
  }

  const { showRewardedGuestAd: show } =
    require('./rewardedGuestAdImpl') as typeof import('./rewardedGuestAdImpl');
  return show();
}
