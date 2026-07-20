import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ImageBackground, Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { useEventTheme } from '@/theme/EventThemeContext';
import { spacing } from '@/theme/colors';

type ThemedScreenContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
};

export function ThemedScreenContainer({
  children,
  style,
  padded = true,
}: ThemedScreenContainerProps) {
  const eventTheme = useEventTheme();

  if (!eventTheme) {
    return (
      <View style={[styles.outer, padded && styles.padded, style]}>
        <View style={styles.inner}>{children}</View>
      </View>
    );
  }

  return (
    <ImageBackground
      source={eventTheme.backgroundImage}
      style={[styles.outer, style]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={eventTheme.overlayColors}
        style={StyleSheet.absoluteFillObject}
      />
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
