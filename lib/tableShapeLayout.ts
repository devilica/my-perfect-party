import { TableShape } from '@/types/models';

const BASE_TABLE_SIZE = 120;
const BASE_SEAT_SIZE = 28;
/** Gap from seat edge to guest name anchor (at 320px diagram). */
const BASE_LABEL_GAP = 2;

export type RoundSeatSpacing = 'default' | 'compact';

const ROUND_SEAT_SPACING = {
  /** Table preview — seats hug the table edge. */
  default: { orbitRadius: 80 },
  /** Hall overview — slightly tighter at small scale. */
  compact: { orbitRadius: 76 },
} as const;

export type TableBodyDimensions = {
  width: number;
  height: number;
  borderRadius: number;
  left: number;
  top: number;
};

export type SeatPosition = {
  seatX: number;
  seatY: number;
  labelX: number;
  labelY: number;
  /** Degrees clockwise; text extends outward from the table through the seat. */
  labelRotation: number;
};

function readableRadialRotation(angleRad: number): number {
  let rotation = (angleRad * 180) / Math.PI;
  if (rotation > 90 || rotation < -90) {
    rotation += 180;
  }
  return rotation;
}

function getLabelAnchorFromSeat(
  seatX: number,
  seatY: number,
  seatSize: number,
  outwardDeg: number,
  scale: number
): { labelX: number; labelY: number } {
  const seatCx = seatX + seatSize / 2;
  const seatCy = seatY + seatSize / 2;
  const gap = seatSize / 2 + BASE_LABEL_GAP * scale;
  const rad = (outwardDeg * Math.PI) / 180;
  return {
    labelX: seatCx + gap * Math.cos(rad),
    labelY: seatCy + gap * Math.sin(rad),
  };
}

export function getTableBodyDimensions(
  shape: TableShape,
  diagramSize: number
): TableBodyDimensions {
  const scale = diagramSize / 320;
  const center = diagramSize / 2;

  switch (shape) {
    case 'singleSided': {
      const width = BASE_TABLE_SIZE * 1.7 * scale;
      const height = BASE_TABLE_SIZE * 0.45 * scale;
      return {
        width,
        height,
        borderRadius: 8 * scale,
        left: center - width / 2,
        top: center - height / 2 - 12 * scale,
      };
    }
    case 'rectangular': {
      const width = BASE_TABLE_SIZE * 1.85 * scale;
      const height = BASE_TABLE_SIZE * 0.42 * scale;
      return {
        width,
        height,
        borderRadius: 8 * scale,
        left: center - width / 2,
        top: center - height / 2,
      };
    }
    case 'square': {
      const size = BASE_TABLE_SIZE * 0.95 * scale;
      return {
        width: size,
        height: size,
        borderRadius: 10 * scale,
        left: center - size / 2,
        top: center - size / 2,
      };
    }
    case 'round':
    default: {
      const size = BASE_TABLE_SIZE * scale;
      return {
        width: size,
        height: size,
        borderRadius: size / 2,
        left: center - size / 2,
        top: center - size / 2,
      };
    }
  }
}

function distributeAcrossSides(total: number, sides: number): number[] {
  const base = Math.floor(total / sides);
  const remainder = total % sides;
  return Array.from({ length: sides }, (_, index) => base + (index < remainder ? 1 : 0));
}

function getRoundSeatPositions(
  capacity: number,
  diagramSize: number,
  seatSize: number,
  spacing: RoundSeatSpacing = 'default'
): SeatPosition[] {
  const center = diagramSize / 2;
  const scale = diagramSize / 320;
  const { orbitRadius: baseOrbitRadius } = ROUND_SEAT_SPACING[spacing];
  const orbitRadius = baseOrbitRadius * scale;

  return Array.from({ length: capacity }, (_, index) => {
    const angle = (2 * Math.PI * index) / Math.max(capacity, 1) - Math.PI / 2;
    const seatX = center + orbitRadius * Math.cos(angle) - seatSize / 2;
    const seatY = center + orbitRadius * Math.sin(angle) - seatSize / 2;
    const outwardDeg = (angle * 180) / Math.PI;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      outwardDeg,
      scale
    );

    return {
      seatX,
      seatY,
      labelX,
      labelY,
      labelRotation: readableRadialRotation(angle),
    };
  });
}

