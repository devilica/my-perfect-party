import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { useBannerHeight } from '@/hooks/BannerLayoutContext';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';
import { flexFill } from '@/lib/webLayout';
import { useTranslation } from '@/lib/i18n';
import { preloadRewardedThemeAd, showRewardedThemeAd } from '@/lib/rewardedThemeAd';
import { useEventId } from '@/lib/useEventId';
import { useWeddingStore } from '@/store/weddingStore';
import { getCelebrationTheme } from '@/theme/celebrations';
import { EventThemeProvider } from '@/theme/EventThemeContext';

export default function EventLayout() {
  const id = useEventId();
  const router = useRouter();
  const language = useWeddingStore((s) => s.language);
  const events = useWeddingStore((s) => s.events);
  const deleteEvent = useWeddingStore((s) => s.deleteEvent);
  const { t } = useTranslation(language);
  const bannerHeight = useBannerHeight();
  const isOnline = useIsOnline();
  const [deleteAdLoading, setDeleteAdLoading] = useState(false);

  const event = useMemo(
    () => events.find((item) => item.id === (id ?? '')),
    [events, id]
  );

  const theme = useMemo(
    () => (event ? getCelebrationTheme(event.theme) : null),
    [event]
  );

  useEffect(() => {
    if (!event && id) {
      router.replace('/');
    }
  }, [event, id, router]);

  useEffect(() => {
    if (areAdsEnabled() && isOnline) {
      preloadRewardedThemeAd();
    }
  }, [isOnline]);

  const handleDelete = () => {
    if (deleteAdLoading) return;

    Alert.alert(t('events.delete'), t('events.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          if (!id) return;

          const performDelete = () => {
            deleteEvent(id);
            router.replace('/');
          };

          if (!areAdsEnabled() || !isOnline) {
            performDelete();
            return;
          }

          setDeleteAdLoading(true);
          try {
            const result = await showRewardedThemeAd();

            if (result === 'rewarded') {
              performDelete();
              preloadRewardedThemeAd();
            } else if (result === 'unavailable' || result === 'failed') {
              Alert.alert(t('common.error'), t('events.deleteAdUnavailable'));
            }
          } finally {
            setDeleteAdLoading(false);
          }
        },
      },
    ]);
  };

  if (!event || !theme) {
    return null;
  }

  return (
    <EventThemeProvider themeId={event.theme}>
      <View style={flexFill}>
      <Tabs
        safeAreaInsets={bannerHeight > 0 ? { bottom: 0 } : undefined}
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            marginBottom: bannerHeight,
          },
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerShadowVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginRight: 16 }}>
              <Pressable
                onPress={() => router.push(`/modals/add-event?eventId=${id}`)}
                hitSlop={8}
              >
                <Ionicons name="pencil-outline" size={22} color={theme.colors.primary} />
              </Pressable>
              <Pressable onPress={handleDelete} hitSlop={8} disabled={deleteAdLoading}>
                <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
              </Pressable>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: event.name,
            tabBarLabel: t('tabs.overview'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="guests"
          options={{
            title: t('guests.title'),
            tabBarLabel: t('tabs.guests'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="seating"
          options={{
            title: t('seating.title'),
            tabBarLabel: t('tabs.seating'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: t('expenses.title'),
            tabBarLabel: t('tabs.expenses'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="obligations"
          options={{
            title: t('obligations.title'),
            tabBarLabel: t('tabs.obligations'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      </View>
    </EventThemeProvider>
  );
}
