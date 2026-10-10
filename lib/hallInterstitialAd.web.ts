import { shouldShowAdPreviews } from '@/lib/adsEnvironment';
import { showRewardedAdPreview } from '@/lib/rewardedAdPreviewController';

export function preloadInterstitialAd() {}

export async function showInterstitialAd(_isOnline: boolean): Promise<void> {
  if (shouldShowAdPreviews()) {
    await showRewardedAdPreview();
  }
}

export const preloadHallInterstitial = preloadInterstitialAd;
export const showHallInterstitial = showInterstitialAd;
