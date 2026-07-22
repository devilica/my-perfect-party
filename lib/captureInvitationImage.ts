import { RefObject } from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export async function captureInvitationImage(
  previewRef: RefObject<View | null>
): Promise<string | null> {
  if (!previewRef.current) return null;

  return captureRef(previewRef, {
    format: 'png',
    quality: 1,
    result: 'tmpfile',
  });
}
