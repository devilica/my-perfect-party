import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { getGuestCategoryLabel } from '@/constants/guestCategories';
import { Card } from '@/components/ui';
import { getNextAttendanceStatus } from '@/lib/guestStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import {
  AttendanceStatus,
  getGuestFullName,
  Guest,
  SeatingTable,
} from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

type GuestCardProps = {
  guest: Guest;
  table?: SeatingTable;
  onPress: () => void;
  onViewSeat?: () => void;
  onDelete: () => void;
};

function getStatusColors(status: AttendanceStatus, theme: ReturnType<typeof useThemeColors>) {
  switch (status) {
    case 'confirmed':
      return {
        bg: theme.successLight,
        text: theme.success,
        icon: 'checkmark-circle' as const,
      };
    case 'declined':
      return {
        bg: theme.dangerLight,
        text: theme.danger,
        icon: 'close-circle' as const,
      };
    case 'invitation_sent':
      return {
        bg: theme.pendingLight,
        text: theme.seatAlmostFull,
        icon: 'mail-outline' as const,
      };
    default:
      return {
        bg: theme.surface,
        text: theme.textMuted,
        icon: 'call-outline' as const,
      };
  }
}

export function GuestCard({ guest, table, onPress, onViewSeat, onDelete }: GuestCardProps) {
  const language = useWeddingStore((s) => s.language);
  const setGuestAttendance = useWeddingStore((s) => s.setGuestAttendance);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const statusColors = getStatusColors(guest.attendanceStatus, theme);

  const statusLabel = t(`guests.status.${guest.attendanceStatus}`);

  const handleStatusPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setGuestAttendance(guest.id, getNextAttendanceStatus(guest.attendanceStatus));
  };

  return (
    <Card style={styles.card}>
      <Pressable onPress={onPress} style={styles.main}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.text }]}>{getGuestFullName(guest)}</Text>
          <View style={styles.headerActions}>
            {table && onViewSeat ? (
              <Pressable
                onPress={onViewSeat}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t('guests.seatCard')}
              >
                <MaterialCommunityIcons name="table-chair" size={20} color={theme.primary} />
              </Pressable>
            ) : null}
            <Pressable onPress={onDelete} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={theme.danger} />
            </Pressable>
          </View>
        </View>

        <View style={styles.metaRow}>
          {guest.category.trim() ? (
            <View style={[styles.chip, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.chipText, { color: theme.primaryDark }]}>
                {getGuestCategoryLabel(guest.category, t)}
              </Text>
            </View>
          ) : null}
          <View style={[styles.chip, { backgroundColor: theme.pendingLight }]}>
            <Text style={[styles.chipText, { color: theme.textSecondary }]}>
              {t('guests.guestsCount', { count: guest.partySize })}
            </Text>
          </View>
        </View>

        {guest.phone ? (
          <Text style={[styles.phone, { color: theme.textSecondary }]}>{guest.phone}</Text>
        ) : null}
        {table ? (
          <Text style={[styles.table, { color: theme.primaryDark }]}>
            {t('guests.atTable', { name: table.name })}
          </Text>
        ) : null}
        {guest.note ? (
          <Text style={[styles.note, { color: theme.textMuted }]}>{guest.note}</Text>
        ) : null}
      </Pressable>

      <Pressable onPress={handleStatusPress} style={[styles.statusRow, { backgroundColor: statusColors.bg }]}>
        <Ionicons name={statusColors.icon} size={18} color={statusColors.text} />
        <Text style={[styles.statusText, { color: statusColors.text }]}>{statusLabel}</Text>
        <Text style={[styles.statusHint, { color: theme.textMuted }]}>{t('guests.tapStatus')}</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    padding: 0,
    overflow: 'hidden',
  },
  main: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  name: {
    ...typography.subheading,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  chipText: {
    ...typography.small,
    fontWeight: '600',
  },
  phone: {
    ...typography.caption,
  },
  table: {
    ...typography.caption,
    fontWeight: '600',
  },
  note: {
    ...typography.small,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
  },
  statusHint: {
    ...typography.small,
    marginLeft: 'auto',
  },
});
