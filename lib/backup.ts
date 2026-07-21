import { isLanguage } from '@/constants/languages';
import { CelebrationThemeId, Language } from '@/types/models';

export const BACKUP_APP_ID = 'wedding-planner-bh';
export const BACKUP_VERSION = 1;

export type BackupData = {
  events: unknown[];
  guests: unknown[];
  tables: unknown[];
  expenses: unknown[];
  obligations: unknown[];
  language: Language;
  appTheme?: CelebrationThemeId;
  unlockedAppThemes?: CelebrationThemeId[];
};

export type AppBackup = {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  app: typeof BACKUP_APP_ID;
  data: BackupData;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateBackupEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function getBackupFileName(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `moja-savrsena-proslava-backup-${year}-${month}-${day}.json`;
}

export function createBackupPayload(data: BackupData): AppBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: BACKUP_APP_ID,
    data: {
      events: data.events,
      guests: data.guests,
      tables: data.tables,
      expenses: data.expenses,
      obligations: data.obligations,
      language: data.language,
      ...(data.appTheme ? { appTheme: data.appTheme } : {}),
      ...(data.unlockedAppThemes ? { unlockedAppThemes: data.unlockedAppThemes } : {}),
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function parseBackupFile(raw: string): AppBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('INVALID_JSON');
  }

  if (!isRecord(parsed)) {
    throw new Error('INVALID_BACKUP');
  }

  if (parsed.version !== BACKUP_VERSION) {
    throw new Error('UNSUPPORTED_VERSION');
  }

  if (parsed.app !== BACKUP_APP_ID) {
    throw new Error('INVALID_APP');
  }

  if (typeof parsed.exportedAt !== 'string') {
    throw new Error('INVALID_BACKUP');
  }

  if (!isRecord(parsed.data)) {
    throw new Error('INVALID_BACKUP');
  }

  const { data } = parsed;
  if (
    !Array.isArray(data.events) ||
    !Array.isArray(data.guests) ||
    !Array.isArray(data.tables) ||
    !Array.isArray(data.expenses) ||
    !Array.isArray(data.obligations) ||
    !isLanguage(data.language)
  ) {
    throw new Error('INVALID_BACKUP');
  }

  return parsed as AppBackup;
}

export function serializeBackup(backup: AppBackup): string {
  return JSON.stringify(backup, null, 2);
}
