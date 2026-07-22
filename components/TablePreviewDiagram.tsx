import { StyleSheet, Text, View } from 'react-native';

import { TableSeatSlot } from '@/lib/seatingStats';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const DIAGRAM_SIZE = 320;
const TABLE_SIZE = 120;
const SEAT_SIZE = 28;
const ORBIT_RADIUS = 118;
const LABEL_OFFSET = 22;

type TablePreviewDiagramProps = {
  tableName: string;
  occupied: number;
  capacity: number;
  seats: TableSeatSlot[];
};

export function TablePreviewDiagram({
  tableName,
  occupied,
  capacity,
  seats,
}: TablePreviewDiagramProps) {
  const theme = useThemeColors();
  const center = DIAGRAM_SIZE / 2;

  return (
    <View style={[styles.diagram, { width: DIAGRAM_SIZE, height: DIAGRAM_SIZE }]}>
      <View
        style={[
          styles.table,
          {
            width: TABLE_SIZE,
            height: TABLE_SIZE,
            borderRadius: TABLE_SIZE / 2,
            backgroundColor: theme.primaryLight,
            borderColor: theme.primary,
            left: center - TABLE_SIZE / 2,
            top: center - TABLE_SIZE / 2,
          },
        ]}
      >
        <Text style={[styles.tableName, { color: theme.text }]} numberOfLines={2}>
          {tableName}
        </Text>
        <Text style={[styles.tableCount, { color: theme.textSecondary }]}>
          {occupied}/{capacity}
        </Text>
      </View>

      {seats.map((seat, index) => {
        const angle = (2 * Math.PI * index) / Math.max(seats.length, 1) - Math.PI / 2;
        const seatX = center + ORBIT_RADIUS * Math.cos(angle) - SEAT_SIZE / 2;
        const seatY = center + ORBIT_RADIUS * Math.sin(angle) - SEAT_SIZE / 2;
        const labelX = center + (ORBIT_RADIUS + LABEL_OFFSET) * Math.cos(angle);
        const labelY = center + (ORBIT_RADIUS + LABEL_OFFSET) * Math.sin(angle);

        return (
          <View key={index}>
            <View
              style={[
                styles.seat,
                {
                  width: SEAT_SIZE,
                  height: SEAT_SIZE,
                  borderRadius: SEAT_SIZE / 2,
                  left: seatX,
                  top: seatY,
                  backgroundColor: seat.occupied ? theme.seatFull : theme.seatAvailable,
                  borderColor: seat.occupied ? theme.seatFull : theme.seatAvailable,
                },
              ]}
            />
            {seat.guestName ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.text,
                    left: labelX - 40,
                    top: labelY - 8,
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
    borderWidth: 2,
    paddingHorizontal: spacing.sm,
  },
  tableName: {
    ...typography.subheading,
    textAlign: 'center',
    fontWeight: '700',
  },
  tableCount: {
    ...typography.caption,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  seat: {
    position: 'absolute',
    borderWidth: 2,
  },
  label: {
    position: 'absolute',
    width: 80,
    ...typography.small,
    fontWeight: '600',
    textAlign: 'center',
  },
});
