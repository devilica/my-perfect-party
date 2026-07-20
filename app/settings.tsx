import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { Language } from '@/types/models';
import { colors, radius, spacing, typography } from '@/theme/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const language = useWeddingStore((s) => s.language);
  const setLanguage = useWeddingStore((s) => s.setLanguage);
  const { t } = useTranslation(language);

  const options: { value: Language; label: string }[] = [
    { value: 'bs', label: t('settings.languageBs') },
    { value: 'en', label: t('settings.languageEn') },
  ];

  return (
    <ScreenContainer style={{ paddingTop: spacing.md }}>
      <Stack.Screen options={{ title: t('settings.title') }} />

      <Text style={styles.sectionLabel}>{t('settings.language')}</Text>
      <Card style={styles.languageCard}>
        {options.map((option) => {
          const active = language === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setLanguage(option.value)}
              style={[styles.languageOption, active && styles.languageOptionActive]}
            >
              <Text style={[styles.languageText, active && styles.languageTextActive]}>
                {option.label}
              </Text>
              {active ? (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              ) : null}
            </Pressable>
          );
        })}
      </Card>

      <Text style={styles.sectionLabel}>{t('settings.about')}</Text>
      <Card>
        <Text style={styles.aboutText}>{t('settings.aboutText')}</Text>
        <View style={styles.storageRow}>
          <Ionicons name="phone-portrait-outline" size={18} color={colors.primary} />
          <Text style={styles.storageText}>{t('settings.dataStorage')}</Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  languageCard: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  languageOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  languageText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    paddingRight: spacing.sm,
  },
  languageTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  storageText: {
    ...typography.caption,
    color: colors.primaryDark,
    flex: 1,
  },
});
