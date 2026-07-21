import { areAdsEnabled } from '@/lib/adsEnvironment';

export type RewardedThemeAdResult = 'rewarded' | 'closed' | 'unavailable' | 'failed';

export function preloadRewardedThemeAd() {
  if (!areAdsEnabled()) return;

  const { preloadRewardedThemeAd: preload } =
    require('./rewardedThemeAdImpl') as typeof import('./rewardedThemeAdImpl');
  preload();
}

export function showRewardedThemeAd(): Promise<RewardedThemeAdResult> {
  if (!areAdsEnabled()) {
    return Promise.resolve('rewarded');
  }

  const { showRewardedThemeAd: show } =
    require('./rewardedThemeAdImpl') as typeof import('./rewardedThemeAdImpl');
  return show();
}
