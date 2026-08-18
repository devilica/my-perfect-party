import { Dimensions } from 'react-native';

import { WelcomeAvatarOverlay } from '@/components/WelcomeAvatarOverlay';
import {
  markGuestsWelcomeShown,
  shouldShowGuestsWelcome,
} from '@/lib/guestsWelcomeSession';

const AVATAR = require('@/assets/images/avatar-guest.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function GuestsWelcomeAvatar() {
  return (
    <WelcomeAvatarOverlay
      image={AVATAR}
      messageKey="guests.welcomeTip"
      shouldShow={shouldShowGuestsWelcome}
      markShown={markGuestsWelcomeShown}
      heightRatio={0.36}
      bubbleMaxWidth={Math.min(220, SCREEN_WIDTH * 0.55)}
      bubbleAlign="left"
    />
  );
}
