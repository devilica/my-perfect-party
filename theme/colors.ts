export const colors = {
  background: '#FFF8F5',
  surface: '#FFFFFF',
  primary: '#C4847A',
  primaryDark: '#A66B62',
  primaryLight: '#F5E6E3',
  text: '#2D2A26',
  textSecondary: '#6B6560',
  textMuted: '#9C9590',
  border: '#E8D5CF',
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
  shadow: 'rgba(45, 42, 38, 0.08)',
  overlay: 'rgba(45, 42, 38, 0.4)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const },
  heading: { fontSize: 22, fontWeight: '600' as const },
  subheading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
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
