import { shouldShowAdPreviews } from '@/lib/adsEnvironment';
import { showInterstitialAdPreview } from '@/lib/rewardedAdPreviewController';

export function preloadInterstitialAd() {}

export async function showInterstitialAd(_isOnline: boolean): Promise<void> {
  if (shouldShowAdPreviews()) {
    await showInterstitialAdPreview();
  }
}

export const preloadHallInterstitial = preloadInterstitialAd;
export const showHallInterstitial = showInterstitialAd;
