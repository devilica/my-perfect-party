import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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

export function BottomBannerAdImpl() {
  const insets = useSafeAreaInsets();
  const bannerRef = useRef<BannerAd>(null);
  const [failed, setFailed] = useState(false);

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load();
    }
  });

  useEffect(() => {
    setFailed(false);
  }, []);

  if (failed) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(error) => {
          console.warn('Banner ad failed to load:', error);
          setFailed(true);
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
