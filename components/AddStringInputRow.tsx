import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type AddStringInputRowProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onAdd: () => void;
  disabled?: boolean;
};

export function AddStringInputRow({
  label,
  value,
  onChangeText,
  placeholder,
  onAdd,
  disabled = false,
}: AddStringInputRowProps) {
  const theme = useThemeColors();
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const canAdd = !disabled && value.trim().length > 0;
  const addLabel = `+ ${t('common.add')}`;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
        />
        <Pressable
          onPress={onAdd}
          disabled={!canAdd}
          style={[
            styles.addButton,
            { backgroundColor: theme.primary },
            !canAdd && styles.addButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel={addLabel}
        >
          <Text style={[styles.addButtonText, { color: theme.surface }]}>{addLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
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
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.body,
  },
  addButton: {
    flexShrink: 0,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...typography.caption,
    fontWeight: '700',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
});
