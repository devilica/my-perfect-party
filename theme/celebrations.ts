import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';

import { CelebrationThemeId } from '@/types/models';
import { colors as defaultColors } from '@/theme/colors';

export type ThemePalette = typeof defaultColors;

export type CelebrationTheme = {
  id: CelebrationThemeId;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundImage: ImageSourcePropType;
  overlayColors: [string, string];
  colors: ThemePalette;
};

function palette(overrides: Partial<ThemePalette>): ThemePalette {
  return { ...defaultColors, ...overrides };
}

const defaultTheme: CelebrationTheme = {
  id: 'default',
  labelKey: 'events.themes.default',
  icon: 'sparkles',
  backgroundImage: require('@/assets/themes/default.png'),
  overlayColors: ['rgba(255,245,247,0.92)', 'rgba(253,232,234,0.88)'],
  colors: palette({
    background: '#FFF5F7',
    surface: '#FFFFFF',
    primary: '#E85A74',
    primaryDark: '#C73A58',
    primaryLight: '#FDE8EA',
    text: '#251B19',
    textSecondary: '#655D59',
    textMuted: '#8A827E',
    border: '#F2C5C1',
    pendingLight: '#FDE8EA',
    danger: '#C73A58',
    dangerLight: '#FDE8EA',
    seatFull: '#C73A58',
    seatFullLight: '#FDE8EA',
    brideSide: '#E85A74',
    brideSideLight: '#FDE8EA',
    groomSide: '#5F0F1B',
    groomSideLight: '#F2C5C1',
    sharedSide: '#F7C796',
    sharedSideLight: '#FFF8E8',
  }),
};

const weddingTheme: CelebrationTheme = {
  id: 'wedding',
  labelKey: 'events.themes.wedding',
  icon: 'heart',
  backgroundImage: require('@/assets/themes/wedding.png'),
  overlayColors: ['rgba(255,248,244,0.92)', 'rgba(248,228,225,0.88)'],
  colors: defaultColors,
};

const birthdayTheme: CelebrationTheme = {
  id: 'birthday',
  labelKey: 'events.themes.birthday',
  icon: 'gift',
  backgroundImage: require('@/assets/themes/birthday.png'),
  overlayColors: ['rgba(255,250,245,0.88)', 'rgba(255,243,235,0.82)'],
  colors: palette({
    background: '#FFF8F2',
    surface: '#FFFFFF',
    primary: '#E07A5F',
    primaryDark: '#C45C42',
    primaryLight: '#FFE8DF',
    text: '#2A1C18',
    textSecondary: '#5C4540',
    textMuted: '#7A6560',
    border: '#E0B8AA',
    brideSide: '#E07A5F',
    brideSideLight: '#FFE8DF',
    groomSide: '#5B8DEF',
    groomSideLight: '#E3EEFF',
    sharedSide: '#F2B84B',
    sharedSideLight: '#FFF3D6',
  }),
};

const baptismTheme: CelebrationTheme = {
  id: 'baptism',
  labelKey: 'events.themes.baptism',
  icon: 'water-outline',
  backgroundImage: require('@/assets/themes/baptism.png'),
  overlayColors: ['rgba(240,248,255,0.88)', 'rgba(232,244,255,0.82)'],
  colors: palette({
    background: '#F0F8FF',
    surface: '#FFFFFF',
    primary: '#5B9BD5',
    primaryDark: '#3E7FB8',
    primaryLight: '#E3F0FA',
    text: '#142430',
    textSecondary: '#3A5568',
    textMuted: '#5A7488',
    border: '#A8C8E0',
    brideSide: '#5B9BD5',
    brideSideLight: '#E3F0FA',
    groomSide: '#6B8FA3',
    groomSideLight: '#E8F0F4',
    sharedSide: '#8BB8D4',
    sharedSideLight: '#EDF6FC',
  }),
};

const newYearTheme: CelebrationTheme = {
  id: 'newYear',
  labelKey: 'events.themes.newYear',
  icon: 'star',
  backgroundImage: require('@/assets/themes/new-year.png'),
  overlayColors: ['rgba(240,244,255,0.88)', 'rgba(232,238,255,0.82)'],
  colors: palette({
    background: '#F0F4FF',
    surface: '#FFFFFF',
    primary: '#C9A227',
    primaryDark: '#9A7B1A',
    primaryLight: '#FFF4D6',
    text: '#121830',
    textSecondary: '#3A4568',
    textMuted: '#5A6588',
    border: '#B8C4E0',
    brideSide: '#C9A227',
    brideSideLight: '#FFF4D6',
    groomSide: '#2E4A7A',
    groomSideLight: '#E0E8F4',
    sharedSide: '#6B7EC8',
    sharedSideLight: '#E8ECFA',
  }),
};

