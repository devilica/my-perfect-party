import { ImageSourcePropType } from 'react-native';

import { CelebrationThemeId } from '@/types/models';

const COUNTDOWN_WEDDING_BACKGROUND = require('@/assets/images/countdown.png');
const COUNTDOWN_BIRTHDAY_BACKGROUND = require('@/assets/images/countdown3.png');
const COUNTDOWN_DEFAULT_BACKGROUND = require('@/assets/images/countdown2.png');

export function getCountdownBackground(themeId: CelebrationThemeId): ImageSourcePropType {
  if (themeId === 'wedding') return COUNTDOWN_WEDDING_BACKGROUND;
  if (themeId === 'birthday' || themeId === 'baptism') return COUNTDOWN_BIRTHDAY_BACKGROUND;
  return COUNTDOWN_DEFAULT_BACKGROUND;
}
