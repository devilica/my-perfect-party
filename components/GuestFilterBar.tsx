import { StyleSheet, Text, View } from 'react-native';

import { FilterChips } from '@/components/FilterChips';
import {
  ATTENDANCE_FILTERS,
  getCategoryFilters,
  getGuestFilterLabel,
} from '@/constants/guestFilters';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { GuestFilter } from '@/types/models';
import { spacing, typography } from '@/theme/colors';
import { useThemeColors } from '@/theme/EventThemeContext';

type GuestFilterBarProps = {
  categories: string[];
  selected: GuestFilter;
  onSelect: (filter: GuestFilter) => void;
};

export function GuestFilterBar({ categories, selected, onSelect }: GuestFilterBarProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const attendanceOptions = ATTENDANCE_FILTERS.map((filter) => ({
    id: filter,
    label: getGuestFilterLabel(filter, t),
  }));

  const categoryFilters = getCategoryFilters(categories);
  const categoryOptions = categoryFilters.map((filter) => ({
    id: filter,
    label: getGuestFilterLabel(filter, t),
  }));

  return (
    <View style={styles.container}>
      <FilterChips options={attendanceOptions} selected={selected} onSelect={onSelect} />
      {categoryOptions.length > 0 ? (
        <View style={styles.categorySection}>
          <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
            {t('guests.category')}
          </Text>
          <FilterChips
            options={categoryOptions}
            selected={selected}
            onSelect={onSelect}
            wrap
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  categorySection: {
    marginTop: spacing.xs,
  },
  categoryLabel: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
});
