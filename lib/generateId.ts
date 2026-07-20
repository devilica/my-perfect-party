function fallbackUuidV4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function generateId(): string {
  const nativeUuidv4 = (globalThis as { expo?: { uuidv4?: () => string } }).expo?.uuidv4;
  if (nativeUuidv4) {
    try {
      return nativeUuidv4();
    } catch {
      // Fall through to other strategies.
    }
  }

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fall through to Math.random fallback.
    }
  }

  return fallbackUuidV4();
}
