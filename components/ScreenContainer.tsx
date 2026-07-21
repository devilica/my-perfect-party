import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ImageBackground, Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { useActiveTheme } from '@/theme/EventThemeContext';
import { colors, spacing } from '@/theme/colors';

type ScreenContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
};

export function ScreenContainer({ children, style, padded = true }: ScreenContainerProps) {
  const activeTheme = useActiveTheme();

  if (!activeTheme) {
    return (
      <View style={[styles.outer, styles.defaultBackground, padded && styles.padded, style]}>
        <View style={styles.inner}>{children}</View>
      </View>
    );
  }

  return (
    <ImageBackground
      source={activeTheme.backgroundImage}
      style={[styles.outer, style]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient colors={activeTheme.overlayColors} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.content, padded && styles.padded]}>
        <View style={styles.inner}>{children}</View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  defaultBackground: {
    backgroundColor: colors.background,
  },
  backgroundImage: {
    ...Platform.select({
      web: { objectFit: 'cover' as const },
      default: {},
    }),
  },
  content: {
    flex: 1,
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
