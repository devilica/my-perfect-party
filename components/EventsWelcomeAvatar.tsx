import { WelcomeAvatarOverlay } from '@/components/WelcomeAvatarOverlay';
import {
  markEventsWelcomeShown,
  shouldShowEventsWelcome,
} from '@/lib/eventsWelcomeSession';

const AVATAR = require('@/assets/images/avatar.png');

export function EventsWelcomeAvatar() {
  return (
    <WelcomeAvatarOverlay
      image={AVATAR}
      messageKey="app.welcome"
      shouldShow={shouldShowEventsWelcome}
      markShown={markEventsWelcomeShown}
    />
  );
}
