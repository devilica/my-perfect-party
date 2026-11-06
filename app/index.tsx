import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { EventCard } from '@/components/EventCard';
import { EventsEmptyCard } from '@/components/EventsEmptyCard';
import { EventsWelcomeAvatar } from '@/components/EventsWelcomeAvatar';
import { HomeEmptyHero } from '@/components/HomeEmptyHero';
import { HomeFeatureDecor } from '@/components/HomeFeatureDecor';
import { HomeFooterWave, useHomeFooterWaveHeight } from '@/components/HomeFooterWave';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Fab } from '@/components/ui';
import { useFabScrollPadding } from '@/hooks/useFabBottomOffset';
import { flexFill } from '@/lib/webLayout';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing } from '@/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const events = useWeddingStore((s) => s.events);
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const fabScrollPadding = useFabScrollPadding(1, 'stack');
  const footerWaveHeight = useHomeFooterWaveHeight();
  const theme = useThemeColors();

  const openAddEvent = () => router.push('/modals/add-event');

  const featureLabels: [string, string, string, string] = [
    t('tabs.guests'),
    t('tabs.seating'),
    t('tabs.expenses'),
    t('tabs.obligations'),
  ];

  const heroProps = {
    headline: t('events.emptyHeroHeadline'),
    actionLabel: t('events.add'),
    onAddEvent: openAddEvent,
  };

  return (
    <View style={styles.root}>
      <ScreenContainer style={{ flex: 1, paddingTop: spacing.sm }}>
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

      <View style={flexFill}>
        {events.length === 0 ? (
          <View style={styles.emptyRoot}>
            <ScrollView
              style={flexFill}
              contentContainerStyle={[
                styles.emptyScroll,
                { paddingBottom: fabScrollPadding + spacing.xl },
              ]}
              showsVerticalScrollIndicator={false}
            >
              <HomeEmptyHero {...heroProps} />
              <EventsEmptyCard
                title={t('events.emptyTitle')}
                subtitle={t('events.emptySubtitle')}
                onPress={openAddEvent}
              />
              <HomeFeatureDecor labels={featureLabels} />
            </ScrollView>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            style={flexFill}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <HomeEmptyHero {...heroProps} showAction={false} />
              </View>
            }
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => router.push(`/event/${item.id}`)}
                onEdit={() => router.push(`/modals/add-event?eventId=${item.id}`)}
              />
            )}
            contentContainerStyle={{
              paddingBottom: fabScrollPadding + footerWaveHeight,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Fab onPress={openAddEvent} variant="stack" />
      </ScreenContainer>
      <HomeFooterWave />
      <EventsWelcomeAvatar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  emptyRoot: {
    flex: 1,
  },
  emptyScroll: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  listHeader: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    width: '100%',
  },
});
