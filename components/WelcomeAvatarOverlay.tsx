import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { radius, spacing, typography } from '@/theme/colors';

const SHOW_DURATION_MS = 5000;
const FADE_IN_MS = 450;
const FADE_OUT_MS = 1200;
const DEFAULT_ASPECT = 1024 / 1536;
const DEFAULT_HEIGHT_RATIO = 0.36;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function resolveAspectRatio(
  image: ImageSourcePropType,
  aspectRatio?: number
): number {
  if (aspectRatio != null) return aspectRatio;
  const resolved = Image.resolveAssetSource(image);
  if (resolved.width > 0 && resolved.height > 0) {
    return resolved.width / resolved.height;
  }
  return DEFAULT_ASPECT;
}

type BubbleAlign = 'left' | 'center' | 'right';
type Anchor = 'left' | 'right';

type WelcomeAvatarOverlayProps = {
  image: ImageSourcePropType;
  messageKey: string;
  shouldShow: () => boolean;
  markShown: () => void;
  aspectRatio?: number;
  heightRatio?: number;
  imageClipWidthRatio?: number;
  imageBottomOffsetRatio?: number;
  bubbleMaxWidth?: number;
  bubbleAlign?: BubbleAlign;
  bubbleTailOffset?: number;
  anchor?: Anchor;
};

export function WelcomeAvatarOverlay({
  image,
  messageKey,
  shouldShow,
  markShown,
  aspectRatio,
  heightRatio = DEFAULT_HEIGHT_RATIO,
  imageClipWidthRatio = 1,
  imageBottomOffsetRatio = 0,
  bubbleMaxWidth,
  bubbleAlign = 'center',
  bubbleTailOffset,
  anchor = 'left',
}: WelcomeAvatarOverlayProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const resolvedAspect = resolveAspectRatio(image, aspectRatio);
  const avatarHeight = Math.round(SCREEN_HEIGHT * heightRatio);
  const avatarWidth = Math.round(avatarHeight * resolvedAspect);
  const clippedWidth = Math.round(avatarWidth * imageClipWidthRatio);
  const layoutWidth = imageClipWidthRatio < 1 ? clippedWidth : avatarWidth;
  const imageBottomOffset = Math.round(avatarHeight * imageBottomOffsetRatio);
  const resolvedBubbleMaxWidth = bubbleMaxWidth ?? layoutWidth;
  const tailLeft =
    bubbleAlign === 'left' ? (bubbleTailOffset ?? spacing.lg + 8) : undefined;
  const tailRight =
    bubbleAlign === 'right' ? (bubbleTailOffset ?? spacing.lg + 8) : undefined;
  const [visible, setVisible] = useState(shouldShow());
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    if (!visible) return;

    markShown();

    opacity.value = withSequence(
      withTiming(1, {
        duration: FADE_IN_MS,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(
        SHOW_DURATION_MS,
        withTiming(
          0,
          {
            duration: FADE_OUT_MS,
            easing: Easing.inOut(Easing.quad),
          },
          (finished) => {
            if (finished) runOnJS(setVisible)(false);
          }
        )
      )
    );
    translateY.value = withSequence(
      withTiming(0, {
        duration: FADE_IN_MS,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(
        SHOW_DURATION_MS,
        withTiming(18, {
          duration: FADE_OUT_MS,
          easing: Easing.inOut(Easing.quad),
        })
      )
    );
  }, [visible, opacity, translateY, markShown]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        anchor === 'right' ? styles.wrapRight : styles.wrapLeft,
        { maxWidth: layoutWidth },
        animatedStyle,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={[
          styles.bubble,
          bubbleAlign === 'left'
            ? styles.bubbleLeft
            : bubbleAlign === 'right'
              ? styles.bubbleRight
              : styles.bubbleCenter,
          { maxWidth: resolvedBubbleMaxWidth },
        ]}
      >
        <Text style={styles.bubbleText}>{t(messageKey)}</Text>
        <View
          style={[
            styles.bubbleTailBorder,
            tailLeft != null ? { left: tailLeft } : null,
            tailRight != null ? { right: tailRight } : null,
            tailLeft == null && tailRight == null ? styles.bubbleTailCenter : null,
          ]}
        />
        <View
          style={[
            styles.bubbleTail,
            tailLeft != null ? { left: tailLeft + 2 } : null,
            tailRight != null ? { right: tailRight + 2 } : null,
            tailLeft == null && tailRight == null ? styles.bubbleTailCenter : null,
          ]}
        />
      </View>
      {imageClipWidthRatio < 1 ? (
        <View style={{ width: clippedWidth, height: avatarHeight, overflow: 'hidden' }}>
          <Image
            source={image}
            style={{
              width: avatarWidth,
              height: avatarHeight,
              position: 'absolute',
              left: 0,
              bottom: -imageBottomOffset,
            }}
            resizeMode="contain"
          />
        </View>
      ) : (
        <Image
          source={image}
          style={{
            width: avatarWidth,
            height: avatarHeight,
            marginBottom: -imageBottomOffset,
          }}
          resizeMode="contain"
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapLeft: {
    position: 'absolute',
    left: spacing.sm,
    bottom: 0,
    alignItems: 'flex-start',
    zIndex: 20,
  },
  wrapRight: {
    position: 'absolute',
    right: spacing.sm,
    bottom: 0,
    alignItems: 'flex-end',
    zIndex: 20,
  },
  bubble: {
    backgroundColor: '#FFFCFA',
    borderWidth: 1,
    borderColor: '#F2C5C1',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#251B19',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        }
      : {}),
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  bubbleCenter: {
    alignSelf: 'center',
  },
  bubbleText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '700',
    color: '#861E2B',
    textAlign: 'center',
  },
  bubbleTailCenter: {
    alignSelf: 'center',
  },
  bubbleTailBorder: {
    position: 'absolute',
    bottom: -9,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F2C5C1',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -7,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFCFA',
  },
});
