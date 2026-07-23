import { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';

type FieldLabelProps = {
  label: string;
  required?: boolean;
  labelRight?: ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export function FieldLabel({ label, required, labelRight, style, labelStyle }: FieldLabelProps) {
  const theme = useThemeColors();

  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.label, { color: theme.textSecondary }, labelStyle]}>
        {label}
        {required ? <Text style={{ color: theme.danger }}> *</Text> : null}
      </Text>
      {labelRight}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
});
