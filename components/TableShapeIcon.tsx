import { StyleSheet, View } from 'react-native';

import {
  getPreviewSeatPositions,
  getScaledSeatSize,
  getTableBodyDimensions,
} from '@/lib/tableShapeLayout';
import { useThemeColors } from '@/theme/EventThemeContext';
import { TableShape } from '@/types/models';

const DEFAULT_ICON_SIZE = 64;

type TableShapeIconProps = {
  shape: TableShape;
  size?: number;
  active?: boolean;
};

export function TableShapeIcon({ shape, size = DEFAULT_ICON_SIZE, active = false }: TableShapeIconProps) {
  const theme = useThemeColors();
  const scale = size / 64;
  const tableBody = getTableBodyDimensions(shape, size);
  const seatSize = Math.max(4, getScaledSeatSize(size) * 0.55);
  const seatPositions = getPreviewSeatPositions(shape, size);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View
        style={[
          styles.table,
          {
            width: tableBody.width,
            height: tableBody.height,
            borderRadius: tableBody.borderRadius,
            backgroundColor: active ? theme.primaryLight : theme.surface,
            borderColor: active ? theme.primary : theme.border,
            left: tableBody.left,
            top: tableBody.top,
            borderWidth: Math.max(1, 1.5 * scale),
          },
        ]}
      />
      {seatPositions.map((position, index) => (
        <View
          key={index}
          style={[
            styles.seat,
            {
              width: seatSize,
              height: seatSize,
              borderRadius: seatSize / 2,
              left: position.seatX,
              top: position.seatY,
              backgroundColor: active ? theme.primary : theme.seatAvailable,
              borderColor: active ? theme.primaryDark : theme.seatAvailable,
              borderWidth: Math.max(1, scale),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  table: {
    position: 'absolute',
  },
  seat: {
    position: 'absolute',
  },
});
