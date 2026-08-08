export type RewardedTableAdResult =
  | 'rewarded'
  | 'closed'
  | 'unavailable'
  | 'failed';

export function preloadRewardedTableAd() {}

export function showRewardedTableAd(): Promise<RewardedTableAdResult> {
  return Promise.resolve('rewarded');
}
