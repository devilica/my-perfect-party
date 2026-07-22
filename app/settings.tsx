import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';

import { ScreenContainer } from '@/components/ScreenContainer';
import { SelectField } from '@/components/SelectField';
import { ThemePicker } from '@/components/ThemePicker';
import { Button, Card, TextInputField } from '@/components/ui';
import { useBannerClearance } from '@/hooks/useBannerClearance';
import { getLanguageSelectOptions } from '@/constants/languages';
import { validateBackupEmail } from '@/lib/backup';
import { formatDisplayDateTime } from '@/lib/dateUtils';
import { useTranslation } from '@/lib/i18n';
import { preloadRewardedThemeAd, showRewardedThemeAd } from '@/lib/rewardedThemeAd';
import { restoreBackup } from '@/lib/restoreBackup';
import { sendBackupEmail } from '@/lib/sendBackupEmail';
import { useWeddingStore } from '@/store/weddingStore';
import { CelebrationThemeId, Language } from '@/types/models';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

export default function SettingsScreen() {
  const language = useWeddingStore((s) => s.language);
  const appTheme = useWeddingStore((s) => s.appTheme);
  const unlockedAppThemes = useWeddingStore((s) => s.unlockedAppThemes);
  const backupEmail = useWeddingStore((s) => s.backupEmail);
  const lastBackupAt = useWeddingStore((s) => s.lastBackupAt);
  const setLanguage = useWeddingStore((s) => s.setLanguage);
  const setAppTheme = useWeddingStore((s) => s.setAppTheme);
  const unlockAppTheme = useWeddingStore((s) => s.unlockAppTheme);
  const setBackupEmail = useWeddingStore((s) => s.setBackupEmail);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const bannerClearance = useBannerClearance();

  const [emailDraft, setEmailDraft] = useState(backupEmail);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [syncing, setSyncing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [themeAdLoading, setThemeAdLoading] = useState(false);

  useEffect(() => {
    preloadRewardedThemeAd();
  }, []);
  useEffect(() => {
    setEmailDraft(backupEmail);
  }, [backupEmail]);

  const handleUnlockTheme = async (themeId: CelebrationThemeId) => {
    if (themeAdLoading || unlockedAppThemes.includes(themeId)) return;

    setThemeAdLoading(true);
    try {
      const result = await showRewardedThemeAd();

      if (result === 'rewarded') {
        unlockAppTheme(themeId);
        setAppTheme(themeId);
        Alert.alert(t('common.success'), t('settings.themeUnlocked'));
        preloadRewardedThemeAd();
      } else if (result === 'unavailable' || result === 'failed') {
        Alert.alert(t('common.error'), t('settings.themeAdUnavailable'));
      }
    } finally {
      setThemeAdLoading(false);
    }
  };

  const languageOptions = getLanguageSelectOptions();

  const handleSaveEmail = () => {
    const trimmed = emailDraft.trim();
    if (trimmed && !validateBackupEmail(trimmed)) {
      setEmailError(t('settings.backupEmailInvalid'));
      return;
    }

    setEmailError(undefined);
    setBackupEmail(trimmed);
  };

  const handleSyncNow = async () => {
    const trimmed = emailDraft.trim();
    if (!trimmed || !validateBackupEmail(trimmed)) {
      setEmailError(t('settings.backupEmailInvalid'));
      return;
    }

    if (trimmed !== backupEmail) {
      setBackupEmail(trimmed);
    }

    setSyncing(true);
    try {
      const result = await sendBackupEmail({
        email: trimmed,
        subject: t('settings.backupTitle'),
        body: t('settings.backupDescription'),
      });

      if (result === 'sent' || result === 'saved') {
        Alert.alert(t('common.success'), t('settings.backupSyncSuccess'));
      } else if (result === 'shared') {
        Alert.alert(t('common.success'), t('settings.backupMailUnavailable'));
      } else if (result === 'cancelled') {
        Alert.alert(t('settings.backupSyncCancelled'));
      } else {
        Alert.alert(t('common.error'), t('settings.backupSyncFailed'));
      }
    } catch {
      Alert.alert(t('common.error'), t('settings.backupSyncFailed'));
    } finally {
      setSyncing(false);
    }
  };

  const handleImportBackup = async () => {
    setImporting(true);
    try {
      await restoreBackup({
        importConfirmTitle: t('settings.backupImportConfirmTitle'),
        importConfirmMessage: t('settings.backupImportConfirmMessage'),
        importSuccess: t('settings.backupImportSuccess'),
        importFailed: t('settings.backupImportFailed'),
        invalidFile: t('settings.backupInvalidFile'),
        cancel: t('common.cancel'),
        confirm: t('common.confirm'),
      });
    } finally {
      setImporting(false);
    }
  };

  const lastSyncLabel = lastBackupAt
    ? formatDisplayDateTime(lastBackupAt, language)
    : t('settings.backupNeverSynced');

  const canSync = validateBackupEmail(emailDraft.trim());

  return (
    <ScreenContainer style={{ paddingTop: spacing.md }}>
      <Stack.Screen options={{ title: t('settings.title') }} />

      <FormScrollView
        contentContainerStyle={{ paddingBottom: bannerClearance + spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('settings.appTheme')}
      </Text>
      <Card style={styles.themeCard}>
        <Text style={[styles.themeHint, { color: theme.textSecondary }]}>
          {t('settings.appThemeHint')} {t('settings.themeUnlockHint')}
        </Text>
        <ThemePicker
          label=""
          mode="unlockable"
          unlockedThemes={unlockedAppThemes}
          selected={appTheme}
          onSelect={setAppTheme}
          onLockedThemePress={handleUnlockTheme}
          getLabel={(themeId) => t(`events.themes.${themeId}`)}
        />
      </Card>

      <Card style={styles.languageCard}>
        <SelectField<Language>
          label={t('settings.language')}
          value={language}
          options={languageOptions}
          onChange={setLanguage}
        />
      </Card>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('settings.backupTitle')}
      </Text>
      <Card style={styles.backupCard}>
        <Text style={[styles.backupDescription, { color: theme.textSecondary }]}>
          {t('settings.backupDescription')}
        </Text>

        <TextInputField
          label={t('settings.backupEmail')}
          value={emailDraft}
          onChangeText={(text) => {
            setEmailDraft(text);
            if (emailError) setEmailError(undefined);
          }}
          placeholder={t('settings.backupEmailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        <Button
          label={t('common.save')}
          onPress={handleSaveEmail}
          variant="secondary"
          icon="save-outline"
          style={styles.backupAction}
        />

        <View style={[styles.lastSyncRow, { backgroundColor: theme.background }]}>
          <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
          <View style={styles.lastSyncTextWrap}>
            <Text style={[styles.lastSyncLabel, { color: theme.textSecondary }]}>
              {t('settings.backupLastSync')}
            </Text>
            <Text style={[styles.lastSyncValue, { color: theme.text }]}>
              {lastSyncLabel}
            </Text>
          </View>
        </View>

        <Button
          label={syncing ? t('settings.backupSyncing') : t('settings.backupSyncNow')}
          onPress={handleSyncNow}
          icon="cloud-upload-outline"
          disabled={!canSync || syncing}
          loading={syncing}
          style={styles.backupAction}
        />

        <Button
          label={t('settings.backupImport')}
          onPress={handleImportBackup}
          variant="secondary"
          icon="cloud-download-outline"
          disabled={importing}
          loading={importing}
          style={styles.backupAction}
        />
      </Card>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('settings.about')}
      </Text>
      <Card>
        <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
          {t('settings.aboutText')}
        </Text>
        <View style={[styles.storageRow, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="phone-portrait-outline" size={18} color={theme.primary} />
          <Text style={[styles.storageText, { color: theme.primaryDark }]}>
            {t('settings.dataStorage')}
          </Text>
        </View>
      </Card>
      </FormScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  themeCard: {
    gap: spacing.xs,
  },
  themeHint: {
    ...typography.caption,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  languageCard: {
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  backupCard: {
    gap: spacing.sm,
  },
  backupDescription: {
    ...typography.body,
    lineHeight: 22,
  },
  backupAction: {
    marginTop: spacing.xs,
  },
  lastSyncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  lastSyncTextWrap: {
    flex: 1,
  },
  lastSyncLabel: {
    ...typography.caption,
  },
  lastSyncValue: {
    ...typography.body,
    fontWeight: '600',
  },
  aboutText: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  storageText: {
    ...typography.caption,
    flex: 1,
  },
});
