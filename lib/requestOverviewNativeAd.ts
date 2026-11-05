import { NativeAd, TestIds } from 'react-native-google-mobile-ads';

import { OVERVIEW_NATIVE_AD_UNIT_ID } from '@/constants/ads';

const adUnitId = __DEV__ ? TestIds.NATIVE : OVERVIEW_NATIVE_AD_UNIT_ID;

const MIN_MS_BETWEEN_REQUESTS = 10_000;
const NATIVE_RETRY_DELAY_MS = 30_000;
const MAX_LOAD_ATTEMPTS = 2;

let inFlight: Promise<NativeAd> | null = null;
let lastRequestAt = 0;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadWithRetry(attempt: number): Promise<NativeAd> {
  return NativeAd.createForAdRequest(adUnitId).catch((error) => {
    if (__DEV__) {
      console.warn('Overview native ad failed to load:', error);
    }
    if (attempt + 1 < MAX_LOAD_ATTEMPTS) {
      return delay(NATIVE_RETRY_DELAY_MS).then(() => loadWithRetry(attempt + 1));
    }
    throw error;
  });
}

async function runRequest(): Promise<NativeAd> {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_MS_BETWEEN_REQUESTS) {
    await delay(MIN_MS_BETWEEN_REQUESTS - elapsed);
  }

  lastRequestAt = Date.now();
  try {
    return await loadWithRetry(0);
  } finally {
    inFlight = null;
  }
}

/** Serializes native ad requests and enforces a minimum gap between new loads. */
export function requestOverviewNativeAd(): Promise<NativeAd> {
  if (inFlight) {
    return inFlight;
  }

  inFlight = runRequest();
  return inFlight;
}
