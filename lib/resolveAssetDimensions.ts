import { getAssetByID } from '@react-native/assets-registry/registry';
import { ImageSourcePropType } from 'react-native';

type AssetDimensions = {
  width: number;
  height: number;
};

function readDimensions(source: unknown): AssetDimensions | null {
  if (source == null || typeof source !== 'object') {
    return null;
  }

  const { width, height } = source as { width?: unknown; height?: unknown };
  if (typeof width === 'number' && typeof height === 'number') {
    return { width, height };
  }

  return null;
}

export function resolveAssetDimensions(source: ImageSourcePropType): AssetDimensions {
  const direct = readDimensions(source);
  if (direct) {
    return direct;
  }

  if (typeof source === 'number') {
    const asset = getAssetByID(source);
    return {
      width: asset?.width ?? 0,
      height: asset?.height ?? 0,
    };
  }

  if (Array.isArray(source)) {
    for (const entry of source) {
      const resolved = resolveAssetDimensions(entry);
      if (resolved.width > 0 && resolved.height > 0) {
        return resolved;
      }
    }
  }

  return { width: 0, height: 0 };
}
