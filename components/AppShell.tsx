import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomBannerAd } from '@/components/BottomBannerAd';
import { useIsOnline } from '@/hooks/useIsOnline';
import { isNativeAdsSupported } from '@/lib/adsEnvironment';

type AppShellProps = {
  children: ReactNode;
  showBanner?: boolean;
};

export function AppShell({ children, showBanner = true }: AppShellProps) {
  const isOnline = useIsOnline();
  const bannerVisible = showBanner && isOnline && isNativeAdsSupported();

  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
      {bannerVisible ? <BottomBannerAd /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
