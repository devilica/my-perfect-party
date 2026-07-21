import { createElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/colors';

import type { DatePickerFieldProps } from './DatePickerField.types';

export type { DatePickerFieldProps } from './DatePickerField.types';

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder,
  clearLabel,
  error,
  mode = 'date',
  clearable = true,
}: DatePickerFieldProps) {
  const isDateTime = mode === 'datetime';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {createElement('input', {
          type: isDateTime ? 'datetime-local' : 'date',
          value: value ?? '',
          onChange: (event: { target: { value: string } }) => {
            onChange(event.target.value || undefined);
          },
          style: {
            ...webInputStyle,
            borderColor: error ? colors.danger : colors.border,
          },
          'aria-label': label,
        })}
        {clearable && value ? (
          <Pressable
            onPress={() => onChange(undefined)}
            style={styles.clearBtn}
            accessibilityLabel={clearLabel}
          >
            <Text style={styles.clearText}>×</Text>
          </Pressable>
        ) : null}
      </View>
      {!value && placeholder ? <Text style={styles.hint}>{placeholder}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const webInputStyle = {
  flex: 1,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: colors.border,
  borderRadius: radius.md,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  paddingTop: spacing.sm + 2,
  paddingBottom: spacing.sm + 2,
  minHeight: 48,
  fontSize: typography.body.fontSize,
  color: colors.text,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxSizing: 'border-box' as const,
  width: '100%',
};

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
  clearBtn: {
    padding: spacing.xs,
  },
  clearText: {
    fontSize: 24,
    color: colors.textMuted,
    lineHeight: 24,
  },
  hint: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.small,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
