import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ImageStyle, Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { AppImage } from '@/components/AppImage';
import { useActiveTheme } from '@/theme/EventThemeContext';
import { colors, spacing } from '@/theme/colors';
import { flexFill, webViewportHeight } from '@/lib/webLayout';

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
    <View style={[styles.outer, Platform.OS === 'web' && webStyles.outer, style]}>
      <View
        style={[styles.backgroundLayer, Platform.OS === 'web' && webStyles.backgroundLayerWeb]}
        collapsable={false}
        pointerEvents="none"
      >
        <AppImage
          source={activeTheme.backgroundImage}
          style={[StyleSheet.absoluteFill, Platform.OS === 'web' && webStyles.backgroundImage]}
          resizeMode="cover"
        />
        <LinearGradient colors={activeTheme.overlayColors} style={StyleSheet.absoluteFill} />
      </View>
      <View style={[styles.content, padded && styles.padded]}>
        <View style={styles.inner}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    ...flexFill,
  },
  defaultBackground: {
    backgroundColor: colors.background,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    ...flexFill,
    zIndex: 1,
  },
  padded: {
    paddingHorizontal: spacing.md,
  },
  inner: {
    ...flexFill,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});

const webStyles = {
  outer: {
    position: 'relative',
    overflow: 'hidden',
    ...webViewportHeight,
  } as ViewStyle,
  backgroundLayerWeb: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  } as unknown as ViewStyle,
  backgroundImage: {
    transform: [{ scale: 1.05 }],
  } as ImageStyle,
};

export function webContainerStyle(): ViewStyle {
  return Platform.OS === 'web'
    ? { maxWidth: 480, width: '100%', alignSelf: 'center' as const }
    : {};
}
