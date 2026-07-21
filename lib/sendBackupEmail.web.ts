import { Alert } from 'react-native';

import {
  createBackupPayload,
  getBackupFileName,
  serializeBackup,
} from '@/lib/backup';
import { useWeddingStore } from '@/store/weddingStore';

export type SendBackupResult =
  | 'sent'
  | 'saved'
  | 'shared'
  | 'cancelled'
  | 'failed';

type SendBackupOptions = {
  email: string;
  subject: string;
  body: string;
};

export async function sendBackupEmail(options: SendBackupOptions): Promise<SendBackupResult> {
  const store = useWeddingStore.getState();
  const backup = createBackupPayload(store.exportBackupData());
  const content = serializeBackup(backup);
  const fileName = getBackupFileName();
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    store.markBackupCompleted();

    Alert.alert(
      options.subject,
      `${options.body}\n\n${options.email}`
    );

    return 'shared';
  } catch {
    return 'failed';
  } finally {
    URL.revokeObjectURL(url);
  }
}
