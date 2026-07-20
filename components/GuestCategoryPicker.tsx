import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DEFAULT_GUEST_CATEGORIES } from '@/constants/guestCategories';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { colors, radius, spacing, typography } from '@/theme/colors';

type GuestCategoryPickerProps = {
  eventId: string;
  selected: string;
  onSelect: (category: string) => void;
};

export function GuestCategoryPicker({ eventId, selected, onSelect }: GuestCategoryPickerProps) {
  const language = useWeddingStore((s) => s.language);
  const event = useWeddingStore((s) => s.events.find((e) => e.id === eventId));
  const { t } = useTranslation(language);

  const categories = event?.guestCategories ?? DEFAULT_GUEST_CATEGORIES;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('guests.category')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {categories.map((category) => {
          const active = selected === category;
          return (
            <Pressable
              key={category}
              onPress={() => onSelect(category)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{category}</Text>
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
