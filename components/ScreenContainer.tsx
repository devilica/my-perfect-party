import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ImageBackground, ImageStyle, Platform, StyleSheet, View, ViewStyle } from 'react-native';

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
    <View style={[styles.outer, Platform.OS === 'web' && webStyles.outer, style]}>
      <ImageBackground
        source={activeTheme.backgroundImage}
        style={[styles.backgroundLayer, Platform.OS === 'web' && webStyles.backgroundLayerWeb]}
        imageStyle={Platform.OS === 'web' ? webStyles.backgroundImage : undefined}
        resizeMode="cover"
      >
        <LinearGradient colors={activeTheme.overlayColors} style={StyleSheet.absoluteFillObject} />
      </ImageBackground>
      <View style={[styles.content, padded && styles.padded]}>
        <View style={styles.inner}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  defaultBackground: {
    backgroundColor: colors.background,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    zIndex: 1,
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

const webStyles = {
  outer: {
    position: 'relative',
    overflow: 'hidden',
  } as ViewStyle,
  backgroundLayerWeb: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  } as unknown as ViewStyle,
  backgroundImage: {
    objectFit: 'cover',
    transform: [{ scale: 1.05 }],
  } as ImageStyle,
};

export function webContainerStyle(): ViewStyle {
  return Platform.OS === 'web'
    ? { maxWidth: 480, width: '100%', alignSelf: 'center' as const }
    : {};
}
