import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import {
  getGuestsAtTable,
  getTableOccupancyStatus,
  getTableOccupiedSeats,
  getTableRemainingSeats,
} from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { getGuestFullName, Guest, SeatingTable } from '@/types/models';
import { getOccupancyColors, radius, spacing, typography } from '@/theme/colors';

type TableCardProps = {
  table: SeatingTable;
  guests: Guest[];
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onGuestPress: (guest: Guest) => void;
};

export function TableCard({ table, guests, onPreview, onEdit, onDelete, onGuestPress }: TableCardProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const occupied = getTableOccupiedSeats(guests, table.id);
  const remaining = getTableRemainingSeats(table, guests);
  const status = getTableOccupancyStatus(table, guests);
  const occupancyColors = getOccupancyColors(status);
  const tableGuests = getGuestsAtTable(guests, table.id);
  const progress = table.capacity > 0 ? (occupied / table.capacity) * 100 : 0;

  const statusLabel =
    status === 'full'
      ? t('seating.full')
      : status === 'almostFull'
        ? t('seating.almostFull')
        : t('seating.available');

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Ionicons name="restaurant-outline" size={20} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>{table.name}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={onPreview} hitSlop={8}>
            <Ionicons name="eye-outline" size={20} color={theme.primary} />
          </Pressable>
          <Pressable onPress={onEdit} hitSlop={8}>
            <Ionicons name="create-outline" size={20} color={theme.primary} />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={theme.danger} />
          </Pressable>
        </View>
      </View>

      <Text style={[styles.occupied, { color: theme.text }]}>
        {t('seating.occupied', { occupied, capacity: table.capacity })}
      </Text>

      <View style={styles.progressWrap}>
        <View style={[styles.progressTrack, { backgroundColor: occupancyColors.light }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, progress)}%`,
                backgroundColor: occupancyColors.main,
              },
            ]}
          />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: occupancyColors.light }]}>
          <Text style={[styles.statusText, { color: occupancyColors.main }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <Text style={[styles.remaining, { color: theme.textSecondary }]}>
        {t('seating.remaining', { count: remaining })}
      </Text>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('seating.guestsAtTable')}
      </Text>
      {tableGuests.length === 0 ? (
        <Text style={[styles.emptyGuests, { color: theme.textMuted }]}>
          {t('seating.noGuestsAtTable')}
        </Text>
      ) : (
        tableGuests.map((guest) => (
          <Pressable
            key={guest.id}
            onPress={() => onGuestPress(guest)}
            style={styles.guestRow}
          >
            <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
            <Text style={[styles.guestName, { color: theme.text }]}>
              {getGuestFullName(guest)}
              {guest.partySize > 1 ? ` (+${guest.partySize - 1})` : ''}
            </Text>
          </Pressable>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    ...typography.subheading,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  occupied: {
    ...typography.body,
    fontWeight: '600',
  },
  progressWrap: {
    gap: spacing.sm,
  },
  progressTrack: {
    height: 10,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusText: {
    ...typography.small,
    fontWeight: '700',
  },
  remaining: {
    ...typography.caption,
  },
  sectionLabel: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  emptyGuests: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  guestName: {
    ...typography.body,
  },
});
