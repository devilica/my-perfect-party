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
  mode?: 'free' | 'unlockable';
  unlockedThemes?: CelebrationThemeId[];
  onLockedThemePress?: (themeId: CelebrationThemeId) => void;
};

export function ThemePicker({
  label,
  selected,
  onSelect,
  getLabel,
  mode = 'free',
  unlockedThemes,
  onLockedThemePress,
}: ThemePickerProps) {
  const theme = useThemeColors();

  const isUnlocked = (themeId: CelebrationThemeId) => {
    if (mode !== 'unlockable') return true;
    return unlockedThemes?.includes(themeId) ?? false;
  };

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
          const unlocked = isUnlocked(themeId);

          return (
            <Pressable
              key={themeId}
              onPress={() => {
                if (unlocked) {
                  onSelect(themeId);
                } else {
                  onLockedThemePress?.(themeId);
                }
              }}
              style={[
                styles.card,
                { borderColor: theme.border, backgroundColor: theme.surface },
                active && unlocked && { borderColor: theme.primary },
                !unlocked && styles.cardLocked,
              ]}
            >
              <ImageBackground
                source={celebrationTheme.backgroundImage}
                style={styles.preview}
                imageStyle={styles.previewImage}
              >
                <View
                  style={[
                    styles.previewOverlay,
                    !unlocked && styles.previewOverlayLocked,
                  ]}
                >
                  {unlocked ? (
                    <Ionicons name={celebrationTheme.icon} size={22} color="#FFFFFF" />
                  ) : (
                    <Ionicons name="lock-closed" size={22} color="#FFFFFF" />
                  )}
                </View>
              </ImageBackground>
              <Text
                style={[
                  styles.cardLabel,
                  { color: theme.textSecondary },
                  active && unlocked && { color: theme.primaryDark },
                  !unlocked && { color: theme.textMuted },
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
  cardLocked: {
    opacity: 0.85,
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
  previewOverlayLocked: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  cardLabel: {
    ...typography.small,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    fontWeight: '600',
  },
});
