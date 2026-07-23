import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import type { FlatList, ScrollView } from 'react-native';

import { getScrollOffset, setScrollOffset } from '@/lib/scrollRestoration';

type ScrollableRef = FlatList<unknown> | ScrollView | null;

export function useScrollRestoration(storageKey: string) {
  const scrollRef = useRef<ScrollableRef>(null);

  useFocusEffect(
    useCallback(() => {
      const offset = getScrollOffset(storageKey);
      if (offset <= 0) return;

      let cancelled = false;

      const restore = () => {
        if (cancelled) return;

        const node = scrollRef.current;
        if (!node) return;

        if ('scrollToOffset' in node && typeof node.scrollToOffset === 'function') {
          node.scrollToOffset({ offset, animated: false });
          return;
        }

        if ('scrollTo' in node && typeof node.scrollTo === 'function') {
          node.scrollTo({ y: offset, animated: false });
        }
      };

      const frame = requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });

      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }, [storageKey])
  );

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      setScrollOffset(storageKey, event.nativeEvent.contentOffset.y);
    },
    [storageKey]
  );

  return {
    scrollRef,
    onScroll,
    scrollEventThrottle: 16 as const,
  };
}
