import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormScrollView } from '@/components/FormScrollView';
import { TableGuestPickerSheet } from '@/components/TableGuestPickerSheet';
import { TablePreviewDiagram } from '@/components/TablePreviewDiagram';
import { Button, Card } from '@/components/ui';
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
  getTableRemainingSeats,
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
  const assignGuestToTable = useWeddingStore((s) => s.assignGuestToTable);
  const moveGuestAtTable = useWeddingStore((s) => s.moveGuestAtTable);
  const swapGuestsAtTable = useWeddingStore((s) => s.swapGuestsAtTable);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const modalScrollPadding = useModalScrollPadding();
  const bottomInset = getEffectiveBottomInset(useSafeAreaInsets());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

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
  const remainingSeats = table ? getTableRemainingSeats(table, eventGuests) : 0;

  const handleUnassignGuest = (guestId: string) => {
    assignGuestToTable(guestId, null);
    if (selectedGuestId === guestId) setSelectedGuestId(null);
  };

  const handleGuestPress = (guestId: string) => {
    if (selectedGuestId === guestId) {
      setSelectedGuestId(null);
      return;
    }
    if (selectedGuestId) {
      swapGuestsAtTable(selectedGuestId, guestId);
      setSelectedGuestId(null);
      return;
    }
    setSelectedGuestId(guestId);
  };

  useEffect(() => {
    if (!table) {
      router.back();
    }
  }, [table, router]);

  useEffect(() => {
    if (selectedGuestId && !tableGuests.some((guest) => guest.id === selectedGuestId)) {
      setSelectedGuestId(null);
    }
  }, [selectedGuestId, tableGuests]);

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
            selectedGuestId={selectedGuestId}
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
            {tableGuests.length > 0 ? (
              <Text style={[styles.reorderHint, { color: theme.textMuted }]}>
                {t('seating.reorderHint')}
              </Text>
            ) : null}
            {tableGuests.length === 0 ? (
              <Text style={[styles.emptyGuests, { color: theme.textMuted }]}>
                {t('seating.noGuestsAtTable')}
              </Text>
            ) : (
              tableGuests.map((guest, index) => {
                const isSelected = selectedGuestId === guest.id;
                return (
                  <View
                    key={guest.id}
                    style={[
                      styles.guestRow,
                      isSelected && {
                        backgroundColor: theme.primaryLight,
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    <Text style={[styles.seatNumber, { color: theme.textSecondary }]}>
                      {index + 1}
                    </Text>
                    <Pressable
                      onPress={() => handleGuestPress(guest.id)}
                      style={styles.guestNamePressable}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={getGuestFullName(guest)}
                    >
                      <Ionicons
                        name={isSelected ? 'person' : 'person-outline'}
                        size={16}
                        color={isSelected ? theme.primaryDark : theme.textSecondary}
                      />
                      <Text
                        style={[
                          styles.guestName,
                          { color: isSelected ? theme.primaryDark : theme.text },
                        ]}
                      >
                        {getGuestFullName(guest)}
                        {guest.partySize > 1 ? ` (+${guest.partySize - 1})` : ''}
                      </Text>
                    </Pressable>
                    <View style={styles.moveButtons}>
                      <Pressable
                        onPress={() => moveGuestAtTable(guest.id, 'up')}
                        disabled={index === 0}
                        hitSlop={6}
                        accessibilityRole="button"
                        accessibilityLabel={t('seating.moveUp')}
                        style={({ pressed }) => [
                          styles.moveButton,
                          (index === 0 || pressed) && styles.pressed,
                          index === 0 && styles.moveDisabled,
                        ]}
                      >
                        <Ionicons
                          name="arrow-up"
                          size={20}
                          color={index === 0 ? theme.textMuted : theme.textSecondary}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => moveGuestAtTable(guest.id, 'down')}
                        disabled={index === tableGuests.length - 1}
                        hitSlop={6}
                        accessibilityRole="button"
                        accessibilityLabel={t('seating.moveDown')}
                        style={({ pressed }) => [
                          styles.moveButton,
                          (index === tableGuests.length - 1 || pressed) && styles.pressed,
                          index === tableGuests.length - 1 && styles.moveDisabled,
                        ]}
                      >
                        <Ionicons
                          name="arrow-down"
                          size={20}
                          color={
                            index === tableGuests.length - 1
                              ? theme.textMuted
                              : theme.textSecondary
                          }
                        />
                      </Pressable>
                    </View>
                    <Pressable
                      onPress={() => handleUnassignGuest(guest.id)}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={t('seating.unassign')}
                      style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
                    >
                      <Ionicons name="close-circle-outline" size={22} color={theme.danger} />
                    </Pressable>
                  </View>
                );
              })
            )}
          </Card>

          <Button
            label={t('seating.assignGuest')}
            onPress={() => setPickerVisible(true)}
            variant="secondary"
            icon="person-add-outline"
            disabled={remainingSeats === 0}
          />
        </FormScrollView>
      </View>

      <TableGuestPickerSheet
        visible={pickerVisible}
        table={table}
        eventId={eventId}
        onClose={() => setPickerVisible(false)}
      />
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
  reorderHint: {
    ...typography.small,
    marginBottom: spacing.xs,
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
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  seatNumber: {
    ...typography.caption,
    fontWeight: '700',
    minWidth: 18,
    textAlign: 'center',
  },
  guestNamePressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 36,
  },
  guestName: {
    ...typography.body,
    flex: 1,
    fontWeight: '600',
  },
  moveButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  moveButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  moveDisabled: {
    opacity: 0.45,
  },
  removeButton: {
    marginLeft: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
});
