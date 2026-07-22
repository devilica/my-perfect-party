import { RefObject } from 'react';
import { View } from 'react-native';

import { DownloadInvitationResult } from '@/lib/downloadInvitationImage';

export async function downloadInvitationImage(
  _previewRef: RefObject<View | null>
): Promise<DownloadInvitationResult> {
  return 'unavailable';
}
