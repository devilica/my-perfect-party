import { areAdsEnabled, shouldShowAdPreviews } from '@/lib/adsEnvironment';
import { showInterstitialAdPreview } from '@/lib/rewardedAdPreviewController';

export function preloadInterstitialAd() {
  if (!areAdsEnabled()) return;

  const { preloadHallInterstitial: preload } =
    require('./hallInterstitialAdImpl') as typeof import('./hallInterstitialAdImpl');
  preload();
}

/** Full-screen interstitial before hall, legal pages, etc. */
export async function showInterstitialAd(isOnline: boolean): Promise<void> {
  if (shouldShowAdPreviews()) {
    await showInterstitialAdPreview();
    return;
  }

  if (!areAdsEnabled() || !isOnline) return;

  const { showHallInterstitial: show } =
    require('./hallInterstitialAdImpl') as typeof import('./hallInterstitialAdImpl');
  await show();
}

export const preloadHallInterstitial = preloadInterstitialAd;
export const showHallInterstitial = showInterstitialAd;
