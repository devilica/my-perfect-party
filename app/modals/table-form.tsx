import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';
import { TableShapePicker } from '@/components/TableShapePicker';

import { Button, TextInputField } from '@/components/ui';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useIsOnline } from '@/hooks/useIsOnline';
import { DEFAULT_TABLE_SHAPE, isSquareTableCapacityValid } from '@/constants/tableShapes';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import {
  canShowTableMilestoneAd,
  preloadRewardedTableAd,
  showRewardedTableAd,
} from '@/lib/rewardedTableAd';
import { didCrossTableAdMilestone, getTablesForEvent } from '@/lib/seatingStats';
import { useWeddingStore } from '@/store/weddingStore';
import { TableShape } from '@/types/models';
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
  const isOnline = useIsOnline();

  useEffect(() => {
    if (canShowTableMilestoneAd(isOnline)) {
      preloadRewardedTableAd();
    }
  }, [isOnline]);

  const existingTable = useMemo(
    () => (tableId ? tables.find((table) => table.id === tableId) : undefined),
    [tables, tableId]
  );

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('10');
  const [shape, setShape] = useState<TableShape>(DEFAULT_TABLE_SHAPE);
  const [nameError, setNameError] = useState('');
  const [capacityError, setCapacityError] = useState('');

  const parsedCapacity = useMemo(() => {
    const value = parseInt(capacity, 10);
    return Number.isNaN(value) ? 0 : value;
  }, [capacity]);

  useEffect(() => {
    if (existingTable) {
      setName(existingTable.name);
      setCapacity(String(existingTable.capacity));
      setShape(existingTable.shape ?? DEFAULT_TABLE_SHAPE);
    }
  }, [existingTable]);

  useEffect(() => {
    if (shape === 'square' && !isSquareTableCapacityValid(parsedCapacity)) {
      setShape(DEFAULT_TABLE_SHAPE);
    }
  }, [parsedCapacity, shape]);

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError(t('seating.nameRequired'));
      return;
    }
    const parsedCapacity = parseInt(capacity, 10);
    if (!eventId || Number.isNaN(parsedCapacity) || parsedCapacity <= 0) return;

    if (shape === 'square' && !isSquareTableCapacityValid(parsedCapacity)) {
      setCapacityError(t('seating.squareCapacityError'));
      return;
    }

    if (existingTable) {
      updateTable(existingTable.id, {
        name: name.trim(),
        capacity: parsedCapacity,
        shape,
      });
    } else {
      const oldCount = getTablesForEvent(tables, eventId).length;
      addTable({
        eventId,
        name: name.trim(),
        capacity: parsedCapacity,
        shape,
      });

      if (
        didCrossTableAdMilestone(oldCount, oldCount + 1) &&
        canShowTableMilestoneAd(isOnline)
      ) {
        await showRewardedTableAd();
        preloadRewardedTableAd();
      }
    }

    router.back();
  };

  return (
    <ThemedEventModal eventId={eventId ?? ''} showBottomBanner>
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

      <View style={styles.fieldsBlock}>
        <TextInputField
          label={t('seating.capacity')}
          required
          value={capacity}
          onChangeText={(text) => {
            setCapacity(text);
            setCapacityError('');
          }}
          placeholder={t('seating.capacityPlaceholder')}
          keyboardType="numeric"
          error={capacityError}
        />
        <TableShapePicker
          variant="compact"
          value={shape}
          onChange={setShape}
          capacity={parsedCapacity}
        />
      </View>

      <View style={styles.actions}>
        <Button label={t('common.save')} onPress={handleSave} />
        <Button label={t('common.cancel')} variant="ghost" onPress={() => router.back()} />
      </View>
      <OverviewNativeAd placement="modal" />
      </FormScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  fieldsBlock: {
    gap: spacing.xs,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
