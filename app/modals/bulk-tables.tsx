import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';

import { TableCreationModal } from '@/components/TableCreationModal';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { useIsOnline } from '@/hooks/useIsOnline';
import { useModalScrollPadding } from '@/hooks/useModalScrollPadding';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import {
  canShowTableMilestoneAd,
  preloadRewardedTableAd,
  showRewardedTableAd,
} from '@/lib/rewardedTableAd';
import { didCrossTableAdMilestone, getTablesForEvent } from '@/lib/seatingStats';
import { useWeddingStore } from '@/store/weddingStore';
import { BulkTableBatch } from '@/types/models';
import { spacing } from '@/theme/colors';

export default function BulkTablesModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string }>();
  const eventId = getRouteParam(params.eventId);
  const language = useWeddingStore((s) => s.language);
  const tables = useWeddingStore((s) => s.tables);
  const bulkCreateTables = useWeddingStore((s) => s.bulkCreateTables);
  const { t } = useTranslation(language);
  const modalScrollPadding = useModalScrollPadding();
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const isOnline = useIsOnline();

  useEffect(() => {
    if (canShowTableMilestoneAd(isOnline)) {
      preloadRewardedTableAd();
    }
  }, [isOnline]);

  if (!eventId) return null;

  const handleCreate = async (batches: BulkTableBatch[]) => {
    const oldCount = getTablesForEvent(tables, eventId).length;
    const addedCount = batches.reduce((sum, batch) => sum + batch.count, 0);
    const newTotal = oldCount + addedCount;

    bulkCreateTables(eventId, batches);

    if (didCrossTableAdMilestone(oldCount, newTotal) && canShowTableMilestoneAd(isOnline)) {
      await showRewardedTableAd();
      preloadRewardedTableAd();
    }

    router.back();
  };

  return (
    <ThemedEventModal eventId={eventId} showBottomBanner>
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <Stack.Screen
          options={getThemedModalScreenOptions(celebrationTheme, t('seating.bulkCreateTitle'))}
        />
        <TableCreationModal
          onCreate={handleCreate}
          onCancel={() => router.back()}
        />
        <OverviewNativeAd placement="modal" />
      </FormScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
