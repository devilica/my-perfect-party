import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSystemBarFillProps = {
  color: string;
};

export function BottomSystemBarFill({ color }: BottomSystemBarFillProps) {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'web' || insets.bottom > 0) {
    return null;
  }

  return (
    <View
      style={[styles.fill, { height: insets.bottom, backgroundColor: color, pointerEvents: 'none' }]}
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
