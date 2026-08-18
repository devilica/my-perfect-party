import { Dimensions } from 'react-native';

import { WelcomeAvatarOverlay } from '@/components/WelcomeAvatarOverlay';
import {
  markOverviewWelcomeShown,
  shouldShowOverviewWelcome,
} from '@/lib/overviewWelcomeSession';

const AVATAR = require('@/assets/images/avatar-view.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function OverviewWelcomeAvatar() {
  return (
    <WelcomeAvatarOverlay
      image={AVATAR}
      messageKey="overview.welcomeTip"
      shouldShow={shouldShowOverviewWelcome}
      markShown={markOverviewWelcomeShown}
      heightRatio={0.36}
      anchor="right"
      bubbleMaxWidth={Math.min(220, SCREEN_WIDTH * 0.55)}
      bubbleAlign="right"
    />
  );
}
