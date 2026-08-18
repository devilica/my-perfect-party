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
  designedArtwork?: boolean;
};

export const PREVIEW_INVITATION_TEMPLATE_COUNT = 5;

export const FEATURED_INVITATION_TEMPLATE_IDS = [
  'art-birthday1-girl',
  'art-birthday18-rose-gold',
  'theme-wedding',
  'theme-birthday',
  'art-ivory-roses',
] as const;

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

function illustrated(
  template: Pick<
    InvitationTemplate,
    | 'id'
    | 'category'
    | 'labelKey'
    | 'backgroundColor'
    | 'borderColor'
    | 'accentColor'
    | 'secondaryAccent'
    | 'backgroundImage'
  >
): InvitationTemplate {
  return {
    overlayColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0,
    doubleBorder: false,
    cornerStyle: 'none',
    textTone: 'dark',
    scatterFloral: false,
    useImageBackground: true,
    designedArtwork: true,
    ...template,
  };
}

export const ILLUSTRATED_INVITATION_TEMPLATES: InvitationTemplate[] = [
  illustrated({
    id: 'art-blue-balloons',
    category: 'universal',
    labelKey: 'invitation.templates.blueBalloons',
    backgroundColor: '#F7F4EE',
    borderColor: '#C9A962',
    accentColor: '#1E3A5F',
    secondaryAccent: '#C9A962',
    backgroundImage: require('@/assets/invitations/blue-balloons.png'),
  }),
  illustrated({
    id: 'art-blush-balloons',
    category: 'universal',
    labelKey: 'invitation.templates.blushBalloons',
    backgroundColor: '#FFF8F4',
    borderColor: '#D5A36A',
    accentColor: '#D48680',
    secondaryAccent: '#D5A36A',
    backgroundImage: require('@/assets/invitations/blush-balloons.png'),
  }),
  illustrated({
    id: 'art-botanical-gold',
    category: 'wedding',
    labelKey: 'invitation.templates.botanicalGold',
    backgroundColor: '#F8F6F0',
    borderColor: '#C9A962',
    accentColor: '#6B8F5A',
    secondaryAccent: '#C9A962',
    backgroundImage: require('@/assets/invitations/botanical-gold.png'),
  }),
  illustrated({
    id: 'art-greenery-gold',
    category: 'wedding',
    labelKey: 'invitation.templates.greeneryGold',
    backgroundColor: '#F7F4EE',
    borderColor: '#C9A962',
    accentColor: '#7A8F5A',
    secondaryAccent: '#C9A962',
    backgroundImage: require('@/assets/invitations/greenery-gold.png'),
  }),
  illustrated({
    id: 'art-ivory-roses',
    category: 'wedding',
    labelKey: 'invitation.templates.ivoryRoses',
    backgroundColor: '#F8F4EC',
    borderColor: '#D4AF7A',
    accentColor: '#C9A962',
    secondaryAccent: '#8A9A6A',
    backgroundImage: require('@/assets/invitations/ivory-roses.png'),
  }),
  illustrated({
    id: 'art-white-roses',
    category: 'wedding',
    labelKey: 'invitation.templates.whiteRoses',
    backgroundColor: '#F6F1E8',
    borderColor: '#D4AF7A',
    accentColor: '#C9A962',
    secondaryAccent: '#8A9A6A',
    backgroundImage: require('@/assets/invitations/white-roses.png'),
  }),
  illustrated({
    id: 'art-baby-neutrals',
    category: 'birthday1',
    labelKey: 'invitation.templates.babyNeutrals',
    backgroundColor: '#F7F4EE',
    borderColor: '#C4B59A',
    accentColor: '#8A9A7A',
    secondaryAccent: '#C4B59A',
    backgroundImage: require('@/assets/invitations/baby-neutrals.png'),
  }),
  illustrated({
    id: 'art-birthday1-boy',
    category: 'birthday1',
    labelKey: 'invitation.templates.birthday1BoyArt',
    backgroundColor: '#F3F7FB',
    borderColor: '#A8C4D8',
    accentColor: '#7BA3C9',
    secondaryAccent: '#C4B59A',
    backgroundImage: require('@/assets/invitations/birthday1-boy.png'),
  }),
  illustrated({
    id: 'art-birthday1-girl',
    category: 'birthday1',
    labelKey: 'invitation.templates.birthday1GirlArt',
    backgroundColor: '#FFF6F8',
    borderColor: '#F0B8C8',
    accentColor: '#E8A0B8',
    secondaryAccent: '#D5A36A',
    backgroundImage: require('@/assets/invitations/birthday1-girl.png'),
  }),
  illustrated({
    id: 'art-birthday18-blush-navy',
    category: 'birthday18',
    labelKey: 'invitation.templates.birthday18BlushNavy',
    backgroundColor: '#FFF8F4',
    borderColor: '#C9A962',
    accentColor: '#1E3A5F',
    secondaryAccent: '#C9A962',
    backgroundImage: require('@/assets/invitations/birthday18-blush-navy.png'),
  }),
  illustrated({
    id: 'art-birthday18-rose-gold',
    category: 'birthday18',
    labelKey: 'invitation.templates.birthday18RoseGold',
    backgroundColor: '#FFF8F4',
    borderColor: '#C9A962',
    accentColor: '#C4886A',
    secondaryAccent: '#4A4540',
    backgroundImage: require('@/assets/invitations/birthday18-rose-gold.png'),
  }),
  illustrated({
    id: 'art-birthday18-navy-gold',
    category: 'birthday18',
    labelKey: 'invitation.templates.birthday18NavyGold',
    backgroundColor: '#F7F4EE',
    borderColor: '#C9A962',
    accentColor: '#1E3A5F',
    secondaryAccent: '#C9A962',
    backgroundImage: require('@/assets/invitations/birthday18-navy-gold.png'),
  }),
  illustrated({
    id: 'art-team-bride',
    category: 'universal',
    labelKey: 'invitation.templates.teamBride',
    backgroundColor: '#FFF8F4',
    borderColor: '#D5A36A',
    accentColor: '#D48680',
    secondaryAccent: '#C9A962',
    backgroundImage: require('@/assets/invitations/team-bride.png'),
  }),
  illustrated({
    id: 'art-baby-sage',
    category: 'birthday1',
    labelKey: 'invitation.templates.babySage',
    backgroundColor: '#F7F4EE',
    borderColor: '#C4B59A',
    accentColor: '#8A9A7A',
    secondaryAccent: '#C4B59A',
    backgroundImage: require('@/assets/invitations/baby-sage.png'),
  }),
  illustrated({
    id: 'art-gold-floral-frame',
    category: 'wedding',
    labelKey: 'invitation.templates.goldFloralFrame',
    backgroundColor: '#F8F4EC',
    borderColor: '#D4AF7A',
    accentColor: '#C9A962',
    secondaryAccent: '#8A9A6A',
    backgroundImage: require('@/assets/invitations/gold-floral-frame.png'),
  }),
];

