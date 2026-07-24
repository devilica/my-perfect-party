import { OverviewNativeAdPreview } from '@/components/OverviewNativeAdPreview';
import { OverviewNativeAdPlacement } from '@/components/OverviewNativeAdPlacement';
import { useIsOnline } from '@/hooks/useIsOnline';
import { areAdsEnabled, shouldShowAdPreviews } from '@/lib/adsEnvironment';

export type { OverviewNativeAdPlacement } from '@/components/OverviewNativeAdPlacement';

type OverviewNativeAdProps = {
  placement?: OverviewNativeAdPlacement;
};

export function OverviewNativeAd({ placement = 'list' }: OverviewNativeAdProps) {
  const isOnline = useIsOnline();

  if (shouldShowAdPreviews()) {
    return <OverviewNativeAdPreview placement={placement} />;
  }

  if (!areAdsEnabled() || !isOnline) {
    return null;
  }

  const { OverviewNativeAdImpl } =
    require('./OverviewNativeAdImpl') as typeof import('./OverviewNativeAdImpl');
  return <OverviewNativeAdImpl placement={placement} />;
}
