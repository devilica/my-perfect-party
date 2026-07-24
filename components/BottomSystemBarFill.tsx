import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getEffectiveBottomInset } from '@/lib/safeAreaInsets';

type BottomSystemBarFillProps = {
  color: string;
};

export function BottomSystemBarFill({ color }: BottomSystemBarFillProps) {
  const insets = useSafeAreaInsets();
  const height = getEffectiveBottomInset(insets);

  if (Platform.OS === 'web' || height <= 0) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.fill, { height, backgroundColor: color }]}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
});
