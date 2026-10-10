import type { DocumentPickerAsset } from 'expo-document-picker';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';

export const backupDocumentPickerOptions: DocumentPicker.DocumentPickerOptions = {
  type: ['application/json', 'text/json', 'text/plain'],
  copyToCacheDirectory: true,
};

function normalizeFileUri(uri: string): string {
  if (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    uri.startsWith('blob:') ||
    uri.startsWith('http://') ||
    uri.startsWith('https://')
  ) {
    return uri;
  }
  if (uri.startsWith('/')) {
    return `file://${uri}`;
  }
  return uri;
}

function uriScheme(uri: string): string {
  const match = uri.match(/^([a-z][a-z0-9+.-]*):/i);
  return match?.[1] ?? 'unknown';
}

export async function readPickedDocumentText(asset: DocumentPickerAsset): Promise<string> {
  if (asset.file) {
    const raw = await asset.file.text();
    if (__DEV__) {
      console.warn('[backup-import] read via asset.file');
    }
    return raw;
  }

  const uri = normalizeFileUri(asset.uri);
  const strategies: { label: string; read: () => Promise<string> }[] = [
    { label: 'File.text', read: () => new File(uri).text() },
    {
      label: 'readAsStringAsync',
      read: () => readAsStringAsync(uri, { encoding: EncodingType.UTF8 }),
    },
    {
      label: 'fetch',
      read: async () => {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      },
    },
  ];

  const failures: unknown[] = [];
  for (const { label, read } of strategies) {
    try {
      const raw = await read();
      if (__DEV__) {
        console.warn(`[backup-import] read via ${label} (scheme: ${uriScheme(uri)})`);
      }
      return raw;
    } catch (error) {
      failures.push(error);
    }
  }

  if (__DEV__) {
    console.warn('[backup-import] all read strategies failed', failures);
  }
  throw new Error('READ_FAILED');
}
