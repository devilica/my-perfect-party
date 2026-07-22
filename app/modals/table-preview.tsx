import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TablePreviewDiagram } from '@/components/TablePreviewDiagram';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import {
  buildTableSeatSlots,
  getTableOccupiedSeats,
} from '@/lib/seatingStats';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

export default function TablePreviewModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string; tableId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const tableId = getRouteParam(params.tableId);
  const language = useWeddingStore((s) => s.language);
  const tables = useWeddingStore((s) => s.tables);
  const guests = useWeddingStore((s) => s.guests);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');

  const table = useMemo(
    () => (tableId ? tables.find((item) => item.id === tableId) : undefined),
    [tables, tableId]
  );

  const eventGuests = useMemo(
    () => guests.filter((guest) => guest.eventId === eventId),
    [guests, eventId]
  );

  const seats = useMemo(
    () => (table ? buildTableSeatSlots(table, eventGuests) : []),
    [table, eventGuests]
  );

  const occupied = table ? getTableOccupiedSeats(eventGuests, table.id) : 0;

  useEffect(() => {
    if (!table) {
      router.back();
    }
  }, [table, router]);

  if (!table || !eventId) {
    return null;
  }

  return (
    <ThemedEventModal eventId={eventId}>
      <Stack.Screen
        options={getThemedModalScreenOptions(celebrationTheme, t('seating.previewTitle'))}
      />
      <View style={styles.content}>
        <TablePreviewDiagram
          tableName={table.name}
          occupied={occupied}
          capacity={table.capacity}
          seats={seats}
        />
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.seatFull }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              {t('seating.previewOccupied')}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.seatAvailable }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              {t('seating.previewFree')}
            </Text>
          </View>
        </View>
      </View>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: radius.full,
  },
  legendText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
