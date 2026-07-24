import { useEffect, useState } from 'react';

import { RewardedAdPreviewModal } from '@/components/RewardedAdPreviewModal';
import { subscribeRewardedAdPreview } from '@/lib/rewardedAdPreviewController';

export function RewardedAdPreviewHost() {
  const [visible, setVisible] = useState(false);

  useEffect(() => subscribeRewardedAdPreview(setVisible), []);

  return <RewardedAdPreviewModal visible={visible} />;
}
