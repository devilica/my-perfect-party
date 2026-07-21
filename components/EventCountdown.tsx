import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { formatDisplayDate, getEventCountdown } from '@/lib/dateUtils';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';

type EventCountdownProps = {
  date?: string;
  location?: string;
};

export function EventCountdown({ date, location }: EventCountdownProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const countdown = useMemo(() => getEventCountdown(date), [date]);

  const isNoDate = countdown.kind === 'no_date';
  const isPast = countdown.kind === 'past';

  return (
    <Card style={styles.card}>
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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.lg,
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