const christmasTheme: CelebrationTheme = {
  id: 'christmas',
  labelKey: 'events.themes.christmas',
  icon: 'snow-outline',
  backgroundImage: require('@/assets/themes/christmas.png'),
  overlayColors: ['rgba(248,255,250,0.88)', 'rgba(240,252,245,0.82)'],
  colors: palette({
    background: '#F8FFFA',
    surface: '#FFFFFF',
    primary: '#2D6A4F',
    primaryDark: '#1B4332',
    primaryLight: '#D8F3DC',
    text: '#122018',
    textSecondary: '#3A5848',
    textMuted: '#5A7868',
    border: '#98D4A8',
    brideSide: '#C1121F',
    brideSideLight: '#FCEAEA',
    groomSide: '#2D6A4F',
    groomSideLight: '#D8F3DC',
    sharedSide: '#C9A227',
    sharedSideLight: '#FFF4D6',
  }),
};

const graduationTheme: CelebrationTheme = {
  id: 'graduation',
  labelKey: 'events.themes.graduation',
  icon: 'school',
  backgroundImage: require('@/assets/themes/graduation.png'),
  overlayColors: ['rgba(248,248,255,0.88)', 'rgba(240,240,252,0.82)'],
  colors: palette({
    background: '#F8F8FF',
    surface: '#FFFFFF',
    primary: '#1E3A5F',
    primaryDark: '#122640',
    primaryLight: '#E8EEF4',
    text: '#121830',
    textSecondary: '#3A4568',
    textMuted: '#5A6588',
    border: '#A8B8D8',
    brideSide: '#C9A227',
    brideSideLight: '#FFF4D6',
    groomSide: '#1E3A5F',
    groomSideLight: '#E8EEF4',
    sharedSide: '#5B7EC8',
    sharedSideLight: '#E8EEFC',
  }),
};

const anniversaryTheme: CelebrationTheme = {
  id: 'anniversary',
  labelKey: 'events.themes.anniversary',
  icon: 'heart-circle-outline',
  backgroundImage: require('@/assets/themes/anniversary.png'),
  overlayColors: ['rgba(255,245,248,0.88)', 'rgba(255,238,244,0.82)'],
  colors: palette({
    background: '#FFF5F8',
    surface: '#FFFFFF',
    primary: '#8B2942',
    primaryDark: '#6B1F32',
    primaryLight: '#F5E0E8',
    text: '#2A1018',
    textSecondary: '#5C3848',
    textMuted: '#7A5868',
    border: '#D8A8B8',
    brideSide: '#B76E79',
    brideSideLight: '#F5E0E8',
    groomSide: '#8B2942',
    groomSideLight: '#F0D8E0',
    sharedSide: '#C9A227',
    sharedSideLight: '#FFF4D6',
  }),
};

const engagementTheme: CelebrationTheme = {
  id: 'engagement',
  labelKey: 'events.themes.engagement',
  icon: 'diamond-outline',
  backgroundImage: require('@/assets/themes/engagement.png'),
  overlayColors: ['rgba(255,248,252,0.88)', 'rgba(255,242,248,0.82)'],
  colors: palette({
    background: '#FFF8FC',
    surface: '#FFFFFF',
    primary: '#B76E79',
    primaryDark: '#965A64',
    primaryLight: '#F5E6EC',
    text: '#2A1820',
    textSecondary: '#5C4048',
    textMuted: '#7A6068',
    border: '#D8B8C0',
    brideSide: '#B76E79',
    brideSideLight: '#F5E6EC',
    groomSide: '#7A8FA8',
    groomSideLight: '#E8EEF4',
    sharedSide: '#C9A227',
    sharedSideLight: '#FFF4D6',
  }),
};

const otherTheme: CelebrationTheme = {
  id: 'other',
  labelKey: 'events.themes.other',
  icon: 'balloon-outline',
  backgroundImage: require('@/assets/themes/other.png'),
  overlayColors: ['rgba(255,252,240,0.88)', 'rgba(255,245,230,0.82)'],
  colors: palette({
    background: '#FFFCF0',
    surface: '#FFFFFF',
    primary: '#FF8C42',
    primaryDark: '#E06B20',
    primaryLight: '#FFE8D4',
    text: '#2A2018',
    textSecondary: '#5C5040',
    textMuted: '#7A7060',
    border: '#F0B890',
    success: '#5ECFB8',
    successLight: '#E0FAF4',
    brideSide: '#F06292',
    brideSideLight: '#FCE4EC',
    groomSide: '#5ECFB8',
    groomSideLight: '#E0FAF4',
    sharedSide: '#FFB74D',
    sharedSideLight: '#FFF3E0',
  }),
};

export const CELEBRATION_THEMES: Record<CelebrationThemeId, CelebrationTheme> = {
  default: defaultTheme,
  wedding: weddingTheme,
  birthday: birthdayTheme,
  baptism: baptismTheme,
  newYear: newYearTheme,
  christmas: christmasTheme,
  graduation: graduationTheme,
  anniversary: anniversaryTheme,
  engagement: engagementTheme,
  other: otherTheme,
};

export const CELEBRATION_THEME_IDS: CelebrationThemeId[] = [
  'default',
  'wedding',
  'birthday',
  'baptism',
  'newYear',
  'christmas',
  'graduation',
  'anniversary',
  'engagement',
  'other',
];

export function getCelebrationTheme(id: CelebrationThemeId): CelebrationTheme {
  return CELEBRATION_THEMES[id] ?? defaultTheme;
}
