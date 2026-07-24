import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FieldLabel } from '@/components/FieldLabel';
import { TableShapeIcon } from '@/components/TableShapeIcon';
import {
  isTableShapeAllowed,
  TABLE_SHAPES,
} from '@/constants/tableShapes';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { TableShape } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

const COMPACT_ICON_SIZE = 48;

type TableShapePickerProps = {
  value: TableShape;
  onChange: (shape: TableShape) => void;
  capacity?: number;
  variant?: 'list' | 'compact';
};

const SHAPE_LABEL_KEYS: Record<TableShape, string> = {
  round: 'seating.tableShapeRound',
  singleSided: 'seating.tableShapeSingleSided',
  rectangular: 'seating.tableShapeRectangular',
  square: 'seating.tableShapeSquare',
};

export function TableShapePicker({
  value,
  onChange,
  capacity = 0,
  variant = 'list',
}: TableShapePickerProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const renderOption = (shape: TableShape, compact: boolean) => {
    const active = value === shape;
    const disabled = !isTableShapeAllowed(shape, capacity);
    const label = t(SHAPE_LABEL_KEYS[shape]);

    const handlePress = () => {
      if (!disabled) onChange(shape);
    };

    if (compact) {
      return (
        <Pressable
          key={shape}
          onPress={handlePress}
          disabled={disabled}
          style={({ pressed }) => [
            active ? styles.compactOptionActive : styles.compactOption,
            {
              backgroundColor: active ? theme.primaryLight : theme.surface,
              borderColor: active ? theme.primary : theme.border,
              opacity: disabled ? 0.4 : 1,
            },
            pressed && !disabled && styles.pressed,
          ]}
          accessibilityRole="radio"
          accessibilityState={{ selected: active, disabled }}
          accessibilityLabel={label}
        >
          <TableShapeIcon shape={shape} size={COMPACT_ICON_SIZE} active={active} />
          {active ? (
            <Text
              style={[styles.compactLabel, { color: theme.primaryDark }]}
              numberOfLines={1}
            >
              {label}
            </Text>
          ) : null}
        </Pressable>
      );
    }

    return (
      <Pressable
        key={shape}
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.option,
          {
            backgroundColor: active ? theme.primaryLight : theme.surface,
            borderColor: active ? theme.primary : theme.border,
            opacity: disabled ? 0.4 : 1,
          },
          pressed && !disabled && styles.pressed,
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected: active, disabled }}
        accessibilityLabel={label}
      >
        <TableShapeIcon shape={shape} active={active} />
        <Text
          style={[
            styles.label,
            { color: active ? theme.primaryDark : theme.text },
          ]}
        >
          {label}
        </Text>
        {active ? (
          <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
        ) : (
          <View style={styles.checkPlaceholder} />
        )}
      </Pressable>
    );
  };

  if (variant === 'compact') {
    return (
      <View style={styles.container}>
        <FieldLabel label={t('seating.tableShape')} />
        <View style={styles.compactOptions}>
          {TABLE_SHAPES.map((shape) => renderOption(shape, true))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FieldLabel label={t('seating.tableShape')} />
      <View style={styles.options}>
        {TABLE_SHAPES.map((shape) => renderOption(shape, false))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  compactOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  compactOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.md,
    width: COMPACT_ICON_SIZE + spacing.xs * 2,
  },
  compactOptionActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.body,
    flex: 1,
    fontWeight: '600',
  },
  compactLabel: {
    ...typography.small,
    fontWeight: '600',
    flexShrink: 1,
  },
  checkPlaceholder: {
    width: 22,
    height: 22,
  },
});
