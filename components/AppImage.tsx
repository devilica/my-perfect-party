import { Image as ExpoImage, ImageContentFit, ImageProps as ExpoImageProps } from 'expo-image';
import resolveAssetSource from 'expo-asset/build/resolveAssetSource';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

type ResizeMode = 'cover' | 'contain' | 'stretch' | 'center';

function mapResizeMode(resizeMode?: ResizeMode): ImageContentFit | undefined {
  if (!resizeMode) return undefined;
  if (resizeMode === 'center') return 'none';
  if (resizeMode === 'stretch') return 'fill';
  return resizeMode;
}

export type AppImageProps = Omit<ExpoImageProps, 'contentFit' | 'source' | 'style'> & {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  contentFit?: ImageContentFit;
};

export function AppImage({ resizeMode, contentFit, transition = 0, ...props }: AppImageProps) {
  return (
    <ExpoImage
      {...props}
      transition={transition}
      contentFit={contentFit ?? mapResizeMode(resizeMode)}
    />
  );
}

export function resolveAssetDimensions(source: ImageSourcePropType): {
  width: number;
  height: number;
} {
  const resolved = resolveAssetSource(source);
  return {
    width: resolved?.width ?? 0,
    height: resolved?.height ?? 0,
  };
}
