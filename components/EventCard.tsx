import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { formatDisplayDate } from '@/lib/dateUtils';
import { getGuestStats } from '@/lib/guestStats';
import { getSeatingStats } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { getCelebrationTheme } from '@/theme/celebrations';
import { WeddingEvent } from '@/types/models';
import { colors, radius, spacing, typography } from '@/theme/colors';

type EventCardProps = {
  event: WeddingEvent;
  onPress: () => void;
  onEdit: () => void;
};

export function EventCard({ event, onPress, onEdit }: EventCardProps) {
  const language = useWeddingStore((s) => s.language);
  const guests = useWeddingStore((s) => s.guests);
  const tables = useWeddingStore((s) => s.tables);
  const { t } = useTranslation(language);
  const celebrationTheme = useMemo(
    () => getCelebrationTheme(event.theme),
    [event.theme]
  );

  const guestStats = useMemo(() => getGuestStats(guests, event.id), [guests, event.id]);
  const seatingStats = useMemo(
    () => getSeatingStats(tables, guests, event.id),
    [tables, guests, event.id]
  );

  return (
    <Card
      onPress={onPress}
      style={{
        ...styles.card,
        borderLeftWidth: 4,
        borderLeftColor: celebrationTheme.colors.primary,
      }}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: celebrationTheme.colors.primaryLight },
          ]}
        >
          <Ionicons
            name={celebrationTheme.icon}
            size={22}
            color={celebrationTheme.colors.primary}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {event.name}
          </Text>
          {event.date ? (
            <Text style={styles.meta}>{formatDisplayDate(event.date, language)}</Text>
          ) : null}
          {event.location ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={celebrationTheme.colors.textMuted} />
              <Text style={styles.meta}>{event.location}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.actions}>
          <Pressable onPress={onEdit} hitSlop={8}>
            <Ionicons name="pencil-outline" size={20} color={celebrationTheme.colors.primary} />
          </Pressable>
          <Ionicons name="chevron-forward" size={20} color={celebrationTheme.colors.textMuted} />
        </View>
      </View>
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: celebrationTheme.colors.primaryLight }]}>
          <Ionicons name="people-outline" size={14} color={celebrationTheme.colors.primaryDark} />
          <Text style={[styles.badgeText, { color: celebrationTheme.colors.primaryDark }]}>
            {t('events.guestsBadge', {
              confirmed: guestStats.confirmedPeople,
              total: guestStats.totalPeople,
            })}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: celebrationTheme.colors.primaryLight }]}>
          <Ionicons name="restaurant-outline" size={14} color={celebrationTheme.colors.primaryDark} />
          <Text style={[styles.badgeText, { color: celebrationTheme.colors.primaryDark }]}>
            {t('events.tablesBadge', { count: seatingStats.totalTables })}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.subheading,
    color: colors.text,
  },
  meta: {
    ...typography.small,
    color: colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '600',
  },
});
