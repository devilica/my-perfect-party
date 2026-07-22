import { RefObject } from 'react';
import { View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

import { captureInvitationImage } from '@/lib/captureInvitationImage';

export type DownloadInvitationResult = 'saved' | 'denied' | 'unavailable';

export async function downloadInvitationImage(
  previewRef: RefObject<View | null>
): Promise<DownloadInvitationResult> {
  const { granted } = await MediaLibrary.requestPermissionsAsync(true);
  if (!granted) return 'denied';

  const uri = await captureInvitationImage(previewRef);
  if (!uri) return 'unavailable';

  await MediaLibrary.saveToLibraryAsync(uri);
  return 'saved';
}
