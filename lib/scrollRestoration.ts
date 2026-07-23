const offsets = new Map<string, number>();

export function getScrollOffset(key: string): number {
  return offsets.get(key) ?? 0;
}

export function setScrollOffset(key: string, offset: number): void {
  offsets.set(key, Math.max(0, offset));
}

export function makeScrollKey(scope: string, eventId: string): string {
  return `${scope}:${eventId}`;
}
