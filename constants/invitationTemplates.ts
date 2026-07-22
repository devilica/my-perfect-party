import { ImageSourcePropType } from 'react-native';

import { CelebrationThemeId } from '@/types/models';
import {
  CELEBRATION_THEME_IDS,
  getCelebrationTheme,
} from '@/theme/celebrations';

export type InvitationTemplateCategory =
  | 'universal'
  | 'wedding'
  | 'birthday1'
  | 'birthday18'
  | 'celebration';

export type InvitationCornerStyle =
  | 'none'
  | 'roses'
  | 'garland'
  | 'confetti'
  | 'teddyPink'
  | 'teddyBlue'
  | 'stars'
  | 'balloons';

export type InvitationTextTone = 'light' | 'dark';

export type InvitationTemplate = {
  id: string;
  category: InvitationTemplateCategory;
  labelKey: string;
  backgroundColor: string;
  overlayColor: string;
  gradientColors?: [string, string];
  borderColor: string;
  borderWidth: number;
  doubleBorder: boolean;
  innerBorderColor?: string;
  cornerStyle: InvitationCornerStyle;
  accentColor: string;
  secondaryAccent?: string;
  textTone?: InvitationTextTone;
  scatterFloral?: boolean;
  backgroundImage?: ImageSourcePropType;
  celebrationThemeId?: CelebrationThemeId;
  useImageBackground?: boolean;
  subtleCorners?: boolean;
};

export const DEFAULT_INVITATION_TEMPLATE_ID = 'classic-gold';

const LEGACY_TEMPLATE_MAP: Record<string, string> = {
  'birthday1-pastel': 'birthday1-girl',
  'birthday1-playful': 'birthday1-boy',
};

export const PROGRAMMATIC_INVITATION_TEMPLATES: InvitationTemplate[] = [
  {
    id: 'classic-gold',
    category: 'universal',
    labelKey: 'invitation.templates.classicGold',
    backgroundColor: '#FFF9F5',
    overlayColor: '#FFE8EE',
    gradientColors: ['#FFF9F5', '#FFE4EC'],
    borderColor: '#D4AF7A',
    borderWidth: 2,
    doubleBorder: true,
    innerBorderColor: '#E8C88A',
    cornerStyle: 'roses',
    accentColor: '#C9A962',
    secondaryAccent: '#E8A0B0',
    textTone: 'dark',
    scatterFloral: true,
  },
  {
    id: 'minimal-line',
    category: 'universal',
    labelKey: 'invitation.templates.minimalLine',
    backgroundColor: '#FAF8FF',
    overlayColor: '#F0EBFA',
    gradientColors: ['#FAF8FF', '#EDE6F8'],
    borderColor: '#B8A8D0',
    borderWidth: 2,
    doubleBorder: false,
    cornerStyle: 'garland',
    accentColor: '#9B8AB8',
    secondaryAccent: '#C4B5D8',
    textTone: 'dark',
    scatterFloral: true,
  },
  {
    id: 'soft-blush',
    category: 'universal',
    labelKey: 'invitation.templates.softBlush',
    backgroundColor: '#FFF5F8',
    overlayColor: '#FFD6E5',
    gradientColors: ['#FFF5F8', '#FFC8DD'],
    borderColor: '#F0A0C0',
    borderWidth: 2,
    doubleBorder: false,
    cornerStyle: 'roses',
    accentColor: '#E87898',
    secondaryAccent: '#FFB6C8',
    textTone: 'dark',
    scatterFloral: true,
  },
  {
    id: 'wedding-rose',
    category: 'wedding',
    labelKey: 'invitation.templates.weddingRose',
    backgroundColor: '#FFF8F6',
    overlayColor: '#FFE0D8',
    gradientColors: ['#FFF8F6', '#FFD4C8'],
    borderColor: '#C9A962',
    borderWidth: 2,
    doubleBorder: true,
    innerBorderColor: '#E8C88A',
    cornerStyle: 'roses',
    accentColor: '#B85C6E',
    secondaryAccent: '#E8A0A8',
    textTone: 'dark',
    scatterFloral: true,
  },
  {
    id: 'wedding-marble',
    category: 'wedding',
    labelKey: 'invitation.templates.weddingMarble',
    backgroundColor: '#FFFCFA',
    overlayColor: '#F5EDE8',
    gradientColors: ['#FFFCFA', '#F0E8E0'],
    borderColor: '#C8B8A0',
    borderWidth: 2,
    doubleBorder: false,
    cornerStyle: 'roses',
    accentColor: '#A89078',
    secondaryAccent: '#D4C4B0',
    textTone: 'dark',
    scatterFloral: true,
  },
  {
    id: 'wedding-double',
    category: 'wedding',
    labelKey: 'invitation.templates.weddingDouble',
    backgroundColor: '#FFFBF8',
    overlayColor: '#F8E8E0',
    gradientColors: ['#FFFBF8', '#F5D8CC'],
    borderColor: '#B88868',
    borderWidth: 2,
    doubleBorder: true,
    innerBorderColor: '#D4A880',
    cornerStyle: 'garland',
    accentColor: '#8B6050',
    secondaryAccent: '#C99878',
    textTone: 'dark',
    scatterFloral: true,
  },
  {
    id: 'wedding-ivy',
    category: 'wedding',
    labelKey: 'invitation.templates.weddingIvy',
    backgroundColor: '#F8FBF5',
    overlayColor: '#E8F2E0',
    gradientColors: ['#F8FBF5', '#D8ECD0'],
    borderColor: '#7AAD68',
    borderWidth: 2,
    doubleBorder: false,
    cornerStyle: 'garland',
    accentColor: '#5A8F48',
    secondaryAccent: '#98C888',
    textTone: 'dark',
    scatterFloral: true,
  },
  {
    id: 'birthday1-girl',
    category: 'birthday1',
    labelKey: 'invitation.templates.birthday1Girl',
    backgroundColor: '#FFF5FA',
    overlayColor: '#FFE0F0',
    gradientColors: ['#FFF5FA', '#FFD0E8'],
    borderColor: '#F0A0C8',
    borderWidth: 2,
    doubleBorder: true,
    innerBorderColor: '#FFB8D8',
    cornerStyle: 'teddyPink',
    accentColor: '#E878A8',
    secondaryAccent: '#FFB0D0',
    textTone: 'dark',
    scatterFloral: false,
  },
  {
    id: 'birthday1-boy',
    category: 'birthday1',
    labelKey: 'invitation.templates.birthday1Boy',
    backgroundColor: '#F0F8FF',
    overlayColor: '#D8ECFF',
    gradientColors: ['#F0F8FF', '#C0E0FF'],
    borderColor: '#78B0E8',
    borderWidth: 2,
    doubleBorder: true,
    innerBorderColor: '#98C8F8',
    cornerStyle: 'teddyBlue',
    accentColor: '#4898D8',
    secondaryAccent: '#88C0F0',
    textTone: 'dark',
    scatterFloral: false,
  },
  {
    id: 'birthday18-elegant',
    category: 'birthday18',
    labelKey: 'invitation.templates.birthday18Elegant',
    backgroundColor: '#FFFAF5',
    overlayColor: '#F8E8D8',
    gradientColors: ['#FFFAF5', '#F0D8C0'],
    borderColor: '#C9A962',
    borderWidth: 2,
    doubleBorder: true,
    innerBorderColor: '#E0C890',
    cornerStyle: 'confetti',
    accentColor: '#A88050',
    secondaryAccent: '#D4B878',
    textTone: 'dark',
    scatterFloral: false,
  },
  {
    id: 'birthday18-modern',
    category: 'birthday18',
    labelKey: 'invitation.templates.birthday18Modern',
    backgroundColor: '#FFF8F5',
    overlayColor: '#FFE8E0',
    gradientColors: ['#FFF8F5', '#FFD0C0'],
    borderColor: '#E07A5F',
    borderWidth: 2,
    doubleBorder: false,
    cornerStyle: 'confetti',
    accentColor: '#D06048',
    secondaryAccent: '#F0A090',
    textTone: 'dark',
    scatterFloral: false,
  },
  {
    id: 'birthday18-gold',
    category: 'birthday18',
    labelKey: 'invitation.templates.birthday18Gold',
    backgroundColor: '#FFFCF0',
    overlayColor: '#FFF0C8',
    gradientColors: ['#FFFCF0', '#FFE898'],
    borderColor: '#D4A820',
    borderWidth: 2,
    doubleBorder: true,
    innerBorderColor: '#F0C840',
    cornerStyle: 'stars',
    accentColor: '#B89018',
    secondaryAccent: '#F0D050',
    textTone: 'dark',
    scatterFloral: false,
  },
];

