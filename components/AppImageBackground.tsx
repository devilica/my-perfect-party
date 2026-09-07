import { ReactNode } from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { AppImage } from '@/components/AppImage';

type AppImageBackgroundProps = {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  children?: ReactNode;
};

export function AppImageBackground({
  source,
  style,
  imageStyle,
  resizeMode = 'cover',
  children,
}: AppImageBackgroundProps) {
  return (
    <View style={style}>
      <AppImage
        source={source}
        style={[StyleSheet.absoluteFill, imageStyle]}
        resizeMode={resizeMode}
      />
      {children}
    </View>
  );
}
