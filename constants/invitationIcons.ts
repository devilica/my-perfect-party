export type InvitationIconGroup = 'general' | 'wedding' | 'birthday';

export type InvitationIconOption = {
  name: string;
  group: InvitationIconGroup;
};

export const INVITATION_ICONS: InvitationIconOption[] = [
  { name: 'heart-outline', group: 'wedding' },
  { name: 'heart', group: 'wedding' },
  { name: 'diamond-outline', group: 'wedding' },
  { name: 'wine-outline', group: 'wedding' },
  { name: 'musical-notes-outline', group: 'wedding' },
  { name: 'camera-outline', group: 'general' },
  { name: 'restaurant-outline', group: 'general' },
  { name: 'gift-outline', group: 'birthday' },
  { name: 'balloon-outline', group: 'birthday' },
  { name: 'sparkles-outline', group: 'birthday' },
  { name: 'time-outline', group: 'general' },
  { name: 'location-outline', group: 'general' },
  { name: 'calendar-outline', group: 'general' },
  { name: 'people-outline', group: 'general' },
  { name: 'home-outline', group: 'general' },
  { name: 'car-outline', group: 'general' },
  { name: 'flower-outline', group: 'wedding' },
  { name: 'rose-outline', group: 'wedding' },
  { name: 'ribbon-outline', group: 'birthday' },
  { name: 'star-outline', group: 'birthday' },
  { name: 'happy-outline', group: 'birthday' },
  { name: 'mail-outline', group: 'general' },
  { name: 'call-outline', group: 'general' },
  { name: 'checkmark-circle-outline', group: 'general' },
];

export const INVITATION_FONT_FAMILIES = ['script', 'serif', 'sans'] as const;
