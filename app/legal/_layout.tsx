import { Stack } from 'expo-router';

import { useThemeColors } from '@/theme/EventThemeContext';

export default function LegalLayout() {
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
        contentStyle: { backgroundColor: 'transparent', flex: 1 },
      }}
    >
      <Stack.Screen name="privacy" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="ads" />
      <Stack.Screen name="usage" />
    </Stack>
  );
}
