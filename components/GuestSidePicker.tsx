import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { colors, radius, spacing, typography } from '@/theme/colors';

type GuestSidePickerProps = {
  eventId: string;
  selected: string;
  onSelect: (side: string) => void;
};

export function GuestSidePicker({ eventId, selected, onSelect }: GuestSidePickerProps) {
  const language = useWeddingStore((s) => s.language);
  const event = useWeddingStore((s) => s.events.find((e) => e.id === eventId));
  const { t } = useTranslation(language);

  const sides = event?.guestSides ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('guests.side')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {sides.map((side) => {
          const active = selected === side;
          return (
            <Pressable
              key={side}
              onPress={() => onSelect(side)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{side}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  scroll: {
    marginBottom: spacing.md,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
