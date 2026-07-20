import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatDisplayDate, formatIsoDate, parseIsoDate } from '@/lib/dateUtils';
import { colors, radius, spacing, typography } from '@/theme/colors';

import type { DatePickerFieldProps } from './DatePickerField.types';

export type { DatePickerFieldProps } from './DatePickerField.types';

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder,
  clearLabel,
  locale = 'bs',
}: DatePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const parsed = parseIsoDate(value);
  const display = parsed ? formatDisplayDate(value, locale) : '';
  const pickerDate = parsed ?? new Date();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed' || !selected) return;
    onChange(formatIsoDate(selected));
  };

  const openPicker = () => {
    if (Platform.OS === 'android') {
      setShowPicker(true);
      return;
    }
    setShowPicker((current) => !current);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          onPress={openPicker}
          style={({ pressed }) => [styles.input, pressed && styles.pressed]}
        >
          <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
          <Text style={[styles.value, !display && styles.placeholderText]}>
            {display || placeholder}
          </Text>
        </Pressable>
        {value ? (
          <Pressable
            onPress={() => onChange(undefined)}
            style={styles.clearBtn}
            accessibilityLabel={clearLabel}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={22} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {showPicker ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 48,
  },
  pressed: {
    opacity: 0.85,
  },
  value: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  clearBtn: {
    padding: spacing.xs,
  },
});
