import { OverviewNativeAdPreview } from '@/components/OverviewNativeAdPreview';
import { OverviewNativeAdPlacement } from '@/components/OverviewNativeAdPlacement';
import { ADS_ENABLED } from '@/constants/ads';

type OverviewNativeAdProps = {
  placement?: OverviewNativeAdPlacement;
};

/** Web has no AdMob — show the layout preview so native ads can be reviewed. */
export function OverviewNativeAd({ placement = 'list' }: OverviewNativeAdProps) {
  if (!ADS_ENABLED) return null;
  return <OverviewNativeAdPreview placement={placement} />;
}
