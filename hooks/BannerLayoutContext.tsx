import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type BannerLayoutContextValue = {
  bannerHeight: number;
  setBannerLoaded: (height: number) => void;
  setBannerFailed: () => void;
  resetBanner: () => void;
};

const BannerLayoutContext = createContext<BannerLayoutContextValue | null>(null);

export function BannerLayoutProvider({ children }: { children: ReactNode }) {
  const [bannerHeight, setBannerHeight] = useState(0);

  const setBannerLoaded = useCallback((height: number) => {
    setBannerHeight(height);
  }, []);

  const setBannerFailed = useCallback(() => {
    setBannerHeight(0);
  }, []);

  const resetBanner = useCallback(() => {
    setBannerHeight(0);
  }, []);

  const value = useMemo(
    () => ({
      bannerHeight,
      setBannerLoaded,
      setBannerFailed,
      resetBanner,
    }),
    [bannerHeight, setBannerLoaded, setBannerFailed, resetBanner]
  );

  return <BannerLayoutContext.Provider value={value}>{children}</BannerLayoutContext.Provider>;
}

export function useBannerLayout(): BannerLayoutContextValue {
  const context = useContext(BannerLayoutContext);
  if (!context) {
    throw new Error('useBannerLayout must be used within BannerLayoutProvider');
  }
  return context;
}

export function useBannerHeight(): number {
  return useBannerLayout().bannerHeight;
}
