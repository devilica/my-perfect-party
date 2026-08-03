import { createElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

import { FieldLabel } from '@/components/FieldLabel';

import type { DatePickerFieldProps } from './DatePickerField.types';

export type { DatePickerFieldProps } from './DatePickerField.types';

export function DatePickerField({
  label,
  required,
  value,
  onChange,
  placeholder,
  clearLabel,
  error,
  mode = 'date',
  clearable = true,
}: DatePickerFieldProps) {
  const theme = useThemeColors();
  const isDateTime = mode === 'datetime';

  return (
    <View style={styles.container}>
      <FieldLabel label={label} required={required} />
      <View style={styles.row}>
        {createElement('input', {
          type: isDateTime ? 'datetime-local' : 'date',
          value: value ?? '',
          onChange: (event: { target: { value: string } }) => {
            onChange(event.target.value || undefined);
          },
          style: {
            flex: 1,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: error ? theme.danger : theme.border,
            borderRadius: radius.md,
            paddingLeft: spacing.md,
            paddingRight: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.sm,
            minHeight: 42,
            fontSize: typography.body.fontSize,
            color: theme.text,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxSizing: 'border-box' as const,
            width: '100%',
          },
          'aria-label': label,
        })}
        {clearable && value ? (
          <Pressable
            onPress={() => onChange(undefined)}
            style={styles.clearBtn}
            accessibilityLabel={clearLabel}
          >
            <Text style={[styles.clearText, { color: theme.textMuted }]}>×</Text>
          </Pressable>
        ) : null}
      </View>
      {!value && placeholder ? (
        <Text style={[styles.hint, { color: theme.textMuted }]}>{placeholder}</Text>
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
  clearBtn: {
    padding: spacing.xs,
  },
  clearText: {
    fontSize: 24,
    lineHeight: 24,
  },
  hint: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.small,
    marginTop: spacing.xs,
  },
});
