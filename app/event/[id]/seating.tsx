import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GuestFilterBar } from '@/components/GuestFilterBar';
import { SeatingAssignmentModal } from '@/components/SeatingAssignmentModal';
import { TableCard } from '@/components/TableCard';
import { ThemedScreenContainer } from '@/components/ThemedScreenContainer';
import { EmptyState, Fab, StatCard } from '@/components/ui';
import {
  FAB_SIZE,
  useFabBottomOffset,
  useFabScrollPadding,
} from '@/hooks/useFabBottomOffset';
import { filterGuests } from '@/lib/guestStats';
import { getSeatingStats, getTablesForEvent } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useEventId } from '@/lib/useEventId';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { getGuestFullName, Guest, GuestFilter } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

export default function SeatingScreen() {
  const eventId = useEventId();
  const router = useRouter();
  const [filter, setFilter] = useState<GuestFilter>('all');
  const [fabOpen, setFabOpen] = useState(false);
  const [assignGuest, setAssignGuest] = useState<Guest | null>(null);

  const language = useWeddingStore((s) => s.language);
  const allGuests = useWeddingStore((s) => s.guests);
  const allTables = useWeddingStore((s) => s.tables);
  const deleteTable = useWeddingStore((s) => s.deleteTable);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const fabScrollPadding = useFabScrollPadding();
  const fabBottomOffset = useFabBottomOffset();
  const fabMenuBottom = fabBottomOffset + FAB_SIZE;

  const eventGuests = useMemo(
    () => allGuests.filter((guest) => guest.eventId === eventId),
    [allGuests, eventId]
  );

  const tables = useMemo(
    () => getTablesForEvent(allTables, eventId),
    [allTables, eventId]
  );

  const seatingStats = useMemo(
    () => getSeatingStats(allTables, allGuests, eventId),
    [allTables, allGuests, eventId]
  );

  const unassignedGuests = useMemo(
    () => eventGuests.filter((guest) => !guest.tableId),
    [eventGuests]
  );

  const filteredUnassigned = useMemo(
    () => filterGuests(allGuests, eventId, filter).filter((guest) => !guest.tableId),
    [allGuests, eventId, filter]
  );

  const handleDeleteTable = (tableId: string) => {
    Alert.alert(t('seating.deleteTable'), t('seating.deleteTableConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => deleteTable(tableId),
      },
    ]);
  };

  return (
    <ThemedScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: fabScrollPadding + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          <StatCard
            label={t('overview.tablesTotal')}
            value={String(seatingStats.totalTables)}
          />
          <StatCard
            label={t('overview.tablesFull')}
            value={String(seatingStats.fullTables)}
            accent={theme.seatFull}
          />
          <StatCard
            label={t('overview.tablesAvailable')}
            value={String(seatingStats.availableTables)}
            accent={theme.seatAvailable}
          />
        </View>

        {unassignedGuests.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('seating.unassignedGuests')}
            </Text>
            <GuestFilterBar selected={filter} onSelect={setFilter} />
            <View style={styles.chipWrap}>
              {filteredUnassigned.map((guest) => (
                <Pressable
                  key={guest.id}
                  style={[styles.guestChip, { backgroundColor: theme.primaryLight }]}
                  onPress={() => setAssignGuest(guest)}
                >
                  <Text style={[styles.guestChipText, { color: theme.primaryDark }]}>
                    {getGuestFullName(guest)} ({guest.partySize})
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {tables.length === 0 ? (
          <EmptyState
            icon="restaurant-outline"
            title={t('seating.emptyTitle')}
            subtitle={t('seating.emptySubtitle')}
          />
        ) : (
          tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              guests={eventGuests}
              onEdit={() =>
                router.push(`/modals/table-form?eventId=${eventId}&tableId=${table.id}`)
              }
              onDelete={() => handleDeleteTable(table.id)}
              onGuestPress={setAssignGuest}
            />
          ))
        )}
      </ScrollView>

      <Fab onPress={() => setFabOpen(true)} icon="add" />

      <Modal visible={fabOpen} transparent animationType="fade" onRequestClose={() => setFabOpen(false)}>
        <Pressable
          style={[styles.fabOverlay, { backgroundColor: theme.overlay }]}
          onPress={() => setFabOpen(false)}
        >
          <View style={[styles.fabMenu, { backgroundColor: theme.surface, marginBottom: fabMenuBottom }]}>
            <Pressable
              style={styles.fabMenuItem}
              onPress={() => {
                setFabOpen(false);
                router.push(`/modals/table-form?eventId=${eventId}`);
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color={theme.primary} />
              <Text style={[styles.fabMenuText, { color: theme.text }]}>{t('seating.addTable')}</Text>
            </Pressable>
            <Pressable
              style={styles.fabMenuItem}
              onPress={() => {
                setFabOpen(false);
                router.push(`/modals/bulk-tables?eventId=${eventId}`);
              }}
            >
              <Ionicons name="grid-outline" size={20} color={theme.primary} />
              <Text style={[styles.fabMenuText, { color: theme.text }]}>{t('seating.bulkCreate')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <SeatingAssignmentModal
        visible={!!assignGuest}
        guest={assignGuest}
        eventId={eventId}
        onClose={() => setAssignGuest(null)}
      />
    </ThemedScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  guestChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  guestChipText: {
    ...typography.caption,
    fontWeight: '600',
  },
  fabOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  fabMenu: {
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  fabMenuText: {
    ...typography.body,
    fontWeight: '600',
  },
});
