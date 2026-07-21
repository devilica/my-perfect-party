import Constants from 'expo-constants';
import { Platform } from 'react-native';

export function isNativeAdsSupported(): boolean {
  if (Platform.OS === 'web') return false;
  // 'expo' = Expo Go; 'standalone' = APK; 'guest' = Expo Go guest mode
  return Constants.appOwnership !== 'expo';
}
