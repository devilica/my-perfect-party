import { Stack } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomBannerAd } from '@/components/BottomBannerAd';
import { FormScrollView } from '@/components/FormScrollView';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';
import { ScreenContainer } from '@/components/ScreenContainer';
import { PRIVACY_SECTIONS, TERMS_SECTIONS, type LegalSection } from '@/constants/legal';
import { ADS_INFO_SECTIONS } from '@/constants/adsInfo';
import { SUPPORT_EMAIL } from '@/constants/support';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { spacing, typography } from '@/theme/colors';

type LegalDocumentViewProps = {
  document: 'privacy' | 'terms' | 'ads';
};

function renderSections(
  sections: LegalSection[],
  t: (key: string, params?: Record<string, string | number>) => string,
  theme: ReturnType<typeof useThemeColors>
) {
  return sections.map((section) => (
    <View key={section.titleKey} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t(section.titleKey)}</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {t(section.bodyKey, { email: SUPPORT_EMAIL })}
      </Text>
      {section.linkKey && section.linkUrl ? (
        <Pressable
          onPress={() => {
            Linking.openURL(section.linkUrl!).catch(() => undefined);
          }}
          style={({ pressed }) => [styles.linkWrap, pressed && styles.pressed]}
        >
          <Text style={[styles.link, { color: theme.primaryDark }]}>{t(section.linkKey)}</Text>
        </Pressable>
      ) : null}
    </View>
  ));
}

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const prefix =
    document === 'privacy' ? 'legal.privacy' : document === 'terms' ? 'legal.terms' : 'legal.ads';
  const sections =
    document === 'privacy'
      ? PRIVACY_SECTIONS
      : document === 'terms'
        ? TERMS_SECTIONS
        : ADS_INFO_SECTIONS;
  const screenTitle = t(`${prefix}.title`);

  return (
    <ScreenContainer style={{ paddingTop: spacing.md }}>
      <Stack.Screen options={{ title: screenTitle }} />
      <View style={styles.screen}>
        <FormScrollView
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.docTitle, { color: theme.text }]}>{screenTitle}</Text>
          {document !== 'ads' ? (
            <Text style={[styles.effectiveDate, { color: theme.textMuted }]}>
              {t(`${prefix}.effectiveDate`)}
            </Text>
          ) : null}
          <Text style={[styles.intro, { color: theme.textSecondary }]}>{t(`${prefix}.intro`)}</Text>
          {renderSections(sections, t, theme)}
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
  docTitle: {
    ...typography.heading,
    marginBottom: spacing.xs,
  },
  effectiveDate: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  intro: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.subheading,
  },
  body: {
    ...typography.body,
    lineHeight: 22,
  },
  linkWrap: {
    marginTop: spacing.xs,
  },
  link: {
    ...typography.body,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.85,
  },
});
