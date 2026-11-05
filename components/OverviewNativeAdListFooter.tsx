import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { NativeAdListPlaceholder } from '@/components/NativeAdListPlaceholder';
import { OverviewNativeAd } from '@/components/OverviewNativeAd';

const FOOTER_AD_DELAY_MS = 400;
const IDLE_CALLBACK_TIMEOUT_MS = 2000;

/** Defers native ad load until the list screen is focused and idle (FlatList footer). */
export function OverviewNativeAdListFooter() {
  const [showAd, setShowAd] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setShowAd(false);
      let cancelled = false;
      let delayTimeout: ReturnType<typeof setTimeout> | null = null;
      let idleHandle: number | null = null;

      const mountAd = () => {
        delayTimeout = setTimeout(() => {
          if (!cancelled) {
            setShowAd(true);
          }
        }, FOOTER_AD_DELAY_MS);
      };

      if (typeof requestIdleCallback === 'function') {
        idleHandle = requestIdleCallback(
          () => {
            if (!cancelled) {
              mountAd();
            }
          },
          { timeout: IDLE_CALLBACK_TIMEOUT_MS }
        );
      } else {
        mountAd();
      }

      return () => {
        cancelled = true;
        if (idleHandle != null && typeof cancelIdleCallback === 'function') {
          cancelIdleCallback(idleHandle);
        }
        if (delayTimeout) clearTimeout(delayTimeout);
        setShowAd(false);
      };
    }, [])
  );

  if (showAd) {
    return <OverviewNativeAd placement="list" />;
  }

  return <NativeAdListPlaceholder />;
}
