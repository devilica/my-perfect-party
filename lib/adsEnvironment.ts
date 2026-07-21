import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { ADS_ENABLED } from '@/constants/ads';

export function isNativeAdsSupported(): boolean {
  if (Platform.OS === 'web') return false;
  // 'expo' = Expo Go; 'standalone' = APK; 'guest' = Expo Go guest mode
  return Constants.appOwnership !== 'expo';
}

export function areAdsEnabled(): boolean {
  return ADS_ENABLED && isNativeAdsSupported();
}
