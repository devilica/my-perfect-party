import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { OverviewNativeAdPlacement } from '@/components/OverviewNativeAdPlacement';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

type OverviewNativeAdPreviewProps = {
  placement?: OverviewNativeAdPlacement;
};

function getWrapperSpacing(placement: OverviewNativeAdPlacement) {
  return {
    marginTop: placement === 'modal' ? spacing.xl : spacing.lg,
    marginBottom: spacing.md,
  };
}

export function OverviewNativeAdPreview({ placement = 'list' }: OverviewNativeAdPreviewProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  return (
    <View style={[styles.wrapper, getWrapperSpacing(placement)]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.text,
          },
        ]}
      >
        <Text style={[styles.badge, { color: theme.textMuted, backgroundColor: theme.background }]}>
          {t('ads.sponsored')}
        </Text>

        <View style={styles.adView}>
          <View style={styles.headerRow}>
            <View style={[styles.icon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="megaphone-outline" size={22} color={theme.primaryDark} />
            </View>

            <View style={styles.headerText}>
              <Text style={[styles.headline, { color: theme.text }]} numberOfLines={2}>
                {t('ads.testHeadline')}
              </Text>
              <Text style={[styles.advertiser, { color: theme.textSecondary }]} numberOfLines={1}>
                Google Ads
              </Text>
            </View>
          </View>

          <Text style={[styles.body, { color: theme.textSecondary }]} numberOfLines={3}>
            {t('ads.testBody')}
          </Text>

          <View style={[styles.media, { backgroundColor: theme.background }]}>
            <Text style={[styles.mediaLabel, { color: theme.textMuted }]}>{t('ads.sponsored')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  badge: {
    ...typography.small,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  adView: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headline: {
    ...typography.body,
    fontWeight: '600',
  },
  advertiser: {
    ...typography.small,
  },
  body: {
    ...typography.caption,
    lineHeight: 18,
  },
  media: {
    width: '100%',
    height: 140,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaLabel: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
