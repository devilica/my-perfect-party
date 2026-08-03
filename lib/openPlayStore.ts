import { Linking } from 'react-native';

import { PLAY_STORE_APP_URL, PLAY_STORE_WEB_URL } from '@/constants/store';

export type OpenPlayStoreResult = 'opened' | 'failed';

export async function openPlayStore(): Promise<OpenPlayStoreResult> {
  try {
    const canOpenApp = await Linking.canOpenURL(PLAY_STORE_APP_URL);
    await Linking.openURL(canOpenApp ? PLAY_STORE_APP_URL : PLAY_STORE_WEB_URL);
    return 'opened';
  } catch {
    return 'failed';
  }
}
