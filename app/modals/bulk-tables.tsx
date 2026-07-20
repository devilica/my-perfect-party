import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { TableCreationModal } from '@/components/TableCreationModal';
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

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: t('seating.bulkCreateTitle') }} />
      <TableCreationModal
        onCreate={(batches) => {
          if (eventId) {
            bulkCreateTables(eventId, batches);
          }
          router.back();
        }}
        onCancel={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
});
