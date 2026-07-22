export type RewardedInvitationAdResult =
  | 'rewarded'
  | 'closed'
  | 'unavailable'
  | 'failed';

export function preloadRewardedInvitationAd() {}

export function showRewardedInvitationAd(): Promise<RewardedInvitationAdResult> {
  return Promise.resolve('rewarded');
}
