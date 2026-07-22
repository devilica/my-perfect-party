import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { getAssignableTables } from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { getGuestFullName, Guest, SeatingTable } from '@/types/models';
import { colors, radius, spacing, typography } from '@/theme/colors';

type SeatingAssignmentModalProps = {
  visible: boolean;
  guest: Guest | null;
  eventId: string;
  onClose: () => void;
};

export function SeatingAssignmentModal({
  visible,
  guest,
  eventId,
  onClose,
}: SeatingAssignmentModalProps) {
  const language = useWeddingStore((s) => s.language);
  const tables = useWeddingStore((s) => s.tables);
  const allGuests = useWeddingStore((s) => s.guests);
  const assignGuestToTable = useWeddingStore((s) => s.assignGuestToTable);
  const { t } = useTranslation(language);
  const bottomSheetPadding = useBottomSheetPadding();

  if (!guest) return null;

  const assignableTables = getAssignableTables(tables, allGuests, eventId, guest);

  const handleAssign = (tableId: string | null) => {
    const success = assignGuestToTable(guest.id, tableId);
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
          <Text style={styles.title}>{t('seating.assignGuestTitle')}</Text>
          <Text style={styles.guestName}>{getGuestFullName(guest)}</Text>
          <Text style={styles.partySize}>
            {t('guests.guestsCount', { count: guest.partySize })}
          </Text>

          <Text style={styles.label}>{t('seating.selectTable')}</Text>
          <ScrollView
            style={styles.list}
            contentContainerStyle={{ paddingBottom: spacing.sm }}
            nestedScrollEnabled
          >
            {guest.tableId ? (
              <Pressable style={styles.option} onPress={() => handleAssign(null)}>
                <Text style={styles.optionText}>{t('seating.unassign')}</Text>
              </Pressable>
            ) : null}
            {assignableTables.map((table: SeatingTable) => (
              <Pressable
                key={table.id}
                style={[
                  styles.option,
                  guest.tableId === table.id && styles.optionActive,
                ]}
                onPress={() => handleAssign(table.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    guest.tableId === table.id && styles.optionTextActive,
                  ]}
                >
                  {table.name} ({table.capacity})
                </Text>
              </Pressable>
            ))}
            {assignableTables.length === 0 && !guest.tableId ? (
              <Text style={styles.empty}>{t('seating.capacityError')}</Text>
            ) : null}
          </ScrollView>

          <Button label={t('common.close')} variant="ghost" onPress={onClose} />
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
    padding: spacing.lg,
    maxHeight: '70%',
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  guestName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  partySize: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  list: {
    maxHeight: 220,
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  optionActive: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  empty: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
