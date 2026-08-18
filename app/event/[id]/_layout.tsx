import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';
import { exportEventPdf } from '@/lib/exportEventPdf';
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
  const guests = useWeddingStore((s) => s.guests);
  const tables = useWeddingStore((s) => s.tables);
  const expenses = useWeddingStore((s) => s.expenses);
  const obligations = useWeddingStore((s) => s.obligations);
  const deleteEvent = useWeddingStore((s) => s.deleteEvent);
  const { t } = useTranslation(language);
  const isOnline = useIsOnline();
  const [deleteAdLoading, setDeleteAdLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

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

  const handleExportPdf = async () => {
    if (!id || exportLoading) return;

    const performExport = async () => {
      const result = await exportEventPdf({
        eventId: id,
        language,
        t,
        events,
        guests,
        tables,
        expenses,
        obligations,
      });

      if (result === 'unavailable') {
        Alert.alert(t('common.error'), t('events.exportSharingUnavailable'));
      } else if (result === 'failed') {
        Alert.alert(t('common.error'), t('events.exportFailed'));
      }
    };

    setExportLoading(true);
    try {
      if (!areAdsEnabled() || !isOnline) {
        await performExport();
        return;
      }

      const adResult = await showRewardedThemeAd();

      if (adResult === 'rewarded') {
        await performExport();
        preloadRewardedThemeAd();
      } else if (adResult === 'unavailable' || adResult === 'failed') {
        Alert.alert(t('common.error'), t('events.deleteAdUnavailable'));
      }
    } finally {
      setExportLoading(false);
    }
  };

  if (!event || !theme) {
    return null;
  }

  const renderHeaderRight = (options?: {
    showEdit?: boolean;
    showDelete?: boolean;
    showExport?: boolean;
    showSeatingPreview?: boolean;
  }) => () => {
    if (
      !options?.showEdit &&
      !options?.showDelete &&
      !options?.showExport &&
      !options?.showSeatingPreview
    ) {
      return null;
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginRight: 16 }}>
        {options?.showSeatingPreview ? (
          <Pressable
            onPress={() => router.push(`/modals/seating-overview?eventId=${id}`)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('seating.viewHall')}
            style={[
              styles.viewHallButton,
              { backgroundColor: theme.colors.primaryLight },
            ]}
          >
            <Ionicons name="eye" size={18} color={theme.colors.primary} />
            <Text
              style={[styles.viewHallLabel, { color: theme.colors.primary }]}
              numberOfLines={1}
            >
              {t('seating.viewHall')}
            </Text>
          </Pressable>
        ) : null}
        {options?.showEdit ? (
          <Pressable
            onPress={() => router.push(`/modals/add-event?eventId=${id}`)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('events.edit')}
          >
            <Ionicons name="pencil-outline" size={22} color={theme.colors.primary} />
          </Pressable>
        ) : null}
        {options?.showExport ? (
          <Pressable
            onPress={handleExportPdf}
            hitSlop={8}
            disabled={exportLoading}
            accessibilityRole="button"
            accessibilityLabel={t('events.exportPdf')}
          >
            {exportLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Ionicons name="download-outline" size={22} color={theme.colors.primary} />
            )}
          </Pressable>
        ) : null}
        {options?.showDelete ? (
          <Pressable onPress={handleDelete} hitSlop={8} disabled={deleteAdLoading}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
          </Pressable>
        ) : null}
      </View>
    );
  };

  return (
    <EventThemeProvider themeId={event.theme}>
      <View style={flexFill}>
      <Tabs
        detachInactiveScreens={false}
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.primary,
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: event.name,
            tabBarLabel: t('tabs.overview'),
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/');
                  }
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t('common.back')}
                style={{ marginLeft: 16 }}
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
              </Pressable>
            ),
            headerRight: renderHeaderRight({
              showEdit: true,
              showExport: true,
              showDelete: true,
            }),
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
            headerRight: renderHeaderRight({ showSeatingPreview: true }),
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

const styles = StyleSheet.create({
  viewHallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    maxWidth: 160,
  },
  viewHallLabel: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});
