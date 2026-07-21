import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, TextInputField } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { BulkTableBatch } from '@/types/models';
import { radius, spacing, typography } from '@/theme/colors';

type BatchRow = {
  id: string;
  count: string;
  capacity: string;
};

type TableCreationModalProps = {
  onCreate: (batches: BulkTableBatch[]) => void;
  onCancel: () => void;
};

let batchIdCounter = 0;
function createBatchRow(count = '1', capacity = '10'): BatchRow {
  batchIdCounter += 1;
  return { id: `batch-${batchIdCounter}`, count, capacity };
}

export function TableCreationModal({ onCreate, onCancel }: TableCreationModalProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const [rows, setRows] = useState<BatchRow[]>([createBatchRow()]);
  const [error, setError] = useState('');

  const totalTables = useMemo(
    () =>
      rows.reduce((sum, row) => {
        const count = parseInt(row.count, 10);
        return sum + (Number.isNaN(count) || count <= 0 ? 0 : count);
      }, 0),
    [rows]
  );

  const addRow = () => setRows((prev) => [...prev, createBatchRow()]);
  const removeRow = (id: string) =>
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));

  const applyPreset = (count: number, capacity: number) => {
    setRows([createBatchRow(String(count), String(capacity))]);
  };

  const handleCreate = () => {
    const batches: BulkTableBatch[] = [];
    for (const row of rows) {
      const count = parseInt(row.count, 10);
      const capacity = parseInt(row.capacity, 10);
      if (Number.isNaN(count) || count <= 0 || Number.isNaN(capacity) || capacity <= 0) {
        setError(t('seating.capacityError'));
        return;
      }
      batches.push({ count, capacity });
    }
    onCreate(batches);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{t('seating.bulkCreateTitle')}</Text>
      <Text style={[styles.preview, { color: theme.textSecondary }]}>
        {t('seating.bulkPreview', { count: totalTables })}
      </Text>

      <View style={styles.presets}>
        <Pressable
          style={[styles.presetBtn, { backgroundColor: theme.primaryLight }]}
          onPress={() => applyPreset(3, 10)}
        >
          <Text style={[styles.presetText, { color: theme.primaryDark }]}>
            {t('seating.preset310')}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.presetBtn, { backgroundColor: theme.primaryLight }]}
          onPress={() => applyPreset(5, 7)}
        >
          <Text style={[styles.presetText, { color: theme.primaryDark }]}>
            {t('seating.preset57')}
          </Text>
        </Pressable>
      </View>

      {rows.map((row) => (
        <View key={row.id} style={styles.row}>
          <View style={styles.rowField}>
            <TextInputField
              label={t('seating.count')}
              value={row.count}
              onChangeText={(text) => {
                setError('');
                setRows((prev) =>
                  prev.map((r) => (r.id === row.id ? { ...r, count: text } : r))
                );
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.rowField}>
            <TextInputField
              label={t('seating.capacity')}
              value={row.capacity}
              onChangeText={(text) => {
                setError('');
                setRows((prev) =>
                  prev.map((r) => (r.id === row.id ? { ...r, capacity: text } : r))
                );
              }}
              keyboardType="numeric"
            />
          </View>
          {rows.length > 1 ? (
            <Pressable onPress={() => removeRow(row.id)} style={styles.removeBtn}>
              <Text style={[styles.removeText, { color: theme.danger }]}>×</Text>
            </Pressable>
          ) : null}
        </View>
      ))}

      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

      <Button label={t('seating.addBatch')} variant="secondary" onPress={addRow} />
      <View style={styles.actions}>
        <Button label={t('common.save')} onPress={handleCreate} />
        <Button label={t('common.cancel')} variant="ghost" onPress={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    ...typography.subheading,
  },
  preview: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  presetBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  presetText: {
    ...typography.small,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  rowField: {
    flex: 1,
  },
  removeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  removeText: {
    fontSize: 24,
  },
  error: {
    ...typography.small,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
