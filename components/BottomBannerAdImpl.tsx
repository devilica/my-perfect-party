import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';

import { BOTTOM_BANNER_UNIT_ID } from '@/constants/ads';
import { colors } from '@/theme/colors';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : BOTTOM_BANNER_UNIT_ID;
const MAX_LOAD_RETRIES = 3;
const RETRY_DELAY_MS = 30_000;

export function BottomBannerAdImpl() {
  const insets = useSafeAreaInsets();
  const bannerRef = useRef<BannerAd>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hidden, setHidden] = useState(false);

  const clearRetryTimeout = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  };

  useForeground(() => {
    if (hidden) return;
    retryCountRef.current = 0;
    bannerRef.current?.load();
  });

  useEffect(() => {
    return () => {
      clearRetryTimeout();
    };
  }, []);

  const scheduleRetry = () => {
    clearRetryTimeout();
    if (retryCountRef.current >= MAX_LOAD_RETRIES) {
      setHidden(true);
      return;
    }
    retryCountRef.current += 1;
    retryTimeoutRef.current = setTimeout(() => {
      bannerRef.current?.load();
    }, RETRY_DELAY_MS);
  };

  if (hidden) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          retryCountRef.current = 0;
          clearRetryTimeout();
        }}
        onAdFailedToLoad={(error) => {
          if (__DEV__) {
            console.warn('Banner ad failed to load:', error?.code, error);
          }
          scheduleRetry();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