const CELEBRATION_CORNER_STYLES: Record<CelebrationThemeId, InvitationCornerStyle> = {
  wedding: 'roses',
  birthday: 'balloons',
  baptism: 'garland',
  newYear: 'stars',
  christmas: 'garland',
  graduation: 'confetti',
  anniversary: 'roses',
  engagement: 'roses',
  other: 'confetti',
};

function buildCelebrationInvitationTemplates(): InvitationTemplate[] {
  return CELEBRATION_THEME_IDS.map((themeId) => {
    const theme = getCelebrationTheme(themeId);
    const { colors } = theme;

    return {
      id: `theme-${themeId}`,
      category: 'celebration',
      labelKey: theme.labelKey,
      backgroundColor: colors.background,
      overlayColor: 'rgba(255,255,255,0.35)',
      borderColor: colors.primary,
      borderWidth: 2,
      doubleBorder: true,
      innerBorderColor: colors.primaryLight,
      cornerStyle: CELEBRATION_CORNER_STYLES[themeId],
      accentColor: colors.primary,
      secondaryAccent: colors.primaryDark,
      textTone: 'dark',
      scatterFloral: false,
      backgroundImage: theme.backgroundImage,
      celebrationThemeId: themeId,
      useImageBackground: true,
      subtleCorners: true,
    };
  });
}

export const INVITATION_TEMPLATES: InvitationTemplate[] = [
  ...PROGRAMMATIC_INVITATION_TEMPLATES,
  ...buildCelebrationInvitationTemplates(),
];

export function getInvitationTemplate(id: string): InvitationTemplate {
  const resolvedId = LEGACY_TEMPLATE_MAP[id] ?? id;
  return (
    INVITATION_TEMPLATES.find((template) => template.id === resolvedId) ??
    INVITATION_TEMPLATES[0]
  );
}

export function getTemplateIndex(id: string): number {
  const resolvedId = LEGACY_TEMPLATE_MAP[id] ?? id;
  const index = INVITATION_TEMPLATES.findIndex((template) => template.id === resolvedId);
  return index >= 0 ? index : 0;
}
