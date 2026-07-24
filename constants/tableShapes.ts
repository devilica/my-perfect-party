import { TableShape } from '@/types/models';

export const DEFAULT_TABLE_SHAPE: TableShape = 'round';

export const TABLE_SHAPES: TableShape[] = [
  'round',
  'singleSided',
  'rectangular',
  'square',
];

export function normalizeTableShape(value?: unknown): TableShape {
  if (typeof value === 'string' && TABLE_SHAPES.includes(value as TableShape)) {
    return value as TableShape;
  }
  return DEFAULT_TABLE_SHAPE;
}

export function isSquareTableCapacityValid(capacity: number): boolean {
  return Number.isFinite(capacity) && capacity > 0 && capacity % 4 === 0;
}

export function isTableShapeAllowed(shape: TableShape, capacity: number): boolean {
  if (shape === 'square') return isSquareTableCapacityValid(capacity);
  return true;
}
