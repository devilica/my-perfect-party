import { StyleSheet, View } from 'react-native';

import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing } from '@/theme/colors';

/** Reserved space for a lazy-loaded inline native ad (no ad request). */
export function NativeAdListPlaceholder() {
  const theme = useThemeColors();

  return (
    <View
      style={[
        styles.wrapper,
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  card: {
    minHeight: 220,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
});
