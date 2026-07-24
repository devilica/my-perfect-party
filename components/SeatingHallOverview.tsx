import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TablePreviewDiagram } from '@/components/TablePreviewDiagram';
import { DEFAULT_TABLE_SHAPE } from '@/constants/tableShapes';
import {
  clampLayout,
  getTableLayoutPosition,
  pixelsToLayout,
  SEATING_CANVAS_SIZE,
  SEATING_TABLE_DIAGRAM_SIZE,
} from '@/lib/seatingLayout';
import {
  buildTableSeatSlots,
  getTableOccupiedSeats,
  getTablesForEvent,
} from '@/lib/seatingStats';
import { useTranslation } from '@/lib/i18n';
import { useWeddingStore } from '@/store/weddingStore';
import { Guest, SeatingTable } from '@/types/models';
import { useThemeColors } from '@/theme/EventThemeContext';
import { radius, spacing, typography } from '@/theme/colors';

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 1.4;
const ZOOM_STEP = 0.1;

type SeatingHallOverviewProps = {
  eventId: string;
};

type DraggableTableProps = {
  table: SeatingTable;
  index: number;
  total: number;
  guests: Guest[];
  zoom: number;
  canvasSize: number;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMove: (tableId: string, x: number, y: number) => void;
};

function DraggableTable({
  table,
  index,
  total,
  guests,
  zoom,
  canvasSize,
  onDragStart,
  onDragEnd,
  onMove,
}: DraggableTableProps) {
  const scaledCanvas = canvasSize * zoom;
  const half = SEATING_TABLE_DIAGRAM_SIZE / 2;

  const computePosition = useCallback(() => {
    const nextLayout = getTableLayoutPosition(table, index, total);
    return {
      left: nextLayout.x * scaledCanvas - half,
      top: nextLayout.y * scaledCanvas - half,
    };
  }, [half, index, scaledCanvas, table, total]);

  const offsetRef = useRef(computePosition());
  const dragStartRef = useRef(computePosition());
  const [, forceRender] = useState(0);

  const occupied = getTableOccupiedSeats(guests, table.id);
  const seats = buildTableSeatSlots(table, guests);

  useEffect(() => {
    offsetRef.current = computePosition();
    forceRender((value) => value + 1);
  }, [computePosition]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          onDragStart();
          dragStartRef.current = { ...offsetRef.current };
        },
        onPanResponderMove: (_, gesture) => {
          const max = scaledCanvas - SEATING_TABLE_DIAGRAM_SIZE;
          const next = {
            left: Math.min(max, Math.max(0, dragStartRef.current.left + gesture.dx)),
            top: Math.min(max, Math.max(0, dragStartRef.current.top + gesture.dy)),
          };
          offsetRef.current = next;
          forceRender((value) => value + 1);
        },
        onPanResponderRelease: () => {
          const { left, top } = offsetRef.current;
          const centerLeft = left + half;
          const centerTop = top + half;
          const next = pixelsToLayout(centerLeft, centerTop, canvasSize, zoom);
          onMove(table.id, next.x, next.y);
          onDragEnd();
        },
        onPanResponderTerminate: () => {
          onDragEnd();
        },
      }),
    [canvasSize, half, onDragEnd, onDragStart, onMove, scaledCanvas, table.id, zoom]
  );

  const offset = offsetRef.current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.tableNode,
        {
          left: offset.left,
          top: offset.top,
          width: SEATING_TABLE_DIAGRAM_SIZE,
          height: SEATING_TABLE_DIAGRAM_SIZE,
        },
      ]}
    >
      <TablePreviewDiagram
        tableName={table.name}
        occupied={occupied}
        capacity={table.capacity}
        seats={seats}
        shape={table.shape ?? DEFAULT_TABLE_SHAPE}
        size={SEATING_TABLE_DIAGRAM_SIZE}
      />
    </View>
  );
}

