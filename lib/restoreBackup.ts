import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { Alert } from 'react-native';

import { parseBackupFile } from '@/lib/backup';
import { useWeddingStore } from '@/store/weddingStore';

type RestoreBackupMessages = {
  importConfirmTitle: string;
  importConfirmMessage: string;
  importSuccess: string;
  importFailed: string;
  invalidFile: string;
  cancel: string;
  confirm: string;
};

export async function restoreBackup(messages: RestoreBackupMessages): Promise<boolean> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) {
    return false;
  }

  const asset = result.assets[0];

  try {
    const raw = await new File(asset.uri).text();
    const backup = parseBackupFile(raw);

    return await new Promise<boolean>((resolve) => {
      Alert.alert(messages.importConfirmTitle, messages.importConfirmMessage, [
        {
          text: messages.cancel,
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: messages.confirm,
          style: 'destructive',
          onPress: () => {
            try {
              useWeddingStore.getState().importBackupData(backup.data);
              Alert.alert(messages.importSuccess);
              resolve(true);
            } catch {
              Alert.alert(messages.importFailed);
              resolve(false);
            }
          },
        },
      ]);
    });
  } catch (error) {
    const backupErrors = new Set([
      'INVALID_JSON',
      'INVALID_BACKUP',
      'UNSUPPORTED_VERSION',
      'INVALID_APP',
    ]);
    const message =
      error instanceof Error && backupErrors.has(error.message)
        ? messages.invalidFile
        : messages.importFailed;
    Alert.alert(message);
    return false;
  }
}
