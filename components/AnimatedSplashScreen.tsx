import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { getDefaultLanguage, translate } from '@/lib/i18n';
import { SplashCelebrationEffects } from '@/components/SplashCelebrationEffects';
import { colors, radius, spacing, typography } from '@/theme/colors';

const FADE_OUT_DELAY_MS = 2200;
const FADE_OUT_DURATION_MS = 300;

type AnimatedSplashScreenProps = {
  onFinish: () => void;
};

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const language = getDefaultLanguage();
  const title = translate(language, 'app.name');
  const tagline = translate(language, 'app.tagline');

  const containerOpacity = useSharedValue(1);
  const iconScale = useSharedValue(0.75);
  const iconPulse = useSharedValue(1);
  const titleOpacity = useSharedValue(0.3);
  const titleTranslateY = useSharedValue(8);
  const taglineOpacity = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0.5);
  const sparkleLeftOpacity = useSharedValue(0.35);
  const glowScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.35);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    iconScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    iconPulse.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(100, withTiming(0, { duration: 500 }));
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    sparkleOpacity.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.4, { duration: 800 })
        ),
        -1,
        true
      )
    );
    sparkleLeftOpacity.value = withDelay(
      350,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: 900 }),
          withTiming(0.25, { duration: 900 })
        ),
        -1,
        true
      )
    );
    glowScale.value = withDelay(
      150,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.92, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    glowOpacity.value = withDelay(
      150,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    const fadeTimer = setTimeout(() => {
      containerOpacity.value = withTiming(
        0,
        { duration: FADE_OUT_DURATION_MS },
        (finished) => {
          if (finished) {
            runOnJS(onFinishRef.current)();
          }
        }
      );
    }, FADE_OUT_DELAY_MS);

    return () => clearTimeout(fadeTimer);
  }, [
    containerOpacity,
    glowOpacity,
    glowScale,
    iconPulse,
    iconScale,
    sparkleLeftOpacity,
    sparkleOpacity,
    taglineOpacity,
    titleOpacity,
    titleTranslateY,
  ]);

  const containerStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: containerOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value * iconPulse.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const sparkleLeftStyle = useAnimatedStyle(() => ({
    opacity: sparkleLeftOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Animated.View style={containerStyle}>
      <LinearGradient
        colors={[colors.background, colors.primaryLight]}
        style={styles.container}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <SplashCelebrationEffects />
        <View style={styles.content}>
          <View style={styles.iconCluster}>
            <Animated.View style={[styles.iconGlow, glowStyle]} />
            <Animated.View style={[styles.iconWrap, iconStyle]}>
              <Ionicons name="heart" size={40} color={colors.primary} />
              <Animated.View style={[styles.sparkle, sparkleStyle]}>
                <Ionicons name="sparkles" size={22} color={colors.primaryDark} />
              </Animated.View>
              <Animated.View style={[styles.sparkleLeft, sparkleLeftStyle]}>
                <Ionicons name="sparkles" size={18} color={colors.seatAlmostFull} />
              </Animated.View>
            </Animated.View>
          </View>

          <Animated.Text style={[styles.title, titleStyle]}>{title}</Animated.Text>
          <Animated.Text style={[styles.tagline, taglineStyle]}>{tagline}</Animated.Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 1,
  },
  iconCluster: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  sparkle: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  sparkleLeft: {
    position: 'absolute',
    bottom: -2,
    left: -6,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
