import { createElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

import { FieldLabel } from '@/components/FieldLabel';

import type { SelectFieldProps } from './SelectField.types';

export type { SelectFieldProps } from './SelectField.types';

export function SelectField<T extends string>({
  label,
  required,
  labelRight,
  value,
  options,
  onChange,
  placeholder,
  error,
  compact = false,
  dense = false,
}: SelectFieldProps<T>) {
  const theme = useThemeColors();

  return (
    <View style={[styles.container, dense && styles.containerDense]}>
      <FieldLabel label={label} required={required} labelRight={labelRight} />
      {createElement(
        'select',
        {
          value,
          onChange: (event: { target: { value: string } }) => {
            onChange(event.target.value as T);
          },
          style: {
            ...webSelectStyle,
            ...(compact ? webSelectCompactTextStyle : {}),
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
  paddingTop: spacing.sm,
  paddingBottom: spacing.sm,
  minHeight: 42,
  fontSize: typography.body.fontSize,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxSizing: 'border-box' as const,
  appearance: 'auto' as const,
};

const webSelectCompactTextStyle = {
  fontSize: 13,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  containerDense: {
    marginBottom: spacing.xs,
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
