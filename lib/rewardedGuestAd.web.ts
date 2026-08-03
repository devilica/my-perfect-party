export type RewardedGuestAdResult =
  | 'rewarded'
  | 'closed'
  | 'unavailable'
  | 'failed';

export function preloadRewardedGuestAd() {}

export function showRewardedGuestAd(): Promise<RewardedGuestAdResult> {
  return Promise.resolve('rewarded');
}
