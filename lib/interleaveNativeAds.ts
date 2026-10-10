export type NativeAdListRow<T> =
  | { kind: 'item'; item: T }
  | { kind: 'ad'; id: string };

/** Inserts a native-ad row after every `interval` items (e.g. 15 guests → ad after 15th, 30th, …). */
export function interleaveNativeAds<T>(
  items: T[],
  interval: number
): NativeAdListRow<T>[] {
  if (interval <= 0) {
    return items.map((item) => ({ kind: 'item' as const, item }));
  }

  const rows: NativeAdListRow<T>[] = [];
  items.forEach((item, index) => {
    rows.push({ kind: 'item', item });
    if ((index + 1) % interval === 0) {
      rows.push({ kind: 'ad', id: `native-ad-${interval}-${index}` });
    }
  });
  return rows;
}
