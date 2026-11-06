import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type HomeFeatureDecorProps = {
  labels: [string, string, string, string];
};

const FEATURES: {
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { icon: 'people-outline' },
  { icon: 'restaurant-outline' },
  { icon: 'wallet-outline' },
  { icon: 'clipboard-outline' },
];

export function HomeFeatureDecor({ labels }: HomeFeatureDecorProps) {
  const theme = useThemeColors();

  return (
    <View style={styles.row} pointerEvents="none">
      {FEATURES.map((feature, index) => (
        <View
          key={feature.icon}
          style={[
            styles.tile,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name={feature.icon} size={30} color={theme.primaryDark} />
          <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={2}>
            {labels[index]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 360,
    gap: spacing.sm,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 84,
  },
  label: {
    ...typography.small,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
});
