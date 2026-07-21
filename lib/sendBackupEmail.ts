import { File, Paths } from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import * as Sharing from 'expo-sharing';

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
  const file = new File(Paths.cache, fileName);

  file.create({ overwrite: true, intermediates: true });
  file.write(content);

  const isMailAvailable = await MailComposer.isAvailableAsync();
  if (isMailAvailable) {
    const result = await MailComposer.composeAsync({
      recipients: [options.email],
      subject: options.subject,
      body: options.body,
      attachments: [file.uri],
    });

    if (result.status === MailComposer.MailComposerStatus.SENT) {
      store.markBackupCompleted();
      return 'sent';
    }

    if (result.status === MailComposer.MailComposerStatus.SAVED) {
      store.markBackupCompleted();
      return 'saved';
    }

    if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
      return 'cancelled';
    }

    return 'failed';
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    return 'failed';
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/json',
    dialogTitle: options.subject,
    UTI: 'public.json',
  });

  store.markBackupCompleted();
  return 'shared';
}
