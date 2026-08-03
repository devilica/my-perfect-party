import { SeatingTable } from '@/types/models';

export const SEATING_CANVAS_WIDTH = 2400;
export const SEATING_CANVAS_HEIGHT = 1200;
export const SEATING_CANVAS_SIZE = SEATING_CANVAS_HEIGHT;
export const SEATING_TABLE_DIAGRAM_SIZE = 150;
/** Below this hall zoom, table diagrams shrink in proportion to the canvas. */
export const HALL_TABLE_SIZE_BASE_ZOOM = 0.35;

export function getHallTableDiagramSize(zoom: number): number {
  if (zoom >= HALL_TABLE_SIZE_BASE_ZOOM) {
    return SEATING_TABLE_DIAGRAM_SIZE;
  }
  return Math.round(SEATING_TABLE_DIAGRAM_SIZE * (zoom / HALL_TABLE_SIZE_BASE_ZOOM));
}

export function getDefaultTableLayout(index: number, total: number): { x: number; y: number } {
  if (total <= 0) return { x: 0.5, y: 0.5 };

  const aspect = SEATING_CANVAS_WIDTH / SEATING_CANVAS_HEIGHT;
  const cols = Math.max(1, Math.ceil(Math.sqrt(total * aspect)));
  const rows = Math.ceil(total / cols);
  const row = Math.floor(index / cols);
  const col = index % cols;
  const marginX = 0.1;
  const marginY = 0.1;
  const cellW = (1 - marginX * 2) / cols;
  const cellH = (1 - marginY * 2) / rows;

  return {
    x: marginX + col * cellW + cellW / 2,
    y: marginY + row * cellH + cellH / 2,
  };
}

export function getTableLayoutPosition(
  table: SeatingTable,
  index: number,
  total: number
): { x: number; y: number } {
  if (table.layoutX != null && table.layoutY != null) {
    return {
      x: clampLayout(table.layoutX, 'x'),
      y: clampLayout(table.layoutY, 'y'),
    };
  }

  return getDefaultTableLayout(index, total);
}

export function clampLayout(value: number, axis: 'x' | 'y'): number {
  const canvasSize = axis === 'x' ? SEATING_CANVAS_WIDTH : SEATING_CANVAS_HEIGHT;
  const min = SEATING_TABLE_DIAGRAM_SIZE / 2 / canvasSize;
  const max = 1 - min;
  return Math.min(max, Math.max(min, value));
}

export function layoutToPixels(
  layout: { x: number; y: number },
  canvasWidth: number,
  canvasHeight: number,
  zoom: number
): { left: number; top: number } {
  return {
    left: layout.x * canvasWidth * zoom,
    top: layout.y * canvasHeight * zoom,
  };
}

export function pixelsToLayout(
  left: number,
  top: number,
  canvasWidth: number,
  canvasHeight: number,
  zoom: number
): { x: number; y: number } {
  return {
    x: clampLayout(left / (canvasWidth * zoom), 'x'),
    y: clampLayout(top / (canvasHeight * zoom), 'y'),
  };
}

export function getDefaultHallZoom(tableCount: number): number {
  return tableCount > 20 ? 0.45 : 0.55;
}
