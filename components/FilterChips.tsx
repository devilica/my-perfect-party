import { ReactNode } from 'react';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';

import { GuestFilter } from '@/types/models';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type FilterOption = {
  id: GuestFilter;
  label: string;
};

type FilterChipsProps = {
  options: FilterOption[];
  selected: GuestFilter;
  onSelect: (filter: GuestFilter) => void;
  wrap?: boolean;
};

function Chip({
  option,
  active,
  onPress,
}: {
  option: FilterOption;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.primaryLight : theme.surface,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: active ? theme.primaryDark : theme.textSecondary,
            fontWeight: active ? '600' : '400',
          },
        ]}
      >
        {option.label}
      </Text>
    </Pressable>
  );
}

export function FilterChips({ options, selected, onSelect, wrap = false }: FilterChipsProps) {
  if (wrap) {
    return (
      <View style={styles.wrapContainer}>
        {options.map((option) => (
          <Chip
            key={option.id}
            option={option}
            active={selected === option.id}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {options.map((option) => (
        <Chip
          key={option.id}
          option={option}
          active={selected === option.id}
          onPress={() => onSelect(option.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...typography.caption,
  },
});

export function OptionChips<T extends string>({
  label,
  labelRight,
  options,
  selected,
  onSelect,
}: {
  label: string;
  labelRight?: ReactNode;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  const theme = useThemeColors();

  return (
    <View style={optionStyles.wrap}>
      <View style={optionStyles.labelRow}>
        <Text style={[optionStyles.label, { color: theme.textSecondary }]}>{label}</Text>
        {labelRight}
      </View>
      <View style={optionStyles.row}>
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                optionStyles.chip,
                {
                  backgroundColor: active ? theme.primaryLight : theme.surface,
                  borderColor: active ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  optionStyles.chipText,
                  {
                    color: active ? theme.primaryDark : theme.textSecondary,
                    fontWeight: active ? '600' : '400',
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const optionStyles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...typography.caption,
  },
});
