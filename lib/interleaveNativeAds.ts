export type NativeAdListRow<T> =
  | { kind: 'item'; item: T }
  | { kind: 'ad'; id: string };

/** Inserts native-ad rows after every `interval` items, at most `maxAds` times. */
export function interleaveNativeAds<T>(
  items: T[],
  interval: number,
  maxAds = 1
): NativeAdListRow<T>[] {
  if (interval <= 0 || maxAds <= 0) {
    return items.map((item) => ({ kind: 'item' as const, item }));
  }

  const rows: NativeAdListRow<T>[] = [];
  let adsInserted = 0;
  items.forEach((item, index) => {
    rows.push({ kind: 'item', item });
    if (adsInserted < maxAds && (index + 1) % interval === 0) {
      rows.push({ kind: 'ad', id: `native-ad-${interval}-${index}` });
      adsInserted += 1;
    }
  });
  return rows;
}
