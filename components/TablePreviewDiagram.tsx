import { StyleSheet, Text, View } from 'react-native';

import {
  getScaledLabelWidth,
  getScaledSeatSize,
  getSeatPositions,
  getTableBodyDimensions,
} from '@/lib/tableShapeLayout';
import { TableSeatSlot } from '@/lib/seatingStats';
import { DEFAULT_TABLE_SHAPE } from '@/constants/tableShapes';
import { useThemeColors } from '@/theme/EventThemeContext';
import { TableShape } from '@/types/models';
import { spacing, typography } from '@/theme/colors';

const BASE_DIAGRAM_SIZE = 320;

type TablePreviewDiagramProps = {
  tableName: string;
  occupied: number;
  capacity: number;
  seats: TableSeatSlot[];
  shape?: TableShape;
  size?: number;
};

export function TablePreviewDiagram({
  tableName,
  occupied,
  capacity,
  seats,
  shape = DEFAULT_TABLE_SHAPE,
  size = BASE_DIAGRAM_SIZE,
}: TablePreviewDiagramProps) {
  const theme = useThemeColors();
  const scale = size / BASE_DIAGRAM_SIZE;
  const tableBody = getTableBodyDimensions(shape, size);
  const seatSize = getScaledSeatSize(size);
  const labelWidth = getScaledLabelWidth(size);
  const seatPositions = getSeatPositions(shape, capacity, size);

  return (
    <View style={[styles.diagram, { width: size, height: size }]}>
      <View
        style={[
          styles.table,
          {
            width: tableBody.width,
            height: tableBody.height,
            borderRadius: tableBody.borderRadius,
            backgroundColor: theme.primaryLight,
            borderColor: theme.primary,
            left: tableBody.left,
            top: tableBody.top,
            borderWidth: Math.max(1, 2 * scale),
            paddingHorizontal: spacing.sm * scale,
          },
        ]}
      >
        <Text
          style={[
            styles.tableName,
            {
              color: theme.text,
              fontSize: Math.max(10, typography.subheading.fontSize * scale),
            },
          ]}
          numberOfLines={2}
        >
          {tableName}
        </Text>
        <Text
          style={[
            styles.tableCount,
            {
              color: theme.textSecondary,
              fontSize: Math.max(8, typography.caption.fontSize * scale),
              marginTop: spacing.xs * scale,
            },
          ]}
        >
          {occupied}/{capacity}
        </Text>
      </View>

      {seats.map((seat, index) => {
        const position = seatPositions[index];
        if (!position) return null;

        return (
          <View key={index}>
            <View
              style={[
                styles.seat,
                {
                  width: seatSize,
                  height: seatSize,
                  borderRadius: seatSize / 2,
                  left: position.seatX,
                  top: position.seatY,
                  backgroundColor: seat.occupied ? theme.seatFull : theme.seatAvailable,
                  borderColor: seat.occupied ? theme.seatFull : theme.seatAvailable,
                  borderWidth: Math.max(1, 2 * scale),
                },
              ]}
            />
            {seat.guestName ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.text,
                    left: position.labelX - labelWidth / 2,
                    top: position.labelY - 8 * scale,
                    width: labelWidth,
                    fontSize: Math.max(7, typography.small.fontSize * scale),
                  },
                ]}
                numberOfLines={1}
              >
                {seat.guestName}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  diagram: {
    position: 'relative',
    alignSelf: 'center',
  },
  table: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableName: {
    textAlign: 'center',
    fontWeight: '700',
  },
  tableCount: {
    textAlign: 'center',
  },
  seat: {
    position: 'absolute',
  },
  label: {
    position: 'absolute',
    fontWeight: '600',
    textAlign: 'center',
  },
});