export function SeatingHallOverview({ eventId }: SeatingHallOverviewProps) {
  const language = useWeddingStore((s) => s.language);
  const allTables = useWeddingStore((s) => s.tables);
  const allGuests = useWeddingStore((s) => s.guests);
  const updateTable = useWeddingStore((s) => s.updateTable);
  const { t } = useTranslation(language);
  const theme = useThemeColors();

  const [zoom, setZoom] = useState(0.55);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const tables = useMemo(
    () => getTablesForEvent(allTables, eventId),
    [allTables, eventId]
  );

  const eventGuests = useMemo(
    () => allGuests.filter((guest) => guest.eventId === eventId),
    [allGuests, eventId]
  );

  const scaledSize = SEATING_CANVAS_SIZE * zoom;
  const contentWidth = Math.max(viewport.width, scaledSize + spacing.lg * 2);
  const contentHeight = Math.max(viewport.height, scaledSize + spacing.lg * 2);

  const handleMove = useCallback(
    (tableId: string, x: number, y: number) => {
      updateTable(tableId, {
        layoutX: clampLayout(x),
        layoutY: clampLayout(y),
      });
    },
    [updateTable]
  );

  const zoomIn = () => setZoom((value) => Math.min(MAX_ZOOM, Number((value + ZOOM_STEP).toFixed(2))));
  const zoomOut = () => setZoom((value) => Math.max(MIN_ZOOM, Number((value - ZOOM_STEP).toFixed(2))));
  const resetZoom = () => setZoom(0.55);

  const onViewportLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setViewport({ width, height });
  };

  if (tables.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          {t('seating.hallOverviewEmpty')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.toolbar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable
          onPress={zoomOut}
          style={[styles.toolBtn, { backgroundColor: theme.background }]}
          accessibilityLabel={t('seating.hallOverviewZoomOut')}
        >
          <Ionicons name="remove-outline" size={20} color={theme.primary} />
        </Pressable>
        <Pressable onPress={resetZoom} style={styles.zoomLabelWrap}>
          <Text style={[styles.zoomLabel, { color: theme.textSecondary }]}>
            {Math.round(zoom * 100)}%
          </Text>
        </Pressable>
        <Pressable
          onPress={zoomIn}
          style={[styles.toolBtn, { backgroundColor: theme.background }]}
          accessibilityLabel={t('seating.hallOverviewZoomIn')}
        >
          <Ionicons name="add-outline" size={20} color={theme.primary} />
        </Pressable>
        <Text style={[styles.hint, { color: theme.textMuted }]}>{t('seating.hallOverviewHint')}</Text>
      </View>

      <View style={styles.canvasHost} onLayout={onViewportLayout}>
        <ScrollView
          horizontal
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: contentWidth,
            height: contentHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ScrollView
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              width: contentWidth,
              height: contentHeight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={[
                styles.canvas,
                {
                  width: scaledSize,
                  height: scaledSize,
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              {tables.map((table, index) => (
                <DraggableTable
                  key={table.id}
                  table={table}
                  index={index}
                  total={tables.length}
                  guests={eventGuests}
                  zoom={zoom}
                  canvasSize={SEATING_CANVAS_SIZE}
                  onDragStart={() => setScrollEnabled(false)}
                  onDragEnd={() => setScrollEnabled(true)}
                  onMove={handleMove}
                />
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      <View
        style={[
          styles.legend,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
          },
        ]}
      >
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.seatFull }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            {t('seating.previewOccupied')}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.seatAvailable }]} />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            {t('seating.previewFree')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toolBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomLabelWrap: {
    minWidth: 52,
    alignItems: 'center',
  },
  zoomLabel: {
    ...typography.caption,
    fontWeight: '700',
  },
  hint: {
    ...typography.small,
    flex: 1,
    marginLeft: spacing.xs,
  },
  canvasHost: {
    flex: 1,
  },
  canvas: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: radius.md,
  },
  tableNode: {
    position: 'absolute',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
  legendText: {
    ...typography.small,
    fontWeight: '600',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
});
