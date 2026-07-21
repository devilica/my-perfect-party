import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomBannerAd } from '@/components/BottomBannerAd';
import { BannerLayoutProvider } from '@/hooks/BannerLayoutContext';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled } from '@/lib/adsEnvironment';

type AppShellProps = {
  children: ReactNode;
  showBanner?: boolean;
};

export function AppShell({ children, showBanner = true }: AppShellProps) {
  const isOnline = useIsOnline();
  const bannerVisible = showBanner && isOnline && areAdsEnabled();

  return (
    <BannerLayoutProvider>
      <View style={styles.root}>
        {children}
        {bannerVisible ? (
          <View style={styles.bannerOverlay} pointerEvents="box-none">
            <BottomBannerAd />
          </View>
        ) : null}
      </View>
    </BannerLayoutProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
