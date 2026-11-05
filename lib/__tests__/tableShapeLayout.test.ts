import {
  getPreviewSeatPositions,
  getScaledSeatSize,
  TABLE_SHAPE_PREVIEW_SEATS,
} from '@/lib/tableShapeLayout';

describe('tableShapeLayout', () => {
  describe('getPreviewSeatPositions', () => {
    it('returns expected seat count for round tables', () => {
      const seats = getPreviewSeatPositions('round', 320);
      expect(seats).toHaveLength(TABLE_SHAPE_PREVIEW_SEATS.round);
    });

    it('returns expected seat count for square tables', () => {
      const seats = getPreviewSeatPositions('square', 320);
      expect(seats).toHaveLength(TABLE_SHAPE_PREVIEW_SEATS.square);
    });

    it('uses labelRotation 0 for left-side square seats', () => {
      const seats = getPreviewSeatPositions('square', 320);
      const leftSeat = seats.find((s) => s.labelRotation === 0);
      expect(leftSeat).toBeDefined();
    });
  });

  describe('getScaledSeatSize', () => {
    it('matches base size at 320px diagram width', () => {
      expect(getScaledSeatSize(320)).toBe(28);
    });

    it('scales proportionally with diagram size', () => {
      expect(getScaledSeatSize(160)).toBe(14);
    });
  });
});
