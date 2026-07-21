import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { ReactNode, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedScreenContainer } from '@/components/ThemedScreenContainer';
import { useWeddingStore } from '@/store/weddingStore';
import { CelebrationTheme, getCelebrationTheme } from '@/theme/celebrations';
import { EventThemeProvider } from '@/theme/EventThemeContext';

type ThemedEventModalProps = {
  eventId: string;
  children: ReactNode;
};

export function ThemedEventModal({ eventId, children }: ThemedEventModalProps) {
  const eventThemeId = useWeddingStore(
    (s) => s.events.find((event) => event.id === eventId)?.theme ?? 'wedding'
  );

  return (
    <EventThemeProvider themeId={eventThemeId}>
      <ThemedScreenContainer padded={false} style={styles.screen}>
        {children}
      </ThemedScreenContainer>
    </EventThemeProvider>
  );
}

export function useEventCelebrationTheme(eventId: string): CelebrationTheme {
  const themeId = useWeddingStore(
    (s) => s.events.find((event) => event.id === eventId)?.theme ?? 'wedding'
  );

  return useMemo(() => getCelebrationTheme(themeId), [themeId]);
}

export function getThemedModalScreenOptions(
  theme: CelebrationTheme,
  title: string
): NativeStackNavigationOptions {
  return {
    title,
    headerStyle: { backgroundColor: theme.colors.background },
    headerTintColor: theme.colors.primary,
    headerTitleStyle: { color: theme.colors.text },
    contentStyle: { backgroundColor: 'transparent' },
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
