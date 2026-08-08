import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/ui';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { sortGuests } from '@/lib/guestStats';
import { getAssignableGuestsForTable, getTableRemainingSeats } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { getGuestFullName, SeatingTable } from '@/types/models';
import { colors, radius, spacing, typography } from '@/theme/colors';

type TableGuestPickerSheetProps = {
  visible: boolean;
  table: SeatingTable | null;
  eventId: string;
  onClose: () => void;
};

function matchesSearch(guest: { firstName: string; lastName: string; phone?: string }, query: string) {
  const haystack = `${guest.firstName} ${guest.lastName} ${guest.phone ?? ''}`.toLowerCase();
  return haystack.includes(query);
}

export function TableGuestPickerSheet({
  visible,
  table,
  eventId,
  onClose,
}: TableGuestPickerSheetProps) {
  const language = useWeddingStore((s) => s.language);
  const guests = useWeddingStore((s) => s.guests);
  const assignGuestToTable = useWeddingStore((s) => s.assignGuestToTable);
  const { t } = useTranslation(language);
  const bottomSheetPadding = useBottomSheetPadding();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!visible) {
      setSearch('');
    }
  }, [visible]);

  const assignableGuests = useMemo(() => {
    if (!table) return [];
    return sortGuests(getAssignableGuestsForTable(guests, table, eventId));
  }, [guests, table, eventId]);

  const filteredGuests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assignableGuests;
    return assignableGuests.filter((guest) => matchesSearch(guest, query));
  }, [assignableGuests, search]);

  if (!table) return null;

  const remainingSeats = getTableRemainingSeats(table, guests);

  const handleAssign = (guestId: string) => {
    const success = assignGuestToTable(guestId, table.id);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: bottomSheetPadding }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.sheetContent}>
            <Text style={styles.title}>{t('seating.assignGuestTitle')}</Text>
            <Text style={styles.tableName}>{table.name}</Text>
            <Text style={styles.remaining}>
              {t('seating.remaining', { count: remainingSeats })}
            </Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('guests.searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={styles.search}
              autoCorrect={false}
              autoCapitalize="none"
            />

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {filteredGuests.map((guest) => (
                <Pressable key={guest.id} style={styles.option} onPress={() => handleAssign(guest.id)}>
                  <Text style={styles.optionText}>{getGuestFullName(guest)}</Text>
                  <Text style={styles.optionMeta}>
                    {t('guests.guestsCount', { count: guest.partySize })}
                  </Text>
                </Pressable>
              ))}
              {assignableGuests.length === 0 ? (
                <Text style={styles.empty}>{t('seating.capacityError')}</Text>
              ) : null}
            </ScrollView>

            <Button label={t('common.close')} variant="ghost" onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.md,
    height: '75%',
    maxHeight: '75%',
  },
  sheetContent: {
    flex: 1,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tableName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  remaining: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  search: {
    ...typography.body,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
    marginBottom: spacing.md,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  optionMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  empty: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