function getSingleSidedSeatPositions(
  capacity: number,
  diagramSize: number,
  seatSize: number
): SeatPosition[] {
  const body = getTableBodyDimensions('singleSided', diagramSize);
  const scale = diagramSize / 320;
  const gap = 6 * scale;
  const rowY = body.top + body.height + gap;
  const usableWidth = body.width + 40 * scale;
  const startX = body.left + body.width / 2 - usableWidth / 2;

  return Array.from({ length: capacity }, (_, index) => {
    const seatX =
      capacity === 1
        ? body.left + body.width / 2 - seatSize / 2
        : startX + (usableWidth * index) / Math.max(capacity - 1, 1) - seatSize / 2;
    const seatY = rowY;
    const labelRotation = 90;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );

    return {
      seatX,
      seatY,
      labelX,
      labelY,
      labelRotation,
    };
  });
}

function getRectangularSeatPositions(
  capacity: number,
  diagramSize: number,
  seatSize: number
): SeatPosition[] {
  const body = getTableBodyDimensions('rectangular', diagramSize);
  const scale = diagramSize / 320;
  const gap = 10 * scale;
  const topCount = Math.ceil(capacity / 2);
  const bottomCount = capacity - topCount;

  const positions: SeatPosition[] = [];

  const placeRow = (count: number, y: number, startIndex: number) => {
    const usableWidth = body.width + 24 * scale;
    const rowStartX = body.left + body.width / 2 - usableWidth / 2;

    for (let i = 0; i < count; i += 1) {
      const seatX =
        count === 1
          ? body.left + body.width / 2 - seatSize / 2
          : rowStartX + (usableWidth * i) / Math.max(count - 1, 1) - seatSize / 2;
      const seatY = y;
      const labelRotation = y < body.top ? -90 : 90;
      const { labelX, labelY } = getLabelAnchorFromSeat(
        seatX,
        seatY,
        seatSize,
        labelRotation,
        scale
      );
      positions[startIndex + i] = {
        seatX,
        seatY,
        labelX,
        labelY,
        labelRotation,
      };
    }
  };

  placeRow(topCount, body.top - gap - seatSize, 0);
  placeRow(bottomCount, body.top + body.height + gap, topCount);

  return positions;
}

