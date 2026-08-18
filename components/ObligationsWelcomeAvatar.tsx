import { Dimensions } from 'react-native';

import { WelcomeAvatarOverlay } from '@/components/WelcomeAvatarOverlay';
import {
  markObligationsWelcomeShown,
  shouldShowObligationsWelcome,
} from '@/lib/obligationsWelcomeSession';

const AVATAR = require('@/assets/images/avatar-tasks.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ObligationsWelcomeAvatar() {
  return (
    <WelcomeAvatarOverlay
      image={AVATAR}
      messageKey="obligations.welcomeTip"
      shouldShow={shouldShowObligationsWelcome}
      markShown={markObligationsWelcomeShown}
      heightRatio={0.36}
      bubbleMaxWidth={Math.min(220, SCREEN_WIDTH * 0.55)}
      bubbleAlign="left"
    />
  );
}
