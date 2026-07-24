import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';

import { TableCreationModal } from '@/components/TableCreationModal';
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

export default function BulkTablesModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ eventId: string }>();
  const eventId = getRouteParam(params.eventId);
  const language = useWeddingStore((s) => s.language);
  const bulkCreateTables = useWeddingStore((s) => s.bulkCreateTables);
  const { t } = useTranslation(language);
  const modalScrollPadding = useModalScrollPadding();
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');

  if (!eventId) return null;

  return (
    <ThemedEventModal eventId={eventId} showBottomBanner>
      <FormScrollView
        contentContainerStyle={[styles.container, { paddingBottom: modalScrollPadding }]}
      >
        <Stack.Screen
          options={getThemedModalScreenOptions(celebrationTheme, t('seating.bulkCreateTitle'))}
        />
        <TableCreationModal
          onCreate={(batches) => {
            bulkCreateTables(eventId, batches);
            router.back();
          }}
          onCancel={() => router.back()}
        />
      </FormScrollView>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
