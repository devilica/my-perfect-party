import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';

import { Button, TextInputField } from '@/components/ui';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { useWeddingStore } from '@/store/weddingStore';
import { spacing } from '@/theme/colors';

export default function TableFormModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string; tableId?: string }>();
  const eventId = getRouteParam(params.eventId);
  const tableId = getRouteParam(params.tableId);
  const language = useWeddingStore((s) => s.language);
  const tables = useWeddingStore((s) => s.tables);
  const addTable = useWeddingStore((s) => s.addTable);
  const updateTable = useWeddingStore((s) => s.updateTable);
  const { t } = useTranslation(language);
  const modalScrollPadding = useModalScrollPadding();
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');

  const existingTable = useMemo(
    () => (tableId ? tables.find((table) => table.id === tableId) : undefined),
    [tables, tableId]
  );

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('10');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (existingTable) {
      setName(existingTable.name);
      setCapacity(String(existingTable.capacity));
    }
  }, [existingTable]);

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(t('seating.nameRequired'));
      return;
    }
    const parsedCapacity = parseInt(capacity, 10);
    if (!eventId || Number.isNaN(parsedCapacity) || parsedCapacity <= 0) return;

    if (existingTable) {
      updateTable(existingTable.id, {
        name: name.trim(),
        capacity: parsedCapacity,
      });
    } else {
      addTable({
        eventId,
        name: name.trim(),
        capacity: parsedCapacity,
      });
    }

    router.back();
  };

  return (
    <ThemedEventModal eventId={eventId ?? ''}>
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <Stack.Screen
          options={getThemedModalScreenOptions(
            celebrationTheme,
            existingTable ? t('seating.editTable') : t('seating.addTable')
          )}
        />

      <TextInputField
        label={t('seating.tableName')}
        required
        value={name}
        onChangeText={(text) => {
          setName(text);
          setNameError('');
        }}
        placeholder={t('seating.tableNamePlaceholder')}
        error={nameError}
      />
      <TextInputField
        label={t('seating.capacity')}
        required
        value={capacity}
        onChangeText={setCapacity}
        placeholder={t('seating.capacityPlaceholder')}
        keyboardType="numeric"
      />

      <View style={styles.actions}>
        <Button label={t('common.save')} onPress={handleSave} />
        <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
      </View>
      </FormScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
