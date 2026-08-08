import { StyleSheet, Text, View } from 'react-native';

import {
  getScaledLabelWidth,
  getScaledSeatSize,
  getSeatPositions,
  getTableBodyDimensions,
  RoundSeatSpacing,
} from '@/lib/tableShapeLayout';
import { TableSeatSlot } from '@/lib/seatingStats';
import { DEFAULT_TABLE_SHAPE } from '@/constants/tableShapes';
import { useThemeColors } from '@/theme/EventThemeContext';
import { formatGuestSeatLabel, GuestSeatNameMode, TableShape } from '@/types/models';
import { spacing, typography } from '@/theme/colors';

const BASE_DIAGRAM_SIZE = 320;
/** Above this seat count, full names are too crowded — use first name + last initial. */
const ABBREVIATE_NAMES_ABOVE_CAPACITY = 16;

type TablePreviewDiagramProps = {
  tableName: string;
  occupied: number;
  capacity: number;
  seats: TableSeatSlot[];
  shape?: TableShape;
  size?: number;
  roundSeatSpacing?: RoundSeatSpacing;
  /** Hall overview at low zoom: allow proportionally tiny table labels. */
  compactHallText?: boolean;
  /** How guest names render around seats. */
  guestNameMode?: GuestSeatNameMode;
  /** Highlight seats belonging to this guest (table preview reorder). */
  selectedGuestId?: string | null;
};

export function TablePreviewDiagram({
  tableName,
  occupied,
  capacity,
  seats,
  shape = DEFAULT_TABLE_SHAPE,
  size = BASE_DIAGRAM_SIZE,
  roundSeatSpacing = 'default',
  compactHallText = false,
  guestNameMode = 'full',
  selectedGuestId = null,
}: TablePreviewDiagramProps) {
  const theme = useThemeColors();
  const scale = size / BASE_DIAGRAM_SIZE;
  const tableBody = getTableBodyDimensions(shape, size);
  const seatSize = getScaledSeatSize(size);
  const labelWidth = getScaledLabelWidth(size);
  const effectiveGuestNameMode =
    guestNameMode === 'full' && capacity > ABBREVIATE_NAMES_ABOVE_CAPACITY
      ? 'abbreviated'
      : guestNameMode;
  // Abbreviated needs room for "FirstName L." — the old 80px cap caused "…" instead of the initial.
  const guestLabelWidth =
    effectiveGuestNameMode === 'full'
      ? labelWidth * 1.6
      : effectiveGuestNameMode === 'abbreviated'
        ? labelWidth * 1.4
        : labelWidth;
  const seatPositions = getSeatPositions(shape, capacity, size, roundSeatSpacing);
  const tableNameFontSize = compactHallText
    ? Math.max(4, typography.subheading.fontSize * scale)
    : Math.max(10, typography.subheading.fontSize * scale);
  const tableCountFontSize = compactHallText
    ? Math.max(3, typography.caption.fontSize * scale)
    : Math.max(8, typography.caption.fontSize * scale);
  const guestLabelFontSize = Math.max(8, typography.small.fontSize * scale);

  return (
    <View style={[styles.diagram, { width: size, height: size, overflow: 'visible' }]}>
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
              fontSize: tableNameFontSize,
            },
          ]}
          numberOfLines={compactHallText ? 1 : 2}
        >
          {tableName}
        </Text>
        <Text
          style={[
            styles.tableCount,
            {
              color: theme.textSecondary,
              fontSize: tableCountFontSize,
              marginTop: (compactHallText ? spacing.xs * 0.25 : spacing.xs) * scale,
            },
          ]}
        >
          {occupied}/{capacity}
        </Text>
      </View>

      {seats.map((seat, index) => {
        const position = seatPositions[index];
        if (!position) return null;

        const seatCx = position.seatX + seatSize / 2;
        const seatCy = position.seatY + seatSize / 2;
        const outwardDx = position.labelX - seatCx;
        const outwardDy = position.labelY - seatCy;
        const outwardLen = Math.hypot(outwardDx, outwardDy) || 1;
        const displayName = seat.guestName
          ? formatGuestSeatLabel(seat.guestName, effectiveGuestNameMode)
          : '';
        // Size to content so empty max-width padding doesn't push names away from seats.
        // Label anchor is already seat-edge + 2px; half-extent keeps the near glyph edge there.
        // Generous char width so abbreviated "Name L." is never clipped to "…".
        const contentWidth =
          Math.max(guestLabelFontSize * 1.2, displayName.length * guestLabelFontSize * 0.65) +
          guestLabelFontSize * 0.4;
        const estimatedWidth =
          effectiveGuestNameMode === 'abbreviated'
            ? contentWidth
            : Math.min(guestLabelWidth, contentWidth);
        const textHalfExtent = estimatedWidth / 2;
        const labelLeft =
          position.labelX + (textHalfExtent * outwardDx) / outwardLen;
        const labelTop =
          position.labelY + (textHalfExtent * outwardDy) / outwardLen;

        const isSelected = !!selectedGuestId && seat.guestId === selectedGuestId;
        const seatFill = isSelected
          ? theme.primaryDark
          : seat.occupied
            ? theme.seatFull
            : theme.seatAvailable;
        const seatBorder = isSelected ? theme.primary : seatFill;

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
                  backgroundColor: seatFill,
                  borderColor: seatBorder,
                  borderWidth: Math.max(1, (isSelected ? 3 : 2) * scale),
                },
              ]}
            />
            {seat.guestName && effectiveGuestNameMode !== 'hidden' ? (
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected ? theme.primaryDark : theme.text,
                    left: labelLeft,
                    top: labelTop,
                    width: estimatedWidth,
                    fontSize: guestLabelFontSize,
                    fontWeight: isSelected ? '700' : '600',
                    transform: [
                      { translateX: -estimatedWidth / 2 },
                      { translateY: -guestLabelFontSize * 0.55 },
                      { rotate: `${position.labelRotation}deg` },
                    ],
                  },
                ]}
              >
                {displayName}
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
    overflow: 'visible',
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
