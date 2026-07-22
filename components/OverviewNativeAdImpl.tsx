import { Image, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
  TestIds,
} from 'react-native-google-mobile-ads';

import { OVERVIEW_NATIVE_AD_UNIT_ID } from '@/constants/ads';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const adUnitId = __DEV__ ? TestIds.NATIVE : OVERVIEW_NATIVE_AD_UNIT_ID;

export function OverviewNativeAdImpl() {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    let mounted = true;
    let loadedAd: NativeAd | null = null;

    NativeAd.createForAdRequest(adUnitId)
      .then((ad) => {
        loadedAd = ad;
        if (mounted) {
          setNativeAd(ad);
        } else {
          ad.destroy();
        }
      })
      .catch((error) => {
        console.warn('Overview native ad failed to load:', error);
      });

    return () => {
      mounted = false;
      loadedAd?.destroy();
    };
  }, []);

  if (!nativeAd) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
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

        <NativeAdView nativeAd={nativeAd} style={styles.adView}>
          <View style={styles.headerRow}>
            {nativeAd.icon?.url ? (
              <NativeAsset assetType={NativeAssetType.ICON}>
                <Image
                  source={{ uri: nativeAd.icon.url }}
                  style={styles.icon}
                  resizeMode="cover"
                />
              </NativeAsset>
            ) : null}

            <View style={styles.headerText}>
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={[styles.headline, { color: theme.text }]} numberOfLines={2}>
                  {nativeAd.headline}
                </Text>
              </NativeAsset>

              {nativeAd.advertiser ? (
                <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                  <Text style={[styles.advertiser, { color: theme.textSecondary }]} numberOfLines={1}>
                    {nativeAd.advertiser}
                  </Text>
                </NativeAsset>
              ) : null}
            </View>
          </View>

          {nativeAd.body ? (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Text style={[styles.body, { color: theme.textSecondary }]} numberOfLines={3}>
                {nativeAd.body}
              </Text>
            </NativeAsset>
          ) : null}

          {nativeAd.mediaContent ? (
            <NativeMediaView style={styles.media} resizeMode="cover" />
          ) : null}

          {nativeAd.callToAction ? (
            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <View style={[styles.cta, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.ctaText, { color: theme.primaryDark }]}>
                  {nativeAd.callToAction}
                </Text>
              </View>
            </NativeAsset>
          ) : null}
        </NativeAdView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
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
  },
  cta: {
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  ctaText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
