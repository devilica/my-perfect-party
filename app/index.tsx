import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EventCard } from '@/components/EventCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState, Fab } from '@/components/ui';
import { useFabScrollPadding } from '@/hooks/useFabBottomOffset';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const events = useWeddingStore((s) => s.events);
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const fabScrollPadding = useFabScrollPadding();
  const theme = useThemeColors();

  return (
    <ScreenContainer
      style={{
        flex: 1,
        paddingTop: spacing.sm,
        ...(events.length === 0 ? { paddingBottom: fabScrollPadding } : null),
      }}
    >
      <Stack.Screen
        options={{
          title: t('app.name'),
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
              <Ionicons name="settings-outline" size={24} color={theme.primary} />
            </Pressable>
          ),
        }}
      />

      <Text style={[styles.tagline, { color: theme.textSecondary }]}>{t('app.tagline')}</Text>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('events.myEvents')}</Text>

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
          contentContainerStyle={{ paddingBottom: fabScrollPadding }}
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
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheading,
    marginBottom: spacing.md,
  },
});
