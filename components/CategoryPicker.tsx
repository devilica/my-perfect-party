import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TextInputField } from '@/components/ui';
import { PREDEFINED_CATEGORIES } from '@/constants/categories';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { ExpenseCategory, PredefinedCategory } from '@/types/models';
import { colors, radius, spacing, typography } from '@/theme/colors';

type CategoryPickerProps = {
  selected: ExpenseCategory;
  customCategory: string;
  onSelect: (category: ExpenseCategory) => void;
  onCustomChange: (value: string) => void;
};

export function CategoryPicker({
  selected,
  customCategory,
  onSelect,
  onCustomChange,
}: CategoryPickerProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  const showCustom =
    selected === 'other' || !PREDEFINED_CATEGORIES.includes(selected as PredefinedCategory);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('expenses.category')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {PREDEFINED_CATEGORIES.map((category) => {
          const active = selected === category;
          return (
            <Pressable
              key={category}
              onPress={() => onSelect(category)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {t(`categories.${category}`)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {showCustom ? (
        <TextInputField
          label={t('expenses.customCategory')}
          value={customCategory}
          onChangeText={(text: string) => {
            onCustomChange(text);
            if (text.trim()) onSelect(text.trim());
          }}
          placeholder={t('expenses.customCategoryPlaceholder')}
        />
      ) : null}
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
