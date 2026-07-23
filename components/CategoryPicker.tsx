import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { SelectField } from '@/components/SelectField';
import { TextInputField } from '@/components/ui';
import { PREDEFINED_CATEGORIES } from '@/constants/categories';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { ExpenseCategory, PredefinedCategory } from '@/types/models';
import { spacing } from '@/theme/colors';

type CategoryPickerProps = {
  selected: ExpenseCategory;
  customCategory: string;
  onSelect: (category: ExpenseCategory) => void;
  onCustomChange: (value: string) => void;
  customRequired?: boolean;
};

type CategoryOption = PredefinedCategory | 'other';

export function CategoryPicker({
  selected,
  customCategory,
  onSelect,
  onCustomChange,
  customRequired,
}: CategoryPickerProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  const selectValue: CategoryOption = useMemo(() => {
    if (PREDEFINED_CATEGORIES.includes(selected as PredefinedCategory)) {
      return selected as PredefinedCategory;
    }
    return 'other';
  }, [selected]);

  const options = useMemo(
    () =>
      PREDEFINED_CATEGORIES.map((category) => ({
        value: category as CategoryOption,
        label: t(`categories.${category}`),
      })),
    [t]
  );

  const showCustom = selectValue === 'other';

  return (
    <View style={styles.container}>
      <SelectField<CategoryOption>
        label={t('expenses.category')}
        value={selectValue}
        options={options}
        onChange={(category) => {
          if (category === 'other') {
            onSelect('other');
            return;
          }
          onSelect(category);
        }}
      />
      {showCustom ? (
        <TextInputField
          label={t('expenses.customCategory')}
          required={customRequired}
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
});
