import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppImage } from '@/components/AppImage';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const HERO_CALENDAR = require('@/assets/images/home-hero-calendar.png');

type HomeEmptyHeroProps = {
  headline: string;
  actionLabel: string;
  onAddEvent: () => void;
  showAction?: boolean;
};

export function HomeEmptyHero({
  headline,
  actionLabel,
  onAddEvent,
  showAction = true,
}: HomeEmptyHeroProps) {
  const theme = useThemeColors();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[styles.headline, { color: theme.primaryDark }]}>{headline}</Text>
        <AppImage source={HERO_CALENDAR} style={styles.heroImage} contentFit="contain" />
      </View>
      {showAction ? (
        <Pressable
          onPress={onAddEvent}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: theme.primaryDark },
            pressed && styles.ctaPressed,
          ]}
        >
          <View style={[styles.iconRing, { borderColor: theme.surface }]}>
            <Ionicons name="add" size={18} color={theme.surface} />
          </View>
          <Text style={[styles.ctaLabel, { color: theme.surface }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'stretch',
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headline: {
    ...typography.heading,
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
  },
  heroImage: {
    width: 132,
    height: 132,
  },
  cta: {
    width: '100%',
    minHeight: 48,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  ctaPressed: {
    opacity: 0.92,
  },
  iconRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    ...typography.body,
    fontWeight: '600',
  },
});
