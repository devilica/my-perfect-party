import { Platform, ViewStyle } from 'react-native';

export const webViewportHeight: ViewStyle =
  Platform.OS === 'web'
    ? ({ height: '100vh', maxHeight: '100vh' } as unknown as ViewStyle)
    : {};

export const flexFill: ViewStyle =
  Platform.OS === 'web' ? { flex: 1, minHeight: 0 } : { flex: 1 };