function buildCelebrationInvitationTemplates(
  themeIds: CelebrationThemeId[] = CELEBRATION_THEME_IDS
): InvitationTemplate[] {
  return themeIds.map((themeId) => {
    const theme = getCelebrationTheme(themeId);
    const { colors } = theme;

    return {
      id: `theme-${themeId}`,
      category: 'celebration' as const,
      labelKey: theme.labelKey,
      backgroundColor: colors.background,
      overlayColor: 'rgba(255,255,255,0.35)',
      borderColor: colors.primary,
      borderWidth: 0,
      doubleBorder: false,
      cornerStyle: 'none',
      accentColor: colors.primary,
      secondaryAccent: colors.primaryDark,
      textTone: 'light' as const,
      scatterFloral: false,
      backgroundImage: theme.backgroundImage,
      celebrationThemeId: themeId,
      useImageBackground: true,
    };
  });
}

const CELEBRATION_INVITATION_TEMPLATES = buildCelebrationInvitationTemplates(
  CELEBRATION_THEME_IDS.filter((themeId) => themeId !== 'other')
);

const INVITATION_CATALOG: InvitationTemplate[] = [
  ...CELEBRATION_INVITATION_TEMPLATES,
  ...ILLUSTRATED_INVITATION_TEMPLATES,
];

function orderInvitationTemplates(
  templates: InvitationTemplate[]
): InvitationTemplate[] {
  const featured = FEATURED_INVITATION_TEMPLATE_IDS.flatMap((id) => {
    const match = templates.find((template) => template.id === id);
    return match ? [match] : [];
  });
  const featuredIds = new Set<string>(FEATURED_INVITATION_TEMPLATE_IDS);
  return [...featured, ...templates.filter((template) => !featuredIds.has(template.id))];
}

export const INVITATION_TEMPLATES: InvitationTemplate[] = orderInvitationTemplates(
  INVITATION_CATALOG
);

/** Default background when creating a new invitation — 5th template in the visible preview row. */
export const DEFAULT_INVITATION_TEMPLATE_ID =
  INVITATION_TEMPLATES[PREVIEW_INVITATION_TEMPLATE_COUNT - 1]?.id ??
  INVITATION_TEMPLATES[0]?.id ??
  'theme-wedding';

const ALL_INVITATION_TEMPLATES: InvitationTemplate[] = [
  ...PROGRAMMATIC_INVITATION_TEMPLATES,
  ...buildCelebrationInvitationTemplates(),
  ...ILLUSTRATED_INVITATION_TEMPLATES,
];

export function getInvitationTemplate(id: string): InvitationTemplate {
  const resolvedId = LEGACY_TEMPLATE_MAP[id] ?? id;
  return (
    ALL_INVITATION_TEMPLATES.find((template) => template.id === resolvedId) ??
    ALL_INVITATION_TEMPLATES.find((template) => template.id === DEFAULT_INVITATION_TEMPLATE_ID) ??
    INVITATION_TEMPLATES[0]
  );
}

export function getTemplateIndex(id: string): number {
  const resolvedId = LEGACY_TEMPLATE_MAP[id] ?? id;
  const index = INVITATION_TEMPLATES.findIndex((template) => template.id === resolvedId);
  return index >= 0 ? index : 0;
}

export function getSuggestedFontColor(templateId: string): string {
  const template = getInvitationTemplate(templateId);
  return template.textTone === 'light' ? '#FFFFFF' : '#3D3D3D';
}
