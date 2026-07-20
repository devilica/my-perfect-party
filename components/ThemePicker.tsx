import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CELEBRATION_THEME_IDS, getCelebrationTheme } from '@/theme/celebrations';
import { colors, radius, spacing, typography } from '@/theme/colors';
import { CelebrationThemeId } from '@/types/models';

type ThemePickerProps = {
  label: string;
  selected: CelebrationThemeId;
  onSelect: (themeId: CelebrationThemeId) => void;
  getLabel: (themeId: CelebrationThemeId) => string;
};

export function ThemePicker({ label, selected, onSelect, getLabel }: ThemePickerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CELEBRATION_THEME_IDS.map((themeId) => {
          const theme = getCelebrationTheme(themeId);
          const active = selected === themeId;

          return (
            <Pressable
              key={themeId}
              onPress={() => onSelect(themeId)}
              style={[styles.card, active && styles.cardActive]}
            >
              <ImageBackground
                source={theme.backgroundImage}
                style={styles.preview}
                imageStyle={styles.previewImage}
              >
                <View style={styles.previewOverlay}>
                  <Ionicons name={theme.icon} size={22} color="#FFFFFF" />
                </View>
              </ImageBackground>
              <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>
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
  label: {
    ...typography.caption,
    color: colors.textSecondary,
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
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  cardActive: {
    borderColor: colors.primary,
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
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    fontWeight: '600',
  },
  cardLabelActive: {
    color: colors.primaryDark,
  },
});
