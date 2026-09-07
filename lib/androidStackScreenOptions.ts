import { Platform } from 'react-native';

import { isExpoGo } from '@/lib/adsEnvironment';

export const androidStackScreenOptions =
  Platform.OS === 'android' && isExpoGo()
    ? {
        statusBarTranslucent: true,
        unstable_nativeProps: {
          headerConfig: {
            disableTopInsetApplication: true,
          },
        },
      }
    : {};
