import { RefObject } from 'react';
import { View } from 'react-native';

import { isExpoGo } from '@/lib/adsEnvironment';
import { captureInvitationImage } from '@/lib/captureInvitationImage';
import { shareInvitationImage } from '@/lib/shareInvitationImage';

export type DownloadInvitationResult = 'saved' | 'denied' | 'unavailable';

export async function downloadInvitationImage(
  previewRef: RefObject<View | null>
): Promise<DownloadInvitationResult> {
  if (isExpoGo()) {
    const result = await shareInvitationImage(previewRef);
    return result === 'shared' ? 'saved' : 'unavailable';
  }

  const MediaLibrary = await import('expo-media-library/legacy');
  const { granted } = await MediaLibrary.requestPermissionsAsync(true);
  if (!granted) return 'denied';

  const uri = await captureInvitationImage(previewRef);
  if (!uri) return 'unavailable';

  await MediaLibrary.saveToLibraryAsync(uri);
  return 'saved';
}
