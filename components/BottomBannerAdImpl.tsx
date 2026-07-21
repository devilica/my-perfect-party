import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';

import { BOTTOM_BANNER_UNIT_ID } from '@/constants/ads';
import { useBannerLayout } from '@/hooks/BannerLayoutContext';
import { colors } from '@/theme/colors';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : BOTTOM_BANNER_UNIT_ID;

export function BottomBannerAdImpl() {
  const { setBannerLoaded, setBannerFailed, resetBanner } = useBannerLayout();
  const bannerRef = useRef<BannerAd>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => resetBanner, [resetBanner]);

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load();
    }
  });

  if (failed) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        ref={bannerRef}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={({ height }) => {
          setBannerLoaded(height);
        }}
        onAdFailedToLoad={(error) => {
          console.warn('Banner ad failed to load:', error);
          setFailed(true);
          setBannerFailed();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
