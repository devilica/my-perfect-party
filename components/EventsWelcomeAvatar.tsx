import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import { useFabBottomOffset } from '@/hooks/useFabBottomOffset';
import { useTranslation } from '@/lib/i18n';
import {
  markEventsWelcomeShown,
  shouldShowEventsWelcome,
} from '@/lib/eventsWelcomeSession';
import { useWeddingStore } from '@/store/weddingStore';
import { radius, spacing, typography } from '@/theme/colors';

const AVATAR = require('@/assets/images/avatar.png');
const SHOW_DURATION_MS = 10000;
const FADE_MS = 350;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AVATAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.3);
const AVATAR_WIDTH = Math.round(AVATAR_HEIGHT * 0.92);

export function EventsWelcomeAvatar() {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const bottom = useFabBottomOffset();
  const opacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(shouldShowEventsWelcome());

  useEffect(() => {
    if (!mounted) return;

    markEventsWelcomeShown();

    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_MS,
      useNativeDriver: true,
    }).start();

    const hideTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }, SHOW_DURATION_MS);

    return () => clearTimeout(hideTimer);
  }, [mounted, opacity]);

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { bottom, opacity }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>{t('app.welcome')}</Text>
        <View style={styles.bubbleTailBorder} />
        <View style={styles.bubbleTail} />
      </View>
      <Image
        source={AVATAR}
        style={[styles.avatar, { width: AVATAR_WIDTH, height: AVATAR_HEIGHT }]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.sm,
    alignItems: 'flex-start',
    maxWidth: SCREEN_WIDTH * 0.42,
    zIndex: 20,
  },
  bubble: {
    alignSelf: 'center',
    backgroundColor: '#FFFCFA',
    borderWidth: 1,
    borderColor: '#F2C5C1',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    maxWidth: AVATAR_WIDTH,
    shadowColor: '#251B19',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '700',
    color: '#861E2B',
    textAlign: 'center',
  },
  bubbleTailBorder: {
    position: 'absolute',
    bottom: -9,
    alignSelf: 'center',
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
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFCFA',
  },
  avatar: {
    marginLeft: 0,
  },
});
