import { areAdsEnabled, shouldShowAdPreviews } from '@/lib/adsEnvironment';
import { showRewardedAdPreview } from '@/lib/rewardedAdPreviewController';

export type RewardedTableAdResult =
  | 'rewarded'
  | 'closed'
  | 'unavailable'
  | 'failed';

export function canShowTableMilestoneAd(isOnline: boolean): boolean {
  return isOnline && (areAdsEnabled() || shouldShowAdPreviews());
}

export function preloadRewardedTableAd() {
  if (!areAdsEnabled()) return;

  const { preloadRewardedTableAd: preload } =
    require('./rewardedTableAdImpl') as typeof import('./rewardedTableAdImpl');
  preload();
}

export function showRewardedTableAd(): Promise<RewardedTableAdResult> {
  if (shouldShowAdPreviews()) {
    return showRewardedAdPreview();
  }

  if (!areAdsEnabled()) {
    return Promise.resolve('rewarded');
  }

  const { showRewardedTableAd: show } =
    require('./rewardedTableAdImpl') as typeof import('./rewardedTableAdImpl');
  return show();
}
