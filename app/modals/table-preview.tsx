import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormScrollView } from '@/components/FormScrollView';
import { TablePreviewDiagram } from '@/components/TablePreviewDiagram';
import { Card } from '@/components/ui';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { getEffectiveBottomInset } from '@/lib/safeAreaInsets';
import { DEFAULT_TABLE_SHAPE } from '@/constants/tableShapes';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import {
  buildTableSeatSlots,
  getGuestsAtTable,
  getTableOccupiedSeats,
} from '@/lib/seatingStats';
import { useWeddingStore } from '@/store/weddingStore';
import { getGuestFullName } from '@/types/models';
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
  const modalScrollPadding = useModalScrollPadding();
  const bottomInset = getEffectiveBottomInset(useSafeAreaInsets());

  const table = useMemo(
    () => (tableId ? tables.find((item) => item.id === tableId) : undefined),
    [tables, tableId]
  );

  const eventGuests = useMemo(
    () => guests.filter((guest) => guest.eventId === eventId),
    [guests, eventId]
  );

  const tableGuests = useMemo(
    () => (table ? getGuestsAtTable(eventGuests, table.id) : []),
    [table, eventGuests]
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
      <View style={[styles.safeArea, { paddingBottom: bottomInset }]}>
        <FormScrollView
          contentContainerStyle={[styles.content, { paddingBottom: modalScrollPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <TablePreviewDiagram
            tableName={table.name}
            occupied={occupied}
            capacity={table.capacity}
            seats={seats}
            shape={table.shape ?? DEFAULT_TABLE_SHAPE}
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

          <Card style={styles.guestCard}>
            <Text style={[styles.guestSectionTitle, { color: theme.textSecondary }]}>
              {t('seating.guestsAtTable')}
            </Text>
            {tableGuests.length === 0 ? (
              <Text style={[styles.emptyGuests, { color: theme.textMuted }]}>
                {t('seating.noGuestsAtTable')}
              </Text>
            ) : (
              tableGuests.map((guest) => (
                <View key={guest.id} style={styles.guestRow}>
                  <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
                  <Text style={[styles.guestName, { color: theme.text }]}>
                    {getGuestFullName(guest)}
                    {guest.partySize > 1 ? ` (+${guest.partySize - 1})` : ''}
                  </Text>
                </View>
              ))
            )}
          </Card>
        </FormScrollView>
      </View>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
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
  guestCard: {
    gap: spacing.sm,
  },
  guestSectionTitle: {
    ...typography.caption,
    fontWeight: '600',
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
    flex: 1,
  },
});
