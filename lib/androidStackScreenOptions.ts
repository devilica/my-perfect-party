import { Platform } from 'react-native';

export const androidStackScreenOptions =
  Platform.OS === 'android'
    ? {
        statusBarTranslucent: true,
        unstable_nativeProps: {
          headerConfig: {
            disableTopInsetApplication: true,
          },
        },
      }
    : {};
