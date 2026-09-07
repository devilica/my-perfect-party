import { EdgeInsets } from 'react-native-safe-area-context';

export function getEffectiveBottomInset(insets: EdgeInsets): number {
  return insets.bottom;
}
