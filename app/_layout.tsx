import Ionicons from '@expo/vector-icons/Ionicons';
import { GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen';
import { AppShell } from '@/components/AppShell';
import { LanguageSetupScreen } from '@/components/LanguageSetupScreen';
import { androidStackScreenOptions } from '@/lib/androidStackScreenOptions';
import { initMobileAds } from '@/lib/initMobileAds';
import { maybeAskForReview } from '@/lib/maybeAskForReview';
import { useTranslation } from '@/lib/i18n';
import { syncAllNotifications } from '@/lib/notifications';
import { flexFill, webViewportHeight } from '@/lib/webLayout';
import { useWeddingStore } from '@/store/weddingStore';
import { AppThemeProvider, useThemeColors } from '@/theme/EventThemeContext';

SplashScreen.preventAutoHideAsync();

function ThemedRootStack() {
  const theme = useThemeColors();
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);

  return (
    <Stack
      screenOptions={{
        ...androidStackScreenOptions,
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.primary,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: theme.text,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background, flex: 1 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: t('app.name'), contentStyle: { backgroundColor: 'transparent' } }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: t('settings.title'), contentStyle: { backgroundColor: 'transparent' } }}
      />
      <Stack.Screen name="legal" options={{ headerShown: false }} />
      <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="modals/guest-form"
        options={{ presentation: 'modal', title: t('guests.add') }}
      />
      <Stack.Screen
        name="modals/table-form"
        options={{ presentation: 'modal', title: t('seating.addTable') }}
      />
      <Stack.Screen
        name="modals/table-preview"
        options={{ presentation: 'modal', title: t('seating.previewTitle') }}
      />
      <Stack.Screen
        name="modals/guest-seat"
        options={{ presentation: 'modal', title: t('guests.seatCard') }}
      />
      <Stack.Screen
        name="modals/seating-overview"
        options={{ presentation: 'modal', title: t('seating.hallOverviewTitle') }}
      />
      <Stack.Screen
        name="modals/bulk-tables"
        options={{ presentation: 'modal', title: t('seating.bulkCreateTitle') }}
      />
      <Stack.Screen
        name="modals/add-event"
        options={{
          presentation: 'modal',
          title: t('events.add'),
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="modals/add-expense"
        options={{ presentation: 'modal', title: t('expenses.add') }}
      />
      <Stack.Screen
        name="modals/obligation-form"
        options={{ presentation: 'modal', title: t('obligations.add') }}
      />
      <Stack.Screen
        name="modals/invitation-editor"
        options={{ presentation: 'modal', title: t('invitation.editorTitle') }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    'GreatVibes-Regular': GreatVibes_400Regular,
  });
  const hasHydrated = useWeddingStore((s) => s._hasHydrated);
  const hasSelectedLanguage = useWeddingStore((s) => s.hasSelectedLanguage);
  const appTheme = useWeddingStore((s) => s.appTheme);
  const [animationDone, setAnimationDone] = useState(false);
  const canRenderApp = fontsLoaded && hasHydrated;
  const showSplashOverlay = fontsLoaded && !animationDone;
  const handleSplashFinish = useCallback(() => setAnimationDone(true), []);

  useEffect(() => {
    if (hasSelectedLanguage) {
      initMobileAds();
    }
  }, [hasSelectedLanguage]);

  useEffect(() => {
    if (!hasHydrated || !hasSelectedLanguage) return;

    const state = useWeddingStore.getState();
    if (!state.notificationsEnabled) return;

    void syncAllNotifications({
      enabled: true,
      events: state.events,
      obligations: state.obligations,
      language: state.language,
    });
  }, [hasHydrated, hasSelectedLanguage]);

  useEffect(() => {
    if (!hasHydrated || !hasSelectedLanguage || !animationDone) return;

    const timer = setTimeout(() => {
      maybeAskForReview();
    }, 500);

    return () => clearTimeout(timer);
  }, [hasHydrated, hasSelectedLanguage, animationDone]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[flexFill, webViewportHeight]}>
        {canRenderApp ? (
          !hasSelectedLanguage ? (
            <AppThemeProvider themeId="default">
              <LanguageSetupScreen />
            </AppThemeProvider>
          ) : (
            <KeyboardProvider>
              <AppThemeProvider themeId={appTheme}>
                <AppShell>
                  <ThemedRootStack />
                </AppShell>
              </AppThemeProvider>
            </KeyboardProvider>
          )
        ) : null}

        {showSplashOverlay ? (
          <View style={styles.splashOverlay}>
            <AnimatedSplashScreen onFinish={handleSplashFinish} />
          </View>
        ) : null}

        <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
});
