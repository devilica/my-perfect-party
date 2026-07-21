import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { Card } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';
import { GuestStats } from '@/types/models';

type GuestAttendanceChartProps = {
  stats: GuestStats;
};

type ChartSegment = {
  key: 'needs_invite' | 'invitation_sent' | 'confirmed' | 'declined';
  value: number;
  color: string;
  labelKey: string;
};

export function GuestAttendanceChart({ stats }: GuestAttendanceChartProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  if (stats.totalPeople === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          {t('overview.attendanceChartEmpty')}
        </Text>
      </Card>
    );
  }

  const segments: ChartSegment[] = [
    {
      key: 'needs_invite',
      value: stats.needsInvitePeople,
      color: theme.pending,
      labelKey: 'guests.status.needs_invite',
    },
    {
      key: 'invitation_sent',
      value: stats.invitationSentPeople,
      color: theme.seatAlmostFull,
      labelKey: 'guests.status.invitation_sent',
    },
    {
      key: 'confirmed',
      value: stats.confirmedPeople,
      color: theme.success,
      labelKey: 'guests.status.confirmed',
    },
    {
      key: 'declined',
      value: stats.declinedPeople,
      color: theme.danger,
      labelKey: 'guests.status.declined',
    },
  ];

  const pieData = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => ({
      value: segment.value,
      color: segment.color,
      text: String(segment.value),
    }));

  return (
    <Card style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: theme.text }]}>
        {t('overview.attendanceChartTitle')}
      </Text>
      <View style={styles.pieWrap}>
        <PieChart
          data={pieData}
          donut
          radius={90}
          innerRadius={55}
          innerCircleColor={theme.surface}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={[styles.centerValue, { color: theme.text }]}>
                {stats.attendanceChartTotal}
              </Text>
              <Text style={[styles.centerCaption, { color: theme.textSecondary }]}>
                {t('overview.attendanceChartTotal')}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: segment.color }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>
              {t(segment.labelKey)}
            </Text>
            <Text style={[styles.legendAmount, { color: theme.textSecondary }]}>
              {segment.value}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chartTitle: {
    ...typography.subheading,
  },
  pieWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    ...typography.heading,
    fontSize: 24,
  },
  centerCaption: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  legend: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    ...typography.caption,
    flex: 1,
  },
  legendAmount: {
    ...typography.caption,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.caption,
    textAlign: 'center',
  },
});
