import {
  BACKUP_APP_ID,
  BACKUP_VERSION,
  createBackupPayload,
  getBackupFileName,
  parseBackupFile,
  serializeBackup,
  validateBackupEmail,
  type BackupData,
} from '@/lib/backup';

const minimalData: BackupData = {
  events: [],
  guests: [],
  tables: [],
  expenses: [],
  obligations: [],
  language: 'bs',
};

describe('backup', () => {
  describe('createBackupPayload', () => {
    it('sets version, app id, and data fields', () => {
      const payload = createBackupPayload(minimalData);
      expect(payload.version).toBe(BACKUP_VERSION);
      expect(payload.app).toBe(BACKUP_APP_ID);
      expect(typeof payload.exportedAt).toBe('string');
      expect(payload.data.language).toBe('bs');
      expect(payload.data.events).toEqual([]);
    });
  });

  describe('parseBackupFile', () => {
    it('round-trips a valid backup', () => {
      const payload = createBackupPayload(minimalData);
      const raw = serializeBackup({
        ...payload,
        exportedAt: '2026-01-15T12:00:00.000Z',
      });
      const parsed = parseBackupFile(raw);
      expect(parsed.version).toBe(BACKUP_VERSION);
      expect(parsed.data.language).toBe('bs');
    });

    it('throws INVALID_JSON for malformed JSON', () => {
      expect(() => parseBackupFile('not json')).toThrow('INVALID_JSON');
    });

    it('throws UNSUPPORTED_VERSION for wrong version', () => {
      const raw = JSON.stringify({
        version: 99,
        app: BACKUP_APP_ID,
        exportedAt: '2026-01-01T00:00:00.000Z',
        data: minimalData,
      });
      expect(() => parseBackupFile(raw)).toThrow('UNSUPPORTED_VERSION');
    });

    it('throws INVALID_APP for wrong app id', () => {
      const raw = JSON.stringify({
        version: BACKUP_VERSION,
        app: 'other-app',
        exportedAt: '2026-01-01T00:00:00.000Z',
        data: minimalData,
      });
      expect(() => parseBackupFile(raw)).toThrow('INVALID_APP');
    });

    it('throws INVALID_BACKUP when data arrays are missing', () => {
      const raw = JSON.stringify({
        version: BACKUP_VERSION,
        app: BACKUP_APP_ID,
        exportedAt: '2026-01-01T00:00:00.000Z',
        data: { language: 'bs' },
      });
      expect(() => parseBackupFile(raw)).toThrow('INVALID_BACKUP');
    });
  });

  describe('getBackupFileName', () => {
    it('formats date as YYYY-MM-DD in filename', () => {
      expect(getBackupFileName(new Date(2026, 2, 5))).toBe(
        'moja-savrsena-proslava-backup-2026-03-05.json'
      );
    });
  });

  describe('validateBackupEmail', () => {
    it('accepts a simple valid email', () => {
      expect(validateBackupEmail('user@example.com')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(validateBackupEmail('not-an-email')).toBe(false);
    });

    it('trims whitespace before validation', () => {
      expect(validateBackupEmail('  user@example.com  ')).toBe(true);
    });
  });
});
