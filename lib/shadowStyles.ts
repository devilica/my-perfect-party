import { Platform, ViewStyle } from 'react-native';

type ShadowOffset = {
  width: number;
  height: number;
};

export type ShadowOptions = {
  color: string;
  offset?: ShadowOffset;
  opacity?: number;
  radius?: number;
  elevation?: number;
};

function colorWithOpacity(color: string, opacity: number): string {
  const trimmed = color.trim();
  if (trimmed.startsWith('rgba(')) {
    return trimmed.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
  }
  if (trimmed.startsWith('rgb(')) {
    return trimmed.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }

  const hex = trimmed.replace('#', '');
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return `rgba(37, 27, 25, ${opacity})`;
}

export function createShadowStyle({
  color,
  offset = { width: 0, height: 2 },
  opacity = 0.1,
  radius = 8,
  elevation = 2,
}: ShadowOptions): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${colorWithOpacity(color, opacity)}`,
    } as ViewStyle;
  }

  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}
