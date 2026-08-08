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
  getDefaultHallZoom,
  getHallGuestNameMode,
  getHallTableDiagramSize,
  getTableLayoutPosition,
  HALL_MIN_ZOOM,
  HALL_TABLE_SIZE_BASE_ZOOM,
  pixelsToLayout,
  SEATING_CANVAS_HEIGHT,
  SEATING_CANVAS_WIDTH,
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

const MIN_ZOOM = HALL_MIN_ZOOM;
const MAX_ZOOM = 1.4;
const ZOOM_STEP = 0.05;

type SeatingHallOverviewProps = {
  eventId: string;
};

type DraggableTableProps = {
  table: SeatingTable;
  index: number;
  total: number;
  guests: Guest[];
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
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
  canvasWidth,
  canvasHeight,
  onDragStart,
  onDragEnd,
  onMove,
}: DraggableTableProps) {
  const scaledWidth = canvasWidth * zoom;
  const scaledHeight = canvasHeight * zoom;
  const tableSize = getHallTableDiagramSize(zoom);
  const half = tableSize / 2;

  const computePosition = useCallback(() => {
    const nextLayout = getTableLayoutPosition(table, index, total);
    return {
      left: nextLayout.x * scaledWidth - half,
      top: nextLayout.y * scaledHeight - half,
    };
  }, [half, index, scaledHeight, scaledWidth, table, total, tableSize]);

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
          const maxLeft = scaledWidth - tableSize;
          const maxTop = scaledHeight - tableSize;
          const next = {
            left: Math.min(maxLeft, Math.max(0, dragStartRef.current.left + gesture.dx)),
            top: Math.min(maxTop, Math.max(0, dragStartRef.current.top + gesture.dy)),
          };
          offsetRef.current = next;
          forceRender((value) => value + 1);
        },
        onPanResponderRelease: () => {
          const { left, top } = offsetRef.current;
          const centerLeft = left + half;
          const centerTop = top + half;
          const next = pixelsToLayout(
            centerLeft,
            centerTop,
            canvasWidth,
            canvasHeight,
            zoom
          );
          onMove(table.id, next.x, next.y);
          onDragEnd();
        },
        onPanResponderTerminate: () => {
          onDragEnd();
        },
      }),
    [
      canvasHeight,
      canvasWidth,
      half,
      onDragEnd,
      onDragStart,
      onMove,
      scaledHeight,
      scaledWidth,
      table.id,
      tableSize,
      zoom,
    ]
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
          width: tableSize,
          height: tableSize,
        },
      ]}
    >
      <TablePreviewDiagram
        tableName={table.name}
        occupied={occupied}
        capacity={table.capacity}
        seats={seats}
        shape={table.shape ?? DEFAULT_TABLE_SHAPE}
        size={tableSize}
        roundSeatSpacing="compact"
        compactHallText={zoom < HALL_TABLE_SIZE_BASE_ZOOM}
        guestNameMode={getHallGuestNameMode(zoom)}
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

  const tables = useMemo(
    () => getTablesForEvent(allTables, eventId),
    [allTables, eventId]
  );

  const [zoom, setZoom] = useState(getDefaultHallZoom);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  const eventGuests = useMemo(
    () => allGuests.filter((guest) => guest.eventId === eventId),
    [allGuests, eventId]
  );

  const scaledWidth = SEATING_CANVAS_WIDTH * zoom;
  const scaledHeight = SEATING_CANVAS_HEIGHT * zoom;
  const canvasPad = spacing.lg;
  const scrollContentWidth = scaledWidth + canvasPad * 2;
  const scrollContentHeight = scaledHeight + canvasPad * 2;
  const fitsViewportWidth = scrollContentWidth <= viewport.width;
  const fitsViewportHeight = scrollContentHeight <= viewport.height;

  useEffect(() => {
    if (!viewport.width || !viewport.height) return;

    const frame = requestAnimationFrame(() => {
      const horizontalMax = Math.max(0, Math.max(viewport.width, scrollContentWidth) - viewport.width);
      const verticalMax = Math.max(
        0,
        Math.max(viewport.height, scrollContentHeight) - viewport.height
      );
      horizontalScrollRef.current?.scrollTo({ x: horizontalMax / 2, animated: false });
      verticalScrollRef.current?.scrollTo({ y: verticalMax / 2, animated: false });
    });

    return () => cancelAnimationFrame(frame);
  }, [zoom, viewport.width, viewport.height, scrollContentWidth, scrollContentHeight]);

  const handleMove = useCallback(
    (tableId: string, x: number, y: number) => {
      updateTable(tableId, {
        layoutX: clampLayout(x, 'x'),
        layoutY: clampLayout(y, 'y'),
      });
    },
    [updateTable]
  );

  const zoomIn = () => setZoom((value) => Math.min(MAX_ZOOM, Number((value + ZOOM_STEP).toFixed(2))));
  const zoomOut = () => setZoom((value) => Math.max(MIN_ZOOM, Number((value - ZOOM_STEP).toFixed(2))));
  const resetZoom = () => setZoom(getDefaultHallZoom());
  const canZoomOut = zoom > MIN_ZOOM;
  const canZoomIn = zoom < MAX_ZOOM;

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
          disabled={!canZoomOut}
          style={[
            styles.toolBtn,
            { backgroundColor: theme.background, opacity: canZoomOut ? 1 : 0.4 },
          ]}
          accessibilityLabel={t('seating.hallOverviewZoomOut')}
          accessibilityState={{ disabled: !canZoomOut }}
        >
          <Ionicons
            name="remove-outline"
            size={20}
            color={canZoomOut ? theme.primary : theme.textMuted}
          />
        </Pressable>
        <Pressable onPress={resetZoom} style={styles.zoomLabelWrap}>
          <Text style={[styles.zoomLabel, { color: theme.textSecondary }]}>
            {Math.round(zoom * 100)}%
          </Text>
        </Pressable>
        <Pressable
          onPress={zoomIn}
          disabled={!canZoomIn}
          style={[
            styles.toolBtn,
            { backgroundColor: theme.background, opacity: canZoomIn ? 1 : 0.4 },
          ]}
          accessibilityLabel={t('seating.hallOverviewZoomIn')}
          accessibilityState={{ disabled: !canZoomIn }}
        >
          <Ionicons
            name="add-outline"
            size={20}
            color={canZoomIn ? theme.primary : theme.textMuted}
          />
        </Pressable>
        <Text style={[styles.hint, { color: theme.textMuted }]}>{t('seating.hallOverviewHint')}</Text>
      </View>

      <View style={styles.canvasHost} onLayout={onViewportLayout}>
        <ScrollView
          ref={verticalScrollRef}
          scrollEnabled={scrollEnabled}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            minHeight: viewport.height || undefined,
            justifyContent: fitsViewportHeight ? 'center' : 'flex-start',
          }}
        >
          <ScrollView
            ref={horizontalScrollRef}
            horizontal
            scrollEnabled={scrollEnabled}
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            style={{ height: scrollContentHeight }}
            contentContainerStyle={{
              minWidth: viewport.width || undefined,
              width: Math.max(viewport.width, scrollContentWidth),
              height: scrollContentHeight,
              alignItems: fitsViewportWidth ? 'center' : 'flex-start',
              justifyContent: fitsViewportHeight ? 'center' : 'flex-start',
              padding: canvasPad,
            }}
          >
            <View
              style={[
                styles.canvas,
                {
                  width: scaledWidth,
                  height: scaledHeight,
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
                  canvasWidth={SEATING_CANVAS_WIDTH}
                  canvasHeight={SEATING_CANVAS_HEIGHT}
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
