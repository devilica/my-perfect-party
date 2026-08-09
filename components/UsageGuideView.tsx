import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

import { BottomBannerAd } from '@/components/BottomBannerAd';
import { FormScrollView } from '@/components/FormScrollView';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/ui';
import { USAGE_GUIDE_SECTIONS } from '@/constants/usageGuide';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function UsageGuideView() {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const [openKey, setOpenKey] = useState<string | null>(USAGE_GUIDE_SECTIONS[0]?.titleKey ?? null);

  const toggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenKey((current) => (current === key ? null : key));
  };

  return (
    <ScreenContainer style={{ paddingTop: spacing.md }}>
      <Stack.Screen options={{ title: t('legal.usage.title') }} />
      <View style={styles.screen}>
        <FormScrollView
          contentContainerStyle={{ paddingBottom: spacing.lg, gap: spacing.sm }}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.hero}>
            <View style={[styles.heroIcon, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="book-outline" size={28} color={theme.primaryDark} />
            </View>
            <Text style={[styles.heroTitle, { color: theme.text }]}>{t('legal.usage.title')}</Text>
            <Text style={[styles.heroIntro, { color: theme.textSecondary }]}>
              {t('legal.usage.intro')}
            </Text>
          </Card>

          <Text style={[styles.listHint, { color: theme.textMuted }]}>
            {t('legal.usage.tapHint')}
          </Text>

          {USAGE_GUIDE_SECTIONS.map((section) => {
            const isOpen = openKey === section.titleKey;
            return (
              <Card key={section.titleKey} style={styles.sectionCard}>
                <Pressable
                  onPress={() => toggle(section.titleKey)}
                  style={({ pressed }) => [styles.sectionHeader, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isOpen }}
                >
                  <View style={[styles.sectionIcon, { backgroundColor: theme.primaryLight }]}>
                    <Ionicons name={section.icon} size={20} color={theme.primaryDark} />
                  </View>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    {t(section.titleKey)}
                  </Text>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </Pressable>
                {isOpen ? (
                  <Text style={[styles.sectionBody, { color: theme.textSecondary }]}>
                    {t(section.bodyKey)}
                  </Text>
                ) : null}
              </Card>
            );
          })}

          <OverviewNativeAd placement="modal" />
        </FormScrollView>
        <BottomBannerAd />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.heading,
    textAlign: 'center',
  },
  heroIntro: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  listHint: {
    ...typography.caption,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 48,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...typography.subheading,
    fontSize: 15,
    flex: 1,
  },
  sectionBody: {
    ...typography.body,
    lineHeight: 22,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
});
