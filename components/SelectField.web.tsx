import { createElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        {labelRight}
      </View>
      {createElement(
        'select',
        {
          value,
          onChange: (event: { target: { value: string } }) => {
            onChange(event.target.value as T);
          },
          style: {
            ...webSelectStyle,
            backgroundColor: theme.surface,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text,
          },
          'aria-label': label,
        },
        options.map((option) =>
          createElement('option', { key: option.value, value: option.value }, option.label)
        )
      )}
      {!value && placeholder ? (
        <Text style={[styles.hint, { color: theme.textMuted }]}>{placeholder}</Text>
      ) : null}
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
}

const webSelectStyle = {
  width: '100%',
  borderWidth: 1,
  borderStyle: 'solid' as const,
  borderRadius: radius.md,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  paddingTop: spacing.sm + 2,
  paddingBottom: spacing.sm + 2,
  minHeight: 48,
  fontSize: typography.body.fontSize,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxSizing: 'border-box' as const,
  appearance: 'auto' as const,
};

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
  hint: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.small,
    marginTop: spacing.xs,
  },
});