function getSquareSeatPositions(
  capacity: number,
  diagramSize: number,
  seatSize: number
): SeatPosition[] {
  if (capacity % 4 !== 0) {
    return getSquareSeatPositionsLegacy(capacity, diagramSize, seatSize);
  }

  const body = getTableBodyDimensions('square', diagramSize);
  const scale = diagramSize / 320;
  const gap = 8 * scale;
  const perSide = capacity / 4;
  const positions: SeatPosition[] = [];
  let index = 0;

  const placeSide = (
    count: number,
    getPosition: (sideIndex: number, sideCount: number) => SeatPosition
  ) => {
    for (let i = 0; i < count; i += 1) {
      positions[index] = getPosition(i, count);
      index += 1;
    }
  };

  const seatAlongHorizontalEdge = (i: number, count: number) => {
    if (count === 1) return body.left + body.width / 2 - seatSize / 2;
    return body.left + ((body.width - seatSize) * i) / (count - 1);
  };

  const seatAlongVerticalEdge = (i: number, count: number) => {
    if (count === 1) return body.top + body.height / 2 - seatSize / 2;
    return body.top + ((body.height - seatSize) * i) / (count - 1);
  };

  // Top
  placeSide(perSide, (i, count) => {
    const seatX = seatAlongHorizontalEdge(i, count);
    const seatY = body.top - gap - seatSize;
    const labelRotation = -90;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  // Right
  placeSide(perSide, (i, count) => {
    const seatX = body.left + body.width + gap;
    const seatY = seatAlongVerticalEdge(i, count);
    const labelRotation = 0;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  // Bottom
  placeSide(perSide, (i, count) => {
    const seatX = seatAlongHorizontalEdge(i, count);
    const seatY = body.top + body.height + gap;
    const labelRotation = 90;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  // Left
  placeSide(perSide, (i, count) => {
    const seatX = body.left - gap - seatSize;
    const seatY = seatAlongVerticalEdge(i, count);
    const labelRotation = 180;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  return positions;
}

function getSquareSeatPositionsLegacy(
  capacity: number,
  diagramSize: number,
  seatSize: number
): SeatPosition[] {
  const body = getTableBodyDimensions('square', diagramSize);
  const scale = diagramSize / 320;
  const gap = 8 * scale;
  const counts = distributeAcrossSides(capacity, 4);
  const positions: SeatPosition[] = [];
  let index = 0;

  const placeSide = (
    count: number,
    getPosition: (sideIndex: number, sideCount: number) => SeatPosition
  ) => {
    for (let i = 0; i < count; i += 1) {
      positions[index] = getPosition(i, count);
      index += 1;
    }
  };

  placeSide(counts[0], (i, count) => {
    const seatX =
      count === 1
        ? body.left + body.width / 2 - seatSize / 2
        : body.left + ((body.width - seatSize) * i) / Math.max(count - 1, 1);
    const seatY = body.top - gap - seatSize;
    const labelRotation = -90;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  placeSide(counts[1], (i, count) => {
    const seatX = body.left + body.width + gap;
    const seatY =
      count === 1
        ? body.top + body.height / 2 - seatSize / 2
        : body.top + ((body.height - seatSize) * i) / Math.max(count - 1, 1);
    const labelRotation = 0;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  placeSide(counts[2], (i, count) => {
    const seatX =
      count === 1
        ? body.left + body.width / 2 - seatSize / 2
        : body.left + ((body.width - seatSize) * i) / Math.max(count - 1, 1);
    const seatY = body.top + body.height + gap;
    const labelRotation = 90;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  placeSide(counts[3], (i, count) => {
    const seatX = body.left - gap - seatSize;
    const seatY =
      count === 1
        ? body.top + body.height / 2 - seatSize / 2
        : body.top + ((body.height - seatSize) * i) / Math.max(count - 1, 1);
    const labelRotation = 180;
    const { labelX, labelY } = getLabelAnchorFromSeat(
      seatX,
      seatY,
      seatSize,
      labelRotation,
      scale
    );
    return { seatX, seatY, labelX, labelY, labelRotation };
  });

  return positions;
}

export function getSeatPositions(
  shape: TableShape,
  capacity: number,
  diagramSize: number,
  roundSeatSpacing: RoundSeatSpacing = 'default'
): SeatPosition[] {
  const scale = diagramSize / 320;
  const seatSize = BASE_SEAT_SIZE * scale;
  const count = Math.max(capacity, 1);

  switch (shape) {
    case 'singleSided':
      return getSingleSidedSeatPositions(count, diagramSize, seatSize);
    case 'rectangular':
      return getRectangularSeatPositions(count, diagramSize, seatSize);
    case 'square':
      return getSquareSeatPositions(count, diagramSize, seatSize);
    case 'round':
    default:
      return getRoundSeatPositions(count, diagramSize, seatSize, roundSeatSpacing);
  }
}

export function getScaledSeatSize(diagramSize: number): number {
  return BASE_SEAT_SIZE * (diagramSize / 320);
}

export function getScaledLabelWidth(diagramSize: number): number {
  return 80 * (diagramSize / 320);
}

export const TABLE_SHAPE_PREVIEW_SEATS: Record<TableShape, number> = {
  round: 6,
  singleSided: 4,
  rectangular: 6,
  square: 4,
};

export function getPreviewSeatPositions(shape: TableShape, diagramSize: number): SeatPosition[] {
  return getSeatPositions(shape, TABLE_SHAPE_PREVIEW_SEATS[shape], diagramSize);
}
