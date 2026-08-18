import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { formatDisplayDate, getEventCountdown } from '@/lib/dateUtils';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { CelebrationThemeId } from '@/types/models';
import { spacing, typography } from '@/theme/colors';

const COUNTDOWN_WEDDING_BACKGROUND = require('@/assets/images/countdown.png');
const COUNTDOWN_BIRTHDAY_BACKGROUND = require('@/assets/images/countdown3.png');
const COUNTDOWN_DEFAULT_BACKGROUND = require('@/assets/images/countdown2.png');

function getCountdownBackground(themeId: CelebrationThemeId) {
  if (themeId === 'wedding') return COUNTDOWN_WEDDING_BACKGROUND;
  if (themeId === 'birthday' || themeId === 'baptism') return COUNTDOWN_BIRTHDAY_BACKGROUND;
  return COUNTDOWN_DEFAULT_BACKGROUND;
}

type EventCountdownProps = {
  date?: string;
  location?: string;
  eventTheme: CelebrationThemeId;
};

export function EventCountdown({ date, location, eventTheme }: EventCountdownProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const countdown = useMemo(() => getEventCountdown(date), [date]);
  const backgroundSource = useMemo(
    () => getCountdownBackground(eventTheme),
    [eventTheme]
  );

  const isNoDate = countdown.kind === 'no_date';
  const isPast = countdown.kind === 'past';
  const showBackground = !isPast;

  const content = (
    <>
      {!isNoDate && countdown.kind === 'future' ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {t('overview.countdownLabel')}
        </Text>
      ) : null}

      {isNoDate ? (
        <Text style={[styles.noDateText, { color: theme.textSecondary }]}>
          {t('overview.countdownNoDate')}
        </Text>
      ) : isPast ? (
        <View style={styles.pastBlock}>
          <Text style={[styles.mainText, { color: theme.textMuted }]}>
            {t('overview.countdownPastTitle')}
          </Text>
          <Text style={[styles.hintText, { color: theme.textSecondary }]}>
            {t('overview.countdownPastHint')}
          </Text>
        </View>
      ) : countdown.kind === 'now' ? (
        <Text style={[styles.mainText, { color: theme.success }]}>
          {t('overview.countdownNow')}
        </Text>
      ) : (
        <Text style={[styles.mainText, { color: theme.primary }]}>
          {t(countdown.days === 1 ? 'overview.countdownDay' : 'overview.countdownDays', {
            count: countdown.days,
          })}
        </Text>
      )}

      {date ? (
        <Text style={[styles.dateText, { color: theme.text }]}>
          {formatDisplayDate(date, language)}
        </Text>
      ) : null}

      {location ? (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.locationText, { color: theme.textSecondary }]}>{location}</Text>
        </View>
      ) : null}
    </>
  );

  return (
    <Card style={[showBackground ? styles.cardWithImage : styles.cardPlain, { backgroundColor: theme.surface }]}>
      {showBackground ? (
        <ImageBackground
          source={backgroundSource}
          style={styles.background}
          imageStyle={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.content}>{content}</View>
        </ImageBackground>
      ) : (
        <View style={styles.contentPlain}>{content}</View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  cardWithImage: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  cardPlain: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  background: {
    width: '100%',
    minHeight: 168,
    backgroundColor: '#FFFCFA',
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  contentPlain: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    width: '100%',
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainText: {
    ...typography.heading,
    fontSize: 28,
    textAlign: 'center',
  },
  noDateText: {
    ...typography.body,
    textAlign: 'center',
  },
  pastBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  hintText: {
    ...typography.caption,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  dateText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  locationText: {
    ...typography.caption,
  },
});
