import Svg, { Line, Rect } from 'react-native-svg';

type SeatChairIconProps = {
  size: number;
  color: string;
  strokeWidth?: number;
};

export function SeatChairIcon({ size, color, strokeWidth = 1.8 }: SeatChairIconProps) {
  const height = size * 1.35;

  return (
    <Svg width={size} height={height} viewBox="0 0 48 64" fill="none">
      <Rect
        x="13"
        y="3"
        width="22"
        height="7"
        rx="1.2"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Line x1="13" y1="10" x2="13" y2="30" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="35" y1="10" x2="35" y2="30" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="13" y1="18" x2="35" y2="18" stroke={color} strokeWidth={strokeWidth} />
      <Rect
        x="10"
        y="29"
        width="28"
        height="6"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Line x1="14" y1="35" x2="14" y2="60" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="34" y1="35" x2="34" y2="60" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="19" y1="35" x2="18" y2="56" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="29" y1="35" x2="30" y2="56" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
