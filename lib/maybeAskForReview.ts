import { Alert } from 'react-native';

import { openPlayStore } from '@/lib/openPlayStore';
import { translate } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';

export function maybeAskForReview(): void {
  const state = useWeddingStore.getState();
  if (state.reviewPromptDone) return;

  if (state.events.length <= 3) return;

  const { language, markReviewPromptDone } = state;
  const t = (key: string) => translate(language, key);

  Alert.alert(t('settings.reviewPromptTitle'), t('settings.reviewPromptMessage'), [
    {
      text: t('settings.reviewPromptLater'),
      style: 'cancel',
      onPress: () => markReviewPromptDone(),
    },
    {
      text: t('settings.reviewPromptRate'),
      onPress: async () => {
        markReviewPromptDone();
        const result = await openPlayStore();
        if (result === 'failed') {
          Alert.alert(t('common.error'), t('settings.reviewUnavailable'));
        }
      },
    },
  ]);
}
