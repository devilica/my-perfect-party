import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useBottomSheetPadding } from '@/hooks/useBottomSheetPadding';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

import type { SelectFieldProps } from './SelectField.types';

export type { SelectFieldProps } from './SelectField.types';

export function SelectField<T extends string>({
  label,
  labelRight,
  value,
  options,
  onChange,
  placeholder,
  error,
}: SelectFieldProps<T>) {
  const theme = useThemeColors();
  const bottomSheetPadding = useBottomSheetPadding();
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label,
    [options, value]
  );

  const handleSelect = (next: T) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        {labelRight}
      </View>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
          },
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
      >
        <Text
          style={[
            styles.triggerText,
            { color: selectedLabel ? theme.text : theme.textMuted },
          ]}
          numberOfLines={1}
        >
          {selectedLabel ?? placeholder ?? label}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.textMuted} />
      </Pressable>
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]} onPress={() => {}}>
            <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.sheetTitle, { color: theme.text }]}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={22} color={theme.textMuted} />
              </Pressable>
            </View>
            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={{ paddingBottom: bottomSheetPadding }}
              keyboardShouldPersistTaps="handled"
            >
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <OptionRow
                    key={option.value}
                    label={option.label}
                    active={active}
                    onPress={() => handleSelect(option.value)}
                  />
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function OptionRow({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: active ? theme.primaryLight : theme.surface,
          borderBottomColor: theme.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.optionText,
          {
            color: active ? theme.primaryDark : theme.text,
            fontWeight: active ? '600' : '400',
          },
        ]}
      >
        {label}
      </Text>
      {active ? <Ionicons name="checkmark" size={20} color={theme.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 48,
    gap: spacing.sm,
  },
  triggerText: {
    ...typography.body,
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  error: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetTitle: {
    ...typography.subheading,
    flex: 1,
    paddingRight: spacing.sm,
  },
  optionsList: {
    maxHeight: 360,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    ...typography.body,
    flex: 1,
    paddingRight: spacing.sm,
  },
});
