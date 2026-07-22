import { RefObject } from 'react';
import { Alert, View } from 'react-native';

type ShareResult = 'shared' | 'unavailable';

export async function shareInvitationImage(
  _previewRef: RefObject<View | null>,
  unavailableMessage?: string
): Promise<ShareResult> {
  Alert.alert(
    unavailableMessage ?? 'Sharing is available on mobile devices.',
    undefined,
    [{ text: 'OK' }]
  );
  return 'unavailable';
}
