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

const weddingTheme: CelebrationTheme = {
  id: 'wedding',
  labelKey: 'events.themes.wedding',
  icon: 'heart',
  backgroundImage: require('@/assets/themes/wedding.png'),
  overlayColors: ['rgba(255,248,245,0.88)', 'rgba(255,248,245,0.82)'],
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
    surface: 'rgba(255,255,255,0.93)',
    primary: '#E07A5F',
    primaryDark: '#C45C42',
    primaryLight: '#FFE8DF',
    text: '#3D2A24',
    textSecondary: '#7A5E54',
    textMuted: '#A89088',
    border: '#F5D4C8',
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
    surface: 'rgba(255,255,255,0.93)',
    primary: '#5B9BD5',
    primaryDark: '#3E7FB8',
    primaryLight: '#E3F0FA',
    text: '#1E3344',
    textSecondary: '#4A6578',
    textMuted: '#7A94A8',
    border: '#C8DFF0',
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
    surface: 'rgba(255,255,255,0.93)',
    primary: '#C9A227',
    primaryDark: '#9A7B1A',
    primaryLight: '#FFF4D6',
    text: '#1A2340',
    textSecondary: '#4A5578',
    textMuted: '#7A85A8',
    border: '#D4DCF0',
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
    surface: 'rgba(255,255,255,0.93)',
    primary: '#2D6A4F',
    primaryDark: '#1B4332',
    primaryLight: '#D8F3DC',
    text: '#1B2E24',
    textSecondary: '#4A6B58',
    textMuted: '#7A9A88',
    border: '#B7E4C7',
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
    surface: 'rgba(255,255,255,0.93)',
    primary: '#1E3A5F',
    primaryDark: '#122640',
    primaryLight: '#E8EEF4',
    text: '#1A2340',
    textSecondary: '#4A5578',
    textMuted: '#7A85A8',
    border: '#C8D4E8',
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
    surface: 'rgba(255,255,255,0.93)',
    primary: '#8B2942',
    primaryDark: '#6B1F32',
    primaryLight: '#F5E0E8',
    text: '#3D1A28',
    textSecondary: '#7A4A58',
    textMuted: '#A88090',
    border: '#E8C8D4',
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
    surface: 'rgba(255,255,255,0.93)',
    primary: '#B76E79',
    primaryDark: '#965A64',
    primaryLight: '#F5E6EC',
    text: '#3D2830',
    textSecondary: '#7A5860',
    textMuted: '#A89098',
    border: '#E8D0D8',
    brideSide: '#B76E79',
    brideSideLight: '#F5E6EC',
    groomSide: '#7A8FA8',
    groomSideLight: '#E8EEF4',
    sharedSide: '#C9A227',
    sharedSideLight: '#FFF4D6',
  }),
};

export const CELEBRATION_THEMES: Record<CelebrationThemeId, CelebrationTheme> = {
  wedding: weddingTheme,
  birthday: birthdayTheme,
  baptism: baptismTheme,
  newYear: newYearTheme,
  christmas: christmasTheme,
  graduation: graduationTheme,
  anniversary: anniversaryTheme,
  engagement: engagementTheme,
};

export const CELEBRATION_THEME_IDS: CelebrationThemeId[] = [
  'wedding',
  'birthday',
  'baptism',
  'newYear',
  'christmas',
  'graduation',
  'anniversary',
  'engagement',
];

export function getCelebrationTheme(id: CelebrationThemeId): CelebrationTheme {
  return CELEBRATION_THEMES[id] ?? weddingTheme;
}
