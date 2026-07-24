import { SeatingTable } from '@/types/models';

export const SEATING_CANVAS_SIZE = 1200;
export const SEATING_TABLE_DIAGRAM_SIZE = 150;

export function getDefaultTableLayout(index: number, total: number): { x: number; y: number } {
  if (total <= 0) return { x: 0.5, y: 0.5 };

  const cols = Math.max(1, Math.ceil(Math.sqrt(total)));
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
      x: clampLayout(table.layoutX),
      y: clampLayout(table.layoutY),
    };
  }

  return getDefaultTableLayout(index, total);
}

export function clampLayout(value: number): number {
  return Math.min(0.92, Math.max(0.08, value));
}

export function layoutToPixels(
  layout: { x: number; y: number },
  canvasSize: number,
  zoom: number
): { left: number; top: number } {
  const scaled = canvasSize * zoom;
  return {
    left: layout.x * scaled,
    top: layout.y * scaled,
  };
}

export function pixelsToLayout(
  left: number,
  top: number,
  canvasSize: number,
  zoom: number
): { x: number; y: number } {
  const scaled = canvasSize * zoom;
  return {
    x: clampLayout(left / scaled),
    y: clampLayout(top / scaled),
  };
}
