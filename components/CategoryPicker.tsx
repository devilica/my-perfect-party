import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { SelectField } from '@/components/SelectField';
import { TextInputField } from '@/components/ui';
import { isPredefinedCategory, PREDEFINED_CATEGORIES } from '@/constants/categories';
import { getEventCustomExpenseCategories } from '@/lib/expenseStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { ExpenseCategory } from '@/types/models';
import { spacing } from '@/theme/colors';

type CategoryPickerProps = {
  eventId?: string;
  selected: ExpenseCategory;
  customCategory: string;
  onSelect: (category: ExpenseCategory) => void;
  onCustomChange: (value: string) => void;
  dense?: boolean;
};

export function CategoryPicker({
  eventId,
  selected,
  customCategory,
  onSelect,
  onCustomChange,
  dense = false,
}: CategoryPickerProps) {
  const language = useWeddingStore((s) => s.language);
  const expenses = useWeddingStore((s) => s.expenses);
  const { t } = useTranslation(language);

  const customFromEvent = useMemo(
    () => (eventId ? getEventCustomExpenseCategories(expenses, eventId) : []),
    [eventId, expenses]
  );

  const customOptions = customFromEvent;

  const selectValue = useMemo((): string => {
    if (isPredefinedCategory(selected)) {
      return selected;
    }
    if (typeof selected === 'string' && selected.trim() && selected !== 'other') {
      return selected.trim();
    }
    return 'other';
  }, [selected]);

  const options = useMemo(
    () => [
      ...customOptions.map((category) => ({
        value: category,
        label: category,
      })),
      ...PREDEFINED_CATEGORIES.map((category) => ({
        value: category,
        label: t(`categories.${category}`),
      })),
    ],
    [customOptions, t]
  );

  const showCustom = selectValue === 'other';

  return (
    <View style={[styles.container, dense && styles.containerDense]}>
      <SelectField<string>
        label={t('expenses.category')}
        value={selectValue}
        options={options}
        dense={dense}
        onChange={(category) => {
          if (category === 'other') {
            onSelect('other');
            return;
          }
          if (isPredefinedCategory(category)) {
            onSelect(category);
            if (category !== 'other') {
              onCustomChange('');
            }
            return;
          }
          onSelect(category);
          onCustomChange(category);
        }}
      />
      {showCustom ? (
        <TextInputField
          label={t('expenses.customCategory')}
          value={customCategory}
          onChangeText={(text: string) => {
            onCustomChange(text);
            if (selectValue !== 'other') {
              onSelect('other');
            }
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
  containerDense: {
    marginBottom: 0,
  },
});
