export type RewardedThemeAdResult = 'rewarded' | 'closed' | 'unavailable' | 'failed';

export function preloadRewardedThemeAd() {}

export function showRewardedThemeAd(): Promise<RewardedThemeAdResult> {
  return Promise.resolve('rewarded');
}
