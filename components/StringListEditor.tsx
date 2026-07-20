import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { AddStringInputRow } from '@/components/AddStringInputRow';
import { colors, radius, spacing, typography } from '@/theme/colors';

type StringListEditorProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  placeholder: string;
};

export function StringListEditor({
  label,
  items,
  onChange,
  addLabel,
  placeholder,
}: StringListEditorProps) {
  const [customInput, setCustomInput] = useState('');

  const addItem = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setCustomInput('');
  };

  const removeItem = (item: string) => {
    onChange(items.filter((i) => i !== item));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {items.map((item) => (
          <View key={item} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
            <Pressable onPress={() => removeItem(item)} hitSlop={8} style={styles.removeButton}>
              <Ionicons name="close-circle" size={16} color={colors.primaryDark} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <AddStringInputRow
        label={addLabel}
        value={customInput}
        onChangeText={setCustomInput}
        placeholder={placeholder}
        onAdd={() => addItem(customInput)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  scroll: {
    marginBottom: spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginRight: spacing.sm,
  },
  chipText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: spacing.xs,
  },
});
