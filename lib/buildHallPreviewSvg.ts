import { DEFAULT_TABLE_SHAPE, normalizeTableShape } from '@/constants/tableShapes';
import {
  SEATING_CANVAS_HEIGHT,
  SEATING_CANVAS_WIDTH,
  SEATING_TABLE_DIAGRAM_SIZE,
  getTableLayoutPosition,
} from '@/lib/seatingLayout';
import { getTableOccupiedSeats } from '@/lib/seatingStats';
import {
  getSeatPositions,
  getScaledSeatSize,
  getTableBodyDimensions,
} from '@/lib/tableShapeLayout';
import { Guest, SeatingTable } from '@/types/models';

const TABLE_FILL = '#E8D5C4';
const TABLE_STROKE = '#8A6A4F';
const SEAT_OCCUPIED = '#B85C5C';
const SEAT_FREE = '#9BB59A';
const LABEL_FILL = '#2A2A2A';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncateLabel(value: string, max = 14): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function renderTableGroup(
  table: SeatingTable,
  index: number,
  total: number,
  guests: Guest[]
): string {
  const layout = getTableLayoutPosition(table, index, total);
  const cx = layout.x * SEATING_CANVAS_WIDTH;
  const cy = layout.y * SEATING_CANVAS_HEIGHT;
  const diagramSize = SEATING_TABLE_DIAGRAM_SIZE;
  const shape = normalizeTableShape(table.shape ?? DEFAULT_TABLE_SHAPE);
  const body = getTableBodyDimensions(shape, diagramSize);
  const seatSize = getScaledSeatSize(diagramSize);
  const seats = getSeatPositions(shape, table.capacity, diagramSize, 'compact');
  const occupied = Math.min(getTableOccupiedSeats(guests, table.id), table.capacity);

  // Align diagram local coords so table center sits on layout point
  const offsetX = cx - diagramSize / 2;
  const offsetY = cy - diagramSize / 2;

  const seatCircles = seats
    .map((seat, seatIndex) => {
      const filled = seatIndex < occupied;
      const r = seatSize / 2;
      const x = offsetX + seat.seatX + r;
      const y = offsetY + seat.seatY + r;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${
        filled ? SEAT_OCCUPIED : SEAT_FREE
      }" stroke="#fff" stroke-width="1" />`;
    })
    .join('');

  const bodyX = offsetX + body.left;
  const bodyY = offsetY + body.top;
  const isRound = shape === 'round';
  const tableShape = isRound
    ? `<circle cx="${(bodyX + body.width / 2).toFixed(1)}" cy="${(
        bodyY + body.height / 2
      ).toFixed(1)}" r="${(body.width / 2).toFixed(1)}" fill="${TABLE_FILL}" stroke="${TABLE_STROKE}" stroke-width="2" />`
    : `<rect x="${bodyX.toFixed(1)}" y="${bodyY.toFixed(1)}" width="${body.width.toFixed(
        1
      )}" height="${body.height.toFixed(1)}" rx="${body.borderRadius.toFixed(
        1
      )}" fill="${TABLE_FILL}" stroke="${TABLE_STROKE}" stroke-width="2" />`;

  const label = truncateLabel(table.name);
  const subtitle = `${occupied}/${table.capacity}`;

  return `<g>
    ${seatCircles}
    ${tableShape}
    <text x="${cx.toFixed(1)}" y="${(cy - 4).toFixed(
      1
    )}" text-anchor="middle" font-size="16" font-weight="700" fill="${LABEL_FILL}">${escapeXml(
      label
    )}</text>
    <text x="${cx.toFixed(1)}" y="${(cy + 14).toFixed(
      1
    )}" text-anchor="middle" font-size="13" fill="${LABEL_FILL}">${escapeXml(subtitle)}</text>
  </g>`;
}

/** Print-friendly SVG floor plan using the same layout math as the hall overview. */
export function buildHallPreviewSvgHtml(
  tables: SeatingTable[],
  guests: Guest[],
  title: string,
  occupiedLabel: string,
  freeLabel: string
): string {
  if (tables.length === 0) return '';

  const groups = tables
    .map((table, index) => renderTableGroup(table, index, tables.length, guests))
    .join('\n');

  return `<div class="hall-preview">
  <h3>${escapeXml(title)}</h3>
  <svg viewBox="0 0 ${SEATING_CANVAS_WIDTH} ${SEATING_CANVAS_HEIGHT}" width="100%" style="max-width:100%;height:auto;border:1px solid #ddd;border-radius:8px;background:#faf8f5;">
    <rect x="0" y="0" width="${SEATING_CANVAS_WIDTH}" height="${SEATING_CANVAS_HEIGHT}" fill="#FAF8F5" />
    ${groups}
  </svg>
  <p class="hall-legend">
    <span class="dot occupied"></span> ${escapeXml(occupiedLabel)}
    &nbsp;&nbsp;
    <span class="dot free"></span> ${escapeXml(freeLabel)}
  </p>
</div>`;
}
