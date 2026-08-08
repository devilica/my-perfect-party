import { BottomBannerAdPreview } from '@/components/BottomBannerAdPreview';
import { ADS_ENABLED } from '@/constants/ads';

/** Web has no AdMob — show the Expo layout preview so banners can be reviewed. */
export function BottomBannerAd() {
  if (!ADS_ENABLED) return null;
  return <BottomBannerAdPreview />;
}
