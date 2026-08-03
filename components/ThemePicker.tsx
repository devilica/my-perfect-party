import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CELEBRATION_THEME_IDS, getCelebrationTheme } from '@/theme/celebrations';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';
import { CelebrationThemeId } from '@/types/models';

type ThemePickerProps = {
  label: string;
  selected: CelebrationThemeId;
  onSelect: (themeId: CelebrationThemeId) => void;
  getLabel: (themeId: CelebrationThemeId) => string;
};

export function ThemePicker({
  label,
  selected,
  onSelect,
  getLabel,
}: ThemePickerProps) {
  const theme = useThemeColors();

  return (
    <View style={[styles.wrap, !label && styles.wrapCompact]}>
      {label ? (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CELEBRATION_THEME_IDS.map((themeId) => {
          const celebrationTheme = getCelebrationTheme(themeId);
          const active = selected === themeId;

          return (
            <Pressable
              key={themeId}
              onPress={() => onSelect(themeId)}
              style={[
                styles.card,
                { borderColor: theme.border, backgroundColor: theme.surface },
                active && { borderColor: theme.primary },
              ]}
            >
              <ImageBackground
                source={celebrationTheme.backgroundImage}
                style={styles.preview}
                imageStyle={styles.previewImage}
              >
                <View style={styles.previewOverlay}>
                  <Ionicons name={celebrationTheme.icon} size={22} color="#FFFFFF" />
                </View>
              </ImageBackground>
              <Text
                style={[
                  styles.cardLabel,
                  { color: theme.textSecondary },
                  active && { color: theme.primaryDark },
                ]}
              >
                {getLabel(themeId)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  wrapCompact: {
    marginBottom: 0,
  },
  label: {
    ...typography.caption,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  scroll: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  card: {
    width: 96,
    borderRadius: radius.md,
    borderWidth: 2,
    overflow: 'hidden',
  },
  preview: {
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    borderTopLeftRadius: radius.md - 2,
    borderTopRightRadius: radius.md - 2,
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    ...typography.small,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    fontWeight: '600',
  },
});
