import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { finishRewardedAdPreview } from '@/lib/rewardedAdPreviewController';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const COUNTDOWN_SECONDS = 3;

type RewardedAdPreviewModalProps = {
  visible: boolean;
};

export function RewardedAdPreviewModal({ visible }: RewardedAdPreviewModalProps) {
  const language = useWeddingStore((s) => s.language);
  const { t } = useTranslation(language);
  const theme = useThemeColors();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(COUNTDOWN_SECONDS);
      return;
    }

    setSecondsLeft(COUNTDOWN_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const canClose = secondsLeft === 0;

  const handleDismiss = () => {
    finishRewardedAdPreview(canClose ? 'rewarded' : 'closed');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <Pressable style={[styles.overlay, { backgroundColor: theme.overlay }]} onPress={handleDismiss}>
        <Pressable
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={[styles.title, { color: theme.text }]}>{t('ads.rewardedTitle')}</Text>
          <Text style={[styles.note, { color: theme.textSecondary }]}>{t('ads.rewardedPreviewNote')}</Text>

          <View style={[styles.media, { backgroundColor: theme.background }]}>
            <Ionicons name="play-circle-outline" size={56} color={theme.textMuted} />
          </View>

          <Text style={[styles.status, { color: theme.textSecondary }]}>
            {canClose ? t('ads.rewardedClose') : `${t('ads.rewardedPlaying')} ${secondsLeft}`}
          </Text>

          <Pressable
            style={[
              styles.closeButton,
              { backgroundColor: canClose ? theme.primary : theme.border },
            ]}
            disabled={!canClose}
            onPress={handleDismiss}
          >
            <Text
              style={[
                styles.closeButtonText,
                { color: canClose ? theme.surface : theme.textMuted },
              ]}
            >
              {t('ads.rewardedClose')}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.subheading,
    textAlign: 'center',
  },
  note: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
  media: {
    height: 220,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    ...typography.body,
    textAlign: 'center',
  },
  closeButton: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
});
