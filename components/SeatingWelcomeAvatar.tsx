import { Dimensions, Image } from 'react-native';

import { WelcomeAvatarOverlay } from '@/components/WelcomeAvatarOverlay';
import {
  markSeatingWelcomeShown,
  shouldShowSeatingWelcome,
} from '@/lib/seatingWelcomeSession';

const AVATAR = require('@/assets/images/avatar-seating2.png');
const AVATAR_SOURCE = Image.resolveAssetSource(AVATAR);
const IMAGE_CLIP_WIDTH_RATIO = 550 / AVATAR_SOURCE.width;
const IMAGE_BOTTOM_OFFSET_RATIO = 11 / AVATAR_SOURCE.height;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function SeatingWelcomeAvatar() {
  return (
    <WelcomeAvatarOverlay
      image={AVATAR}
      messageKey="seating.welcomeTip"
      shouldShow={shouldShowSeatingWelcome}
      markShown={markSeatingWelcomeShown}
      heightRatio={0.42}
      imageClipWidthRatio={IMAGE_CLIP_WIDTH_RATIO}
      imageBottomOffsetRatio={IMAGE_BOTTOM_OFFSET_RATIO}
      bubbleMaxWidth={Math.min(220, SCREEN_WIDTH * 0.55)}
      bubbleAlign="left"
    />
  );
}
