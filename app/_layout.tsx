import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen';
import { AppShell } from '@/components/AppShell';
import { initMobileAds } from '@/lib/initMobileAds';
import { useWeddingStore } from '@/store/weddingStore';
import { AppThemeProvider, useThemeColors } from '@/theme/EventThemeContext';

SplashScreen.preventAutoHideAsync();

function ThemedRootStack() {
  const theme = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.primary,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: theme.text,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Moja savršena proslava', contentStyle: { backgroundColor: 'transparent' } }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: 'Postavke', contentStyle: { backgroundColor: 'transparent' } }}
      />
      <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="modals/guest-form"
        options={{ presentation: 'modal', title: 'Guest' }}
      />
      <Stack.Screen
        name="modals/table-form"
        options={{ presentation: 'modal', title: 'Table' }}
      />
      <Stack.Screen
        name="modals/bulk-tables"
        options={{ presentation: 'modal', title: 'Tables' }}
      />
      <Stack.Screen
        name="modals/add-event"
        options={{ presentation: 'modal', title: 'Event' }}
      />
      <Stack.Screen
        name="modals/add-expense"
        options={{ presentation: 'modal', title: 'Expense' }}
      />
      <Stack.Screen
        name="modals/obligation-form"
        options={{ presentation: 'modal', title: 'Task' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const hasHydrated = useWeddingStore((s) => s._hasHydrated);
  const appTheme = useWeddingStore((s) => s.appTheme);
  const [animationDone, setAnimationDone] = useState(false);
  const ready = fontsLoaded && hasHydrated && animationDone;
  const handleSplashFinish = useCallback(() => setAnimationDone(true), []);
  const segments = useSegments();
  const showBanner = !segments.some((segment) => segment === 'modals');

  useEffect(() => {
    initMobileAds();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (!ready) {
    return (
      <SafeAreaProvider>
        <AnimatedSplashScreen onFinish={handleSplashFinish} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <StatusBar style="dark" />
        <AppThemeProvider themeId={appTheme}>
          <AppShell showBanner={showBanner}>
            <ThemedRootStack />
          </AppShell>
        </AppThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
