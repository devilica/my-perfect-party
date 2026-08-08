import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { ADS_ENABLED } from '@/constants/ads';

export function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export function isNativeAdsSupported(): boolean {
  if (Platform.OS === 'web') return false;
  // 'expo' = Expo Go; 'standalone' = APK; 'guest' = Expo Go guest mode
  return Constants.appOwnership !== 'expo';
}

export function areAdsEnabled(): boolean {
  return ADS_ENABLED && isNativeAdsSupported();
}

/** Placeholder banner/native/rewarded UI when real AdMob isn't available (Expo Go). */
export function shouldShowAdPreviews(): boolean {
  if (!ADS_ENABLED) return false;
  if (Platform.OS === 'web') return true;
  return isExpoGo();
}
