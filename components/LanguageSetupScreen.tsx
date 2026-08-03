import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import {
  getLanguageDisplayLabel,
  getLanguageSelectOptions,
  Language,
} from '@/constants/languages';
import { translate } from '@/lib/i18n';
import { flexFill, webViewportHeight } from '@/lib/webLayout';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

export function LanguageSetupScreen() {
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const confirmLanguageSelection = useWeddingStore((s) => s.confirmLanguageSelection);
  const storedLanguage = useWeddingStore((s) => s.language);

  const [pendingLanguage, setPendingLanguage] = useState<Language>(storedLanguage);

  const languageOptions = useMemo(() => getLanguageSelectOptions(), []);

  const title = translate(pendingLanguage, 'onboarding.selectLanguage');
  const continueLabel = translate(pendingLanguage, 'onboarding.continue');
  const appName = translate(pendingLanguage, 'app.name');

  const handleContinue = () => {
    confirmLanguageSelection(pendingLanguage);
  };

  return (
    <LinearGradient
      colors={[theme.background, theme.primaryLight]}
      style={[styles.container, webViewportHeight]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View
        style={[
          styles.inner,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: theme.surface }]}>
            <Ionicons name="heart" size={36} color={theme.primary} />
            <View style={styles.sparkle}>
              <Ionicons name="sparkles" size={20} color={theme.primaryDark} />
            </View>
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>{appName}</Text>
          <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {languageOptions.map((option) => {
            const active = option.value === pendingLanguage;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPendingLanguage(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: active ? theme.primaryLight : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.optionText, { color: active ? theme.primaryDark : theme.text }]}>
                  {getLanguageDisplayLabel(option.value)}
                </Text>
                {active ? (
                  <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <Button label={continueLabel} onPress={handleContinue} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...flexFill,
  },
  inner: {
    ...flexFill,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  sparkle: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  appName: {
    ...typography.subheading,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.body,
    textAlign: 'center',
  },
  list: {
    ...flexFill,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  optionText: {
    ...typography.body,
    flex: 1,
    paddingRight: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  footer: {
    paddingTop: spacing.md,
  },
});
