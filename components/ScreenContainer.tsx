import { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/theme/colors';

type ScreenContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
};

export function ScreenContainer({ children, style, padded = true }: ScreenContainerProps) {
  return (
    <View style={[styles.outer, padded && styles.padded, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    paddingHorizontal: spacing.md,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});

export function webContainerStyle(): ViewStyle {
  return Platform.OS === 'web'
    ? { maxWidth: 480, width: '100%', alignSelf: 'center' as const }
    : {};
}
