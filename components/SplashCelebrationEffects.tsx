import { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

import { colors } from '@/theme/colors';

const CONFETTI_COLORS = [
  colors.primary,
  colors.primaryDark,
  colors.success,
  colors.sharedSide,
  colors.seatAlmostFull,
];
const CONFETTI_COUNT = 30;
const SPARKLE_COUNT = 5;
const FIREWORK_RAY_COUNT = 9;
const FIREWORK_RAY_LENGTH = 28;

type ConfettiConfig = {
  x: number;
  size: number;
  height: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
  isCircle: boolean;
};

type SparkleConfig = {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
};

type FireworkConfig = {
  x: number;
  y: number;
  delay: number;
  color: string;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 9999) * 10000;
  return value - Math.floor(value);
}

function createConfettiConfigs(screenWidth: number): ConfettiConfig[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, index) => ({
    x: seededRandom(index + 1) * screenWidth,
    size: 4 + seededRandom(index + 2) * 4,
    height: 6 + seededRandom(index + 3) * 6,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    delay: seededRandom(index + 4) * 1200,
    duration: 1800 + seededRandom(index + 5) * 1200,
    drift: (seededRandom(index + 6) - 0.5) * 40,
    isCircle: index % 3 === 0,
  }));
}

function createSparkleConfigs(screenWidth: number, screenHeight: number): SparkleConfig[] {
  return Array.from({ length: SPARKLE_COUNT }, (_, index) => ({
    x: seededRandom(index + 20) * screenWidth,
    y: seededRandom(index + 30) * screenHeight,
    size: 3 + seededRandom(index + 40) * 3,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    delay: seededRandom(index + 50) * 600,
  }));
}

function ConfettiPiece({
  config,
  screenHeight,
}: {
  config: ConfettiConfig;
  screenHeight: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, { duration: config.duration, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, [config.delay, config.duration, progress]);

  const style = useAnimatedStyle(() => {
    const translateY = -20 + progress.value * (screenHeight + 40);
    const translateX = config.drift * progress.value;
    const rotate = `${progress.value * 720}deg`;
    const opacity =
      progress.value < 0.85 ? 0.9 : 0.9 * (1 - (progress.value - 0.85) / 0.15);

    return {
      opacity,
      transform: [{ translateX }, { translateY }, { rotate }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: config.x,
          width: config.size,
          height: config.isCircle ? config.size : config.height,
          borderRadius: config.isCircle ? config.size / 2 : 2,
          backgroundColor: config.color,
        },
        style,
      ]}
    />
  );
}

function SparkleDot({ config }: { config: SparkleConfig }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 700, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, [config.delay, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.sparkleDot,
        {
          left: config.x,
          top: config.y,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: config.color,
        },
        style,
      ]}
    />
  );
}

function FireworkBurst({ config }: { config: FireworkConfig }) {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const burst = withSequence(
      withTiming(1.2, { duration: 450, easing: Easing.out(Easing.ease) }),
      withTiming(0.35, { duration: 550, easing: Easing.in(Easing.ease) })
    );
    const fade = withSequence(
      withTiming(0.85, { duration: 250 }),
      withTiming(0, { duration: 750 })
    );

    scale.value = withDelay(config.delay, withRepeat(burst, -1, false));
    opacity.value = withDelay(config.delay, withRepeat(fade, -1, false));
  }, [config.delay, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const rays = Array.from({ length: FIREWORK_RAY_COUNT }, (_, index) => {
    const angle = (index / FIREWORK_RAY_COUNT) * Math.PI * 2;
    const x2 = 20 + Math.cos(angle) * FIREWORK_RAY_LENGTH;
    const y2 = 20 + Math.sin(angle) * FIREWORK_RAY_LENGTH;
    return { x2, y2 };
  });

  return (
    <Animated.View
      style={[
        styles.firework,
        {
          left: config.x - 20,
          top: config.y - 20,
        },
        style,
      ]}
    >
      <Svg width={40} height={40} viewBox="0 0 40 40">
        <Circle cx={20} cy={20} r={3} fill={config.color} opacity={0.9} />
        {rays.map((ray, index) => (
          <Line
            key={index}
            x1={20}
            y1={20}
            x2={ray.x2}
            y2={ray.y2}
            stroke={config.color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.75}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

export function SplashCelebrationEffects() {
  const { width, height } = useWindowDimensions();

  const confettiConfigs = useMemo(() => createConfettiConfigs(width), [width]);
  const sparkleConfigs = useMemo(
    () => createSparkleConfigs(width, height),
    [width, height]
  );
  const fireworkConfigs = useMemo<FireworkConfig[]>(
    () => [
      { x: 56, y: 88, delay: 0, color: colors.primary },
      { x: width - 56, y: 104, delay: 400, color: colors.seatAlmostFull },
      { x: width / 2, y: height - 100, delay: 800, color: colors.success },
    ],
    [width, height]
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {confettiConfigs.map((config, index) => (
        <ConfettiPiece key={`confetti-${index}`} config={config} screenHeight={height} />
      ))}
      {sparkleConfigs.map((config, index) => (
        <SparkleDot key={`sparkle-${index}`} config={config} />
      ))}
      {fireworkConfigs.map((config, index) => (
        <FireworkBurst key={`firework-${index}`} config={config} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    top: 0,
  },
  sparkleDot: {
    position: 'absolute',
  },
  firework: {
    position: 'absolute',
  },
});
