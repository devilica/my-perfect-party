import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen';
import { AppShell } from '@/components/AppShell';
import { initMobileAds } from '@/lib/initMobileAds';
import { useWeddingStore } from '@/store/weddingStore';
import { colors } from '@/theme/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const hasHydrated = useWeddingStore((s) => s._hasHydrated);
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
      <StatusBar style="dark" />
      <AppShell showBanner={showBanner}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
              color: colors.text,
            },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Moja savršena proslava' }} />
          <Stack.Screen name="settings" options={{ title: 'Postavke' }} />
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
      </AppShell>
    </SafeAreaProvider>
  );
}
