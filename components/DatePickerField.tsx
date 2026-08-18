import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  formatDisplayDate,
  formatIsoDate,
  formatIsoDateTime,
  parseIsoDate,
  parseIsoDateTime,
} from '@/lib/dateUtils';
import { getDefaultLanguage } from '@/lib/i18n';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

import { FieldLabel } from '@/components/FieldLabel';

import type { DatePickerFieldProps } from './DatePickerField.types';

export type { DatePickerFieldProps } from './DatePickerField.types';

function openAndroidDateTimePicker(value: Date, onSelect: (iso: string) => void) {
  DateTimePickerAndroid.open({
    value,
    mode: 'date',
    onChange: (event, selectedDate) => {
      if (event.type === 'dismissed' || !selectedDate) return;

      DateTimePickerAndroid.open({
        value: selectedDate,
        mode: 'time',
        is24Hour: true,
        onChange: (timeEvent, selectedTime) => {
          if (timeEvent.type === 'dismissed' || !selectedTime) return;
          onSelect(formatIsoDateTime(selectedTime));
        },
      });
    },
  });
}

export function DatePickerField({
  label,
  required,
  value,
  onChange,
  placeholder,
  clearLabel,
  locale = getDefaultLanguage(),
  error,
  mode = 'date',
  clearable = true,
}: DatePickerFieldProps) {
  const theme = useThemeColors();
  const [showPicker, setShowPicker] = useState(false);
  const isDateTime = mode === 'datetime';
  const parsed = isDateTime ? parseIsoDateTime(value) : parseIsoDate(value);
  const display = parsed ? formatDisplayDate(value, locale) : '';
  const pickerDate = parsed ?? new Date();
  const useAndroidDateTimeFlow = Platform.OS === 'android' && isDateTime;

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed' || !selected) return;
    onChange(isDateTime ? formatIsoDateTime(selected) : formatIsoDate(selected));
  };

  const openPicker = () => {
    if (useAndroidDateTimeFlow) {
      openAndroidDateTimePicker(pickerDate, (iso) => onChange(iso));
      return;
    }

    if (Platform.OS === 'android') {
      setShowPicker(true);
      return;
    }

    setShowPicker((current) => !current);
  };

  const pickerMode = isDateTime && Platform.OS === 'ios' ? 'datetime' : 'date';

  return (
    <View style={styles.container}>
      <FieldLabel label={label} required={required} />
      <View style={styles.row}>
        <Pressable
          onPress={openPicker}
          style={({ pressed }) => [
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: error ? theme.danger : theme.border,
            },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="calendar-outline" size={20} color={theme.textMuted} />
          <Text
            style={[
              styles.value,
              { color: display ? theme.text : theme.textMuted },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {display || placeholder}
          </Text>
        </Pressable>
        {clearable && value ? (
          <Pressable
            onPress={() => onChange(undefined)}
            style={styles.clearBtn}
            accessibilityLabel={clearLabel}
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={22} color={theme.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {showPicker && !useAndroidDateTimeFlow ? (
        <DateTimePicker
          value={pickerDate}
          mode={pickerMode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
      ) : null}
      {error ? (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
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
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 42,
  },
  pressed: {
    opacity: 0.85,
  },
  value: {
    ...typography.body,
    flex: 1,
    minWidth: 0,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  error: {
    ...typography.small,
    marginTop: spacing.xs,
  },
});
