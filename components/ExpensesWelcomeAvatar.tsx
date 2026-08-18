import { Dimensions } from 'react-native';

import { WelcomeAvatarOverlay } from '@/components/WelcomeAvatarOverlay';
import {
  markExpensesWelcomeShown,
  shouldShowExpensesWelcome,
} from '@/lib/expensesWelcomeSession';

const AVATAR = require('@/assets/images/avatar-exp.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ExpensesWelcomeAvatar() {
  return (
    <WelcomeAvatarOverlay
      image={AVATAR}
      messageKey="expenses.welcomeTip"
      shouldShow={shouldShowExpensesWelcome}
      markShown={markExpensesWelcomeShown}
      heightRatio={0.34}
      bubbleMaxWidth={Math.min(220, SCREEN_WIDTH * 0.55)}
      bubbleAlign="left"
    />
  );
}
