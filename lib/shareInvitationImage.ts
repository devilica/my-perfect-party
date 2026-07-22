import { RefObject } from 'react';
import { View } from 'react-native';
import * as Sharing from 'expo-sharing';

import { captureInvitationImage } from '@/lib/captureInvitationImage';

export async function shareInvitationImage(
  previewRef: RefObject<View | null>,
  _unavailableMessage?: string
): Promise<'shared' | 'unavailable'> {
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) return 'unavailable';

  const uri = await captureInvitationImage(previewRef);
  if (!uri) return 'unavailable';

  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: 'Share invitation',
  });

  return 'shared';
}
