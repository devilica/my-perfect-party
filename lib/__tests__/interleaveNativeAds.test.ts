import { interleaveNativeAds } from '@/lib/interleaveNativeAds';

describe('interleaveNativeAds', () => {
  const items = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

  it('returns only items when interval <= 0', () => {
    const rows = interleaveNativeAds(items(5), 0, 1);
    expect(rows).toHaveLength(5);
    expect(rows.every((r) => r.kind === 'item')).toBe(true);
  });

  it('returns only items when maxAds <= 0', () => {
    const rows = interleaveNativeAds(items(40), 30, 0);
    expect(rows).toHaveLength(40);
    expect(rows.every((r) => r.kind === 'item')).toBe(true);
  });

  it('inserts one ad after 30 items when maxAds is 1', () => {
    const rows = interleaveNativeAds(items(35), 30, 1);
    const ads = rows.filter((r) => r.kind === 'ad');
    expect(ads).toHaveLength(1);
    expect(rows[30]).toEqual({ kind: 'ad', id: 'native-ad-30-29' });
    expect(rows[31]).toEqual({ kind: 'item', item: 31 });
  });

  it('inserts at most two ads when maxAds is 2', () => {
    const rows = interleaveNativeAds(items(40), 15, 2);
    const ads = rows.filter((r) => r.kind === 'ad');
    expect(ads).toHaveLength(2);
  });

  it('keeps item order intact', () => {
    const rows = interleaveNativeAds([10, 20, 30], 1, 3);
    const values = rows.filter((r) => r.kind === 'item').map((r) => r.item);
    expect(values).toEqual([10, 20, 30]);
  });
});
