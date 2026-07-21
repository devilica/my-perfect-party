import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { formatDisplayDate } from '@/lib/dateUtils';
import { getNextObligationStatus } from '@/lib/obligationStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { Obligation, ObligationStatus } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

type ObligationCardProps = {
  obligation: Obligation;
  onPress: () => void;
  onDelete: () => void;
};

function getStatusColors(status: ObligationStatus, theme: ReturnType<typeof useThemeColors>) {
  switch (status) {
    case 'confirmed':
      return {
        bg: theme.successLight,
        text: theme.success,
        icon: 'checkmark-circle' as const,
      };
    case 'scheduled':
      return {
        bg: theme.pendingLight,
        text: theme.seatAlmostFull,
        icon: 'calendar-outline' as const,
      };
    default:
      return {
        bg: theme.surface,
        text: theme.textMuted,
        icon: 'ellipse-outline' as const,
      };
  }
}

export function ObligationCard({ obligation, onPress, onDelete }: ObligationCardProps) {
  const language = useWeddingStore((s) => s.language);
  const setObligationStatus = useWeddingStore((s) => s.setObligationStatus);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const statusColors = getStatusColors(obligation.status, theme);
  const statusLabel =
    obligation.status === 'confirmed'
      ? t('obligations.status.confirmed')
      : obligation.status === 'scheduled'
        ? t('obligations.status.scheduled')
        : t('obligations.status.notScheduled');

  const handleStatusPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setObligationStatus(obligation.id, getNextObligationStatus(obligation.status));
  };

  return (
    <Card style={styles.card}>
      <Pressable onPress={onPress} style={styles.main}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {obligation.title}
          </Text>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
          </Pressable>
        </View>

        {obligation.date ? (
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {formatDisplayDate(obligation.date, language)}
            </Text>
          </View>
        ) : null}

        {obligation.contact ? (
          <View style={styles.metaRow}>
            <Ionicons name="call-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>
              {obligation.contact}
            </Text>
          </View>
        ) : null}

        {obligation.note ? (
          <Text style={[styles.note, { color: theme.textMuted }]} numberOfLines={2}>
            {obligation.note}
          </Text>
        ) : null}

        <Pressable
          onPress={handleStatusPress}
          style={[styles.statusChip, { backgroundColor: statusColors.bg }]}
        >
          <Ionicons name={statusColors.icon} size={16} color={statusColors.text} />
          <Text style={[styles.statusText, { color: statusColors.text }]}>{statusLabel}</Text>
        </Pressable>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  main: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    flex: 1,
  },
  note: {
    ...typography.caption,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
