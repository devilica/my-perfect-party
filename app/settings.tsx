import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { FormScrollView } from '@/components/FormScrollView';
import { BottomBannerAd } from '@/components/BottomBannerAd';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SelectField } from '@/components/SelectField';
import { ThemePicker } from '@/components/ThemePicker';
import { Button, Card, TextInputField } from '@/components/ui';
import { getLanguageSelectOptions } from '@/constants/languages';
import { INSTAGRAM_APP_URL, INSTAGRAM_USERNAME, INSTAGRAM_WEB_URL } from '@/constants/social';
import { SUPPORT_EMAIL } from '@/constants/support';
import { openPlayStore } from '@/lib/openPlayStore';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';
import { validateBackupEmail } from '@/lib/backup';
import { formatDisplayDateTime } from '@/lib/dateUtils';
import { useTranslation } from '@/lib/i18n';
import {
  areNotificationsSupported,
  requestNotificationPermissions,
} from '@/lib/notifications';
import { preloadRewardedThemeAd, showRewardedThemeAd } from '@/lib/rewardedThemeAd';
import { restoreBackup } from '@/lib/restoreBackup';
import { sendBackupEmail } from '@/lib/sendBackupEmail';
import { useWeddingStore } from '@/store/weddingStore';
import { CelebrationThemeId, Language } from '@/types/models';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const language = useWeddingStore((s) => s.language);
  const appTheme = useWeddingStore((s) => s.appTheme);
  const backupEmail = useWeddingStore((s) => s.backupEmail);
  const lastBackupAt = useWeddingStore((s) => s.lastBackupAt);
  const setLanguage = useWeddingStore((s) => s.setLanguage);
  const setAppTheme = useWeddingStore((s) => s.setAppTheme);
  const setBackupEmail = useWeddingStore((s) => s.setBackupEmail);
  const notificationsEnabled = useWeddingStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useWeddingStore((s) => s.setNotificationsEnabled);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const isOnline = useIsOnline();

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

  const ensureThemeReward = async (): Promise<boolean> => {
    if (!areAdsEnabled() || !isOnline) return true;

    const result = await showRewardedThemeAd();
    if (result === 'rewarded') {
      preloadRewardedThemeAd();
      return true;
    }
    if (result === 'unavailable' || result === 'failed') return true;
    return false;
  };

  const handleThemeChange = async (themeId: CelebrationThemeId) => {
    if (themeId === appTheme || themeAdLoading) return;

    setThemeAdLoading(true);
    try {
      if (await ensureThemeReward()) {
        setAppTheme(themeId);
      }
    } finally {
      setThemeAdLoading(false);
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    if (!value) {
      setNotificationsEnabled(false);
      return;
    }

    if (!areNotificationsSupported()) {
      Alert.alert(t('common.error'), t('settings.notificationsUnsupported'));
      return;
    }

    const granted = await requestNotificationPermissions();
    if (!granted) {
      Alert.alert(t('common.error'), t('settings.notificationsPermissionDenied'));
      return;
    }

    setNotificationsEnabled(true);
  };

  const handleNotificationsInfo = () => {
    Alert.alert(t('settings.notificationsInfoTitle'), t('settings.notificationsInfoMessage'));
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

  const handleContactSupport = () => {
    Linking.openURL(
      `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t('settings.supportEmailSubject'))}`
    ).catch(() => {
      Alert.alert(t('common.error'), t('settings.supportMailUnavailable'));
    });
  };

  const handleOpenInstagram = async () => {
    try {
      const canOpenApp = await Linking.canOpenURL(INSTAGRAM_APP_URL);
      await Linking.openURL(canOpenApp ? INSTAGRAM_APP_URL : INSTAGRAM_WEB_URL);
    } catch {
      Alert.alert(t('common.error'), t('settings.instagramUnavailable'));
    }
  };

  const handleOpenPlayStore = async () => {
    const result = await openPlayStore();
    if (result === 'failed') {
      Alert.alert(t('common.error'), t('settings.reviewUnavailable'));
    }
  };

  const lastSyncLabel = lastBackupAt
    ? formatDisplayDateTime(lastBackupAt, language)
    : t('settings.backupNeverSynced');

  const canSync = validateBackupEmail(emailDraft.trim());
  const appVersion = Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '—';

  return (
    <ScreenContainer style={{ paddingTop: spacing.md }}>
      <Stack.Screen options={{ title: t('settings.title') }} />

      <View style={styles.screen}>
        <FormScrollView
          contentContainerStyle={{
            paddingBottom: spacing.lg,
          }}
          showsVerticalScrollIndicator={false}
        >
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('settings.appTheme')}
      </Text>
      <Card style={styles.themeCard}>
        <Text style={[styles.themeHint, { color: theme.textSecondary }]}>
          {t('settings.appThemeHint')} {t('settings.themeChangeAdHint')}
        </Text>
        <ThemePicker
          label=""
          selected={appTheme}
          onSelect={handleThemeChange}
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

      <Card style={styles.notificationsCard}>
        <View style={styles.notificationsRow}>
          <View style={styles.notificationsLabelWrap}>
            <Text style={[styles.notificationsLabel, { color: theme.text }]}>
              {t('settings.notificationsLabel')}
            </Text>
            <Pressable
              onPress={handleNotificationsInfo}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t('settings.notificationsInfoTitle')}
            >
              <Ionicons name="information-circle-outline" size={20} color={theme.textMuted} />
            </Pressable>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsToggle}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={notificationsEnabled ? theme.primary : theme.surface}
          />
        </View>
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
        <Pressable
          onPress={() => router.push('/legal/privacy')}
          style={({ pressed }) => [styles.aboutLegalRow, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons name="shield-checkmark-outline" size={18} color={theme.primary} />
          <Text style={[styles.aboutLegalText, { color: theme.text }]}>{t('settings.privacyPolicy')}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/legal/terms')}
          style={({ pressed }) => [styles.aboutLegalRow, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons name="document-text-outline" size={18} color={theme.primary} />
          <Text style={[styles.aboutLegalText, { color: theme.text }]}>{t('settings.termsOfUse')}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/legal/ads')}
          style={({ pressed }) => [styles.aboutLegalRow, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons name="megaphone-outline" size={18} color={theme.primary} />
          <Text style={[styles.aboutLegalText, { color: theme.text }]}>{t('settings.adsInfo')}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => router.push('/legal/usage')}
          style={({ pressed }) => [styles.aboutLegalRow, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Ionicons name="book-outline" size={18} color={theme.primary} />
          <Text style={[styles.aboutLegalText, { color: theme.text }]}>{t('settings.usageGuide')}</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
        </Pressable>
      </Card>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('settings.instagramTitle')}
      </Text>
      <Pressable
        onPress={handleOpenInstagram}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Card style={styles.instagramCard}>
          <View style={styles.instagramRow}>
            <View style={[styles.instagramIconWrap, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="logo-instagram" size={22} color={theme.primaryDark} />
            </View>
            <View style={styles.instagramTextWrap}>
              <Text style={[styles.instagramTitle, { color: theme.text }]}>
                {t('settings.instagramTitle')}
              </Text>
              <Text style={[styles.instagramUsername, { color: theme.textSecondary }]}>
                @{INSTAGRAM_USERNAME}
              </Text>
            </View>
            <Ionicons name="open-outline" size={20} color={theme.textMuted} />
          </View>
        </Card>
      </Pressable>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('settings.reviewTitle')}
      </Text>
      <Pressable
        onPress={handleOpenPlayStore}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Card style={styles.instagramCard}>
          <View style={styles.instagramRow}>
            <View style={[styles.instagramIconWrap, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="star-outline" size={22} color={theme.primaryDark} />
            </View>
            <View style={styles.instagramTextWrap}>
              <Text style={[styles.instagramTitle, { color: theme.text }]}>
                {t('settings.reviewTitle')}
              </Text>
              <Text style={[styles.instagramUsername, { color: theme.textSecondary }]}>
                {t('settings.reviewDescription')}
              </Text>
            </View>
            <Ionicons name="open-outline" size={20} color={theme.textMuted} />
          </View>
        </Card>
      </Pressable>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {t('settings.supportTitle')}
      </Text>
      <Card style={styles.supportCard}>
        <Text style={[styles.supportDescription, { color: theme.textSecondary }]}>
          {t('settings.supportDescription')}
        </Text>
        <Button
          label={t('settings.contactSupport')}
          onPress={handleContactSupport}
          variant="secondary"
          icon="mail-outline"
        />
        <Text style={[styles.supportEmail, { color: theme.textMuted }]}>{SUPPORT_EMAIL}</Text>
      </Card>

      <View style={styles.footerBrand}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.footerLogo}
          resizeMode="contain"
          accessibilityLabel={t('app.name')}
        />
        <Text style={[styles.versionText, { color: theme.textMuted }]}>
          {t('settings.version', { version: appVersion })}
        </Text>
        <Text style={[styles.copyrightText, { color: theme.textMuted }]}>
          {t('settings.copyright', {
            year: new Date().getFullYear(),
            appName: t('app.name'),
          })}
        </Text>
      </View>
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
  notificationsCard: {
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  notificationsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  notificationsLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  notificationsLabel: {
    ...typography.body,
    fontWeight: '600',
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
  aboutLegalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  aboutLegalText: {
    ...typography.body,
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  instagramCard: {
    padding: spacing.sm,
  },
  instagramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  instagramIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instagramTextWrap: {
    flex: 1,
    gap: 2,
  },
  instagramTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  instagramUsername: {
    ...typography.caption,
  },
  supportCard: {
    gap: spacing.sm,
  },
  supportDescription: {
    ...typography.body,
    lineHeight: 22,
  },
  supportEmail: {
    ...typography.caption,
    textAlign: 'center',
  },
  footerBrand: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  footerLogo: {
    width: 120,
    height: 120,
  },
  versionText: {
    ...typography.caption,
    textAlign: 'center',
  },
  copyrightText: {
    ...typography.caption,
    textAlign: 'center',
    fontSize: 11,
  },
});
