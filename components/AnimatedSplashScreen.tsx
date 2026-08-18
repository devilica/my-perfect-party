import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getDefaultLanguage, translate } from '@/lib/i18n';
import { getEffectiveBottomInset } from '@/lib/safeAreaInsets';
import { SplashCelebrationEffects } from '@/components/SplashCelebrationEffects';
import { colors, spacing, typography } from '@/theme/colors';

const FADE_OUT_DELAY_MS = 2200;
const FADE_OUT_DURATION_MS = 300;
const LOGO_SIZE = 220;
const GLOW_SIZE = LOGO_SIZE + 40;
const LOGO_OFFSET_Y = 12;
const TAGLINE_ABOVE_NAV = 28;

type AnimatedSplashScreenProps = {
  onFinish: () => void;
};

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const language = getDefaultLanguage();
  const tagline = translate(language, 'app.tagline');
  const insets = useSafeAreaInsets();
  const taglineBottom = getEffectiveBottomInset(insets) + TAGLINE_ABOVE_NAV;

  const containerOpacity = useSharedValue(1);
  const iconScale = useSharedValue(0.75);
  const iconPulse = useSharedValue(1);
  const taglineOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.35);
  const nativeSplashHidden = useRef(false);

  const handleSplashLayout = () => {
    if (nativeSplashHidden.current) return;
    nativeSplashHidden.current = true;
    SplashScreen.hideAsync().catch(() => {});
  };

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    iconPulse.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1.06, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
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
  }, [containerOpacity, glowOpacity, glowScale, iconPulse, iconScale, taglineOpacity]);

  const containerStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    opacity: containerOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value * iconPulse.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
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
        onLayout={handleSplashLayout}
      >
        <SplashCelebrationEffects />
        <View style={styles.content}>
          <View style={styles.logoArea}>
            <Animated.View style={[styles.iconCluster, iconStyle]}>
              <Animated.View style={[styles.iconGlow, glowStyle]} />
              <View style={styles.iconWrap}>
                <Image
                  source={require('@/assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel={translate(language, 'app.name')}
                />
              </View>
            </Animated.View>
          </View>

          <Animated.Text
            style={[styles.tagline, taglineStyle, { marginBottom: taglineBottom }]}
          >
            {tagline}
          </Animated.Text>
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
    zIndex: 1,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconCluster: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: LOGO_OFFSET_Y }],
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    letterSpacing: 0.3,
  },
});
