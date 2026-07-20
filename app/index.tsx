import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventCard } from '@/components/EventCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState, Fab } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { colors, spacing, typography } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const events = useWeddingStore((s) => s.events);
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  return (
    <ScreenContainer style={{ flex: 1, paddingTop: spacing.sm }}>
      <Stack.Screen
        options={{
          title: t('app.name'),
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
            </Pressable>
          ),
        }}
      />

      <Text style={styles.tagline}>{t('app.tagline')}</Text>
      <Text style={styles.sectionTitle}>{t('events.myEvents')}</Text>

      {events.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title={t('events.emptyTitle')}
          subtitle={t('events.emptySubtitle')}
        />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => router.push(`/event/${item.id}`)}
              onEdit={() => router.push(`/modals/add-event?eventId=${item.id}`)}
            />
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + 88 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Fab onPress={() => router.push('/modals/add-event')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tagline: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: spacing.md,
  },
});
