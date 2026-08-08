export const colors = {
  background: '#FFF8F4',
  surface: '#FFFCFA',
  primary: '#C9686F',
  primaryDark: '#B92F43',
  primaryLight: '#F8E4E1',
  text: '#251B19',
  textSecondary: '#655D59',
  textMuted: '#8A827E',
  border: '#F2C5C1',
  success: '#55A373',
  successLight: '#E4F3E9',
  pending: '#B8B0AA',
  pendingLight: '#F8E4E1',
  danger: '#B92F43',
  dangerLight: '#F8E4E1',
  seatAvailable: '#55A373',
  seatAvailableLight: '#E4F3E9',
  seatAlmostFull: '#D5A36A',
  seatAlmostFullLight: '#FDF3E7',
  seatFull: '#B92F43',
  seatFullLight: '#F8E4E1',
  brideSide: '#C9686F',
  brideSideLight: '#F8E4E1',
  groomSide: '#861E2B',
  groomSideLight: '#F2C5C1',
  sharedSide: '#D5A36A',
  sharedSideLight: '#FFF8E8',
  shadow: 'rgba(37, 27, 25, 0.12)',
  overlay: 'rgba(37, 27, 25, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 24,
  full: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  heading: { fontSize: 20, fontWeight: '600' as const },
  subheading: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  small: { fontSize: 11, fontWeight: '400' as const },
};

export function getOccupancyColors(status: 'available' | 'almostFull' | 'full') {
  switch (status) {
    case 'full':
      return { main: colors.seatFull, light: colors.seatFullLight };
    case 'almostFull':
      return { main: colors.seatAlmostFull, light: colors.seatAlmostFullLight };
    default:
      return { main: colors.seatAvailable, light: colors.seatAvailableLight };
  }
}
