export const colors = {
  background: '#FFF8F5',
  surface: '#FFFFFF',
  primary: '#C4847A',
  primaryDark: '#A66B62',
  primaryLight: '#F5E6E3',
  text: '#1A1714',
  textSecondary: '#4A4540',
  textMuted: '#6B6560',
  border: '#CFC3BC',
  success: '#5A9E6F',
  successLight: '#E8F5EC',
  pending: '#B8B0AA',
  pendingLight: '#F0EBE8',
  danger: '#C75B5B',
  dangerLight: '#FCEAEA',
  seatAvailable: '#5A9E6F',
  seatAvailableLight: '#E8F5EC',
  seatAlmostFull: '#D4923A',
  seatAlmostFullLight: '#FDF3E7',
  seatFull: '#C75B5B',
  seatFullLight: '#FCEAEA',
  brideSide: '#C4847A',
  brideSideLight: '#F5E6E3',
  groomSide: '#5C6B7A',
  groomSideLight: '#E8EDF2',
  sharedSide: '#8B7EC8',
  sharedSideLight: '#F0ECFA',
  shadow: 'rgba(45, 42, 38, 0.12)',
  overlay: 'rgba(45, 42, 38, 0.5)',
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
