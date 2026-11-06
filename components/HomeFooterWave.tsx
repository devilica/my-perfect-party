import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppImage, resolveAssetDimensions } from '@/components/AppImage';

const FOOTER_WAVE = require('@/assets/images/home-footer-wave.png');

export function useHomeFooterWaveHeight(): number {
  const { width: screenWidth } = useWindowDimensions();
  return useMemo(() => {
    const { width, height: assetHeight } = resolveAssetDimensions(FOOTER_WAVE);
    const ratio = width > 0 && assetHeight > 0 ? assetHeight / width : 341 / 1024;
    return screenWidth * ratio;
  }, [screenWidth]);
}

export function HomeFooterWave() {
  const { width: screenWidth } = useWindowDimensions();
  const height = useHomeFooterWaveHeight();

  return (
    <View
      style={[styles.wrap, { width: screenWidth, height }]}
      pointerEvents="none"
    >
      <AppImage
        source={FOOTER_WAVE}
        style={{ width: screenWidth, height }}
        contentFit="fill"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});
