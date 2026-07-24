import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SeatingHallOverview } from '@/components/SeatingHallOverview';
import {
  getThemedModalScreenOptions,
  ThemedEventModal,
  useEventCelebrationTheme,
} from '@/components/ThemedEventModal';
import { flexFill } from '@/lib/webLayout';
import { getEffectiveBottomInset } from '@/lib/safeAreaInsets';
import { useTranslation } from '@/lib/i18n';
import { getRouteParam } from '@/lib/routeParams';
import { useWeddingStore } from '@/store/weddingStore';

export default function SeatingOverviewModal() {
  const params = useLocalSearchParams<{ eventId: string }>();
  const eventId = getRouteParam(params.eventId);
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const celebrationTheme = useEventCelebrationTheme(eventId ?? '');
  const bottomInset = getEffectiveBottomInset(useSafeAreaInsets());

  if (!eventId) return null;

  return (
    <ThemedEventModal eventId={eventId}>
      <Stack.Screen
        options={getThemedModalScreenOptions(celebrationTheme, t('seating.hallOverviewTitle'))}
      />
      <View style={[styles.container, { paddingBottom: bottomInset }]}>
        <SeatingHallOverview eventId={eventId} />
      </View>
    </ThemedEventModal>
  );
}

const styles = StyleSheet.create({
  container: {
    ...flexFill,
  },
});
