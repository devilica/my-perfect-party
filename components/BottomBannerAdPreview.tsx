import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { colors, radius, spacing, typography } from '@/theme/colors';

const BANNER_HEIGHT = 50;

export function BottomBannerAdPreview() {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.icon, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="megaphone-outline" size={18} color={theme.primaryDark} />
        </View>

        <View style={styles.textBlock}>
          <Text style={[styles.headline, { color: theme.text }]} numberOfLines={1}>
            {t('ads.testHeadline')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {t('ads.bannerTestSubtitle')}
          </Text>
        </View>

        <Text style={[styles.badge, { color: theme.textMuted, backgroundColor: theme.background }]}>
          {t('ads.sponsored')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  banner: {
    width: '100%',
    height: BANNER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  headline: {
    ...typography.caption,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.small,
  },
  badge: {
    ...typography.small,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
