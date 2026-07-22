import { areAdsEnabled } from '@/lib/adsEnvironment';

export type RewardedInvitationAdResult =
  | 'rewarded'
  | 'closed'
  | 'unavailable'
  | 'failed';

export function preloadRewardedInvitationAd() {
  if (!areAdsEnabled()) return;

  const { preloadRewardedInvitationAd: preload } =
    require('./rewardedInvitationAdImpl') as typeof import('./rewardedInvitationAdImpl');
  preload();
}

export function showRewardedInvitationAd(): Promise<RewardedInvitationAdResult> {
  if (!areAdsEnabled()) {
    return Promise.resolve('rewarded');
  }

  const { showRewardedInvitationAd: show } =
    require('./rewardedInvitationAdImpl') as typeof import('./rewardedInvitationAdImpl');
  return show();
}
