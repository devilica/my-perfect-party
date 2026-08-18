import { generateId } from '@/lib/generateId';
import { parseIsoDateTime } from '@/lib/dateUtils';
import { getSuggestedFontColor, DEFAULT_INVITATION_TEMPLATE_ID } from '@/constants/invitationTemplates';
import {
  CelebrationThemeId,
  EventInvitation,
  InvitationTextBox,
  WeddingEvent,
} from '@/types/models';

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

const MONTH_KEYS = [
  'invitation.months.january',
  'invitation.months.february',
  'invitation.months.march',
  'invitation.months.april',
  'invitation.months.may',
  'invitation.months.june',
  'invitation.months.july',
  'invitation.months.august',
  'invitation.months.september',
  'invitation.months.october',
  'invitation.months.november',
  'invitation.months.december',
] as const;

function formatInvitationDate(value: string | undefined, t: TranslateFn): string {
  const parsed = parseIsoDateTime(value);
  if (!parsed) return '';

  const day = parsed.getDate();
  const monthKey = MONTH_KEYS[parsed.getMonth()];
  const year = parsed.getFullYear();
  return `${day} ${t(monthKey).toUpperCase()} ${year}`;
}

function defaultHeaderIcon(theme: CelebrationThemeId): string {
  switch (theme) {
    case 'wedding':
    case 'engagement':
    case 'anniversary':
      return 'heart-outline';
    case 'birthday':
      return 'gift-outline';
    default:
      return 'sparkles-outline';
  }
}

function defaultHeaderTitle(theme: CelebrationThemeId, t: TranslateFn): string {
  switch (theme) {
    case 'wedding':
    case 'engagement':
      return t('invitation.defaults.weddingHeader');
    case 'birthday':
      return t('invitation.defaults.birthdayHeader');
    default:
      return t('invitation.defaults.genericHeader');
  }
}

function defaultSubEvents(
  event: WeddingEvent,
  t: TranslateFn
): EventInvitation['subEvents'] {
  const time =
    event.date?.includes('T') && parseIsoDateTime(event.date)
      ? `${String(parseIsoDateTime(event.date)!.getHours()).padStart(2, '0')}:${String(parseIsoDateTime(event.date)!.getMinutes()).padStart(2, '0')}`
      : '12:00';

  const items: EventInvitation['subEvents'] = [
    {
      id: generateId(),
      icon: 'time-outline',
      time,
      title: t('invitation.defaults.ceremony'),
      location: event.location ?? '',
    },
  ];

  if (event.location?.trim()) {
    items.push({
      id: generateId(),
      icon: 'location-outline',
      time,
      title: t('invitation.defaults.venue'),
      location: event.location.trim(),
    });
  }

  return items;
}

export function createDefaultInvitation(event: WeddingEvent, t: TranslateFn): EventInvitation {
  const templateId = DEFAULT_INVITATION_TEMPLATE_ID;
  return {
    templateId,
    backgroundOpacity: 0.85,
    lineSpacing: 1,
    headerIcon: defaultHeaderIcon(event.theme),
    headerTitle: defaultHeaderTitle(event.theme, t),
    hostNames: event.name,
    namesFontFamily: 'script',
    fontSize: 36,
    fontColor: getSuggestedFontColor(templateId),
    eventDateText: formatInvitationDate(event.date, t),
    subEvents: defaultSubEvents(event, t),
    customTexts: [],
    rsvpMessage: t('invitation.defaults.rsvp'),
    watermarkRemoved: false,
    updatedAt: new Date().toISOString(),
  };
}

export function createInvitationTextBox(
  color: string,
  fontFamily: EventInvitation['namesFontFamily'],
  existingCount: number,
  text: string
): InvitationTextBox {
  return {
    id: generateId(),
    text,
    x: 0.16,
    y: Math.min(0.28 + existingCount * 0.07, 0.72),
    fontSize: 18,
    fontFamily,
    color,
    align: 'center',
  };
}

export function normalizeInvitation(invitation: EventInvitation): EventInvitation {
  return {
    ...invitation,
    headerIcon: invitation.headerIcon ?? '',
    subEvents: invitation.subEvents ?? [],
    customTexts: invitation.customTexts ?? [],
    watermarkRemoved: invitation.watermarkRemoved ?? false,
  };
}

export function mergeInvitation(
  existing: EventInvitation | undefined,
  event: WeddingEvent,
  t: TranslateFn
): EventInvitation {
  return existing
    ? normalizeInvitation(existing)
    : createDefaultInvitation(event, t);
}
