import { CelebrationThemeId } from '@/types/models';

export const OBLIGATION_TEMPLATE_KEYS: Record<CelebrationThemeId, string[]> = {
  wedding: [
    'obligations.presets.wedding.dress',
    'obligations.presets.wedding.registrar',
    'obligations.presets.wedding.venue',
    'obligations.presets.wedding.photographer',
    'obligations.presets.wedding.flowers',
    'obligations.presets.wedding.music',
  ],
  birthday: [
    'obligations.presets.birthday.venue',
    'obligations.presets.birthday.cake',
    'obligations.presets.birthday.decor',
    'obligations.presets.birthday.invitations',
  ],
  baptism: [
    'obligations.presets.baptism.church',
    'obligations.presets.baptism.venue',
    'obligations.presets.baptism.godparents',
    'obligations.presets.baptism.photographer',
  ],
  newYear: [
    'obligations.presets.newYear.venue',
    'obligations.presets.newYear.decor',
    'obligations.presets.newYear.music',
    'obligations.presets.newYear.catering',
  ],
  christmas: [
    'obligations.presets.christmas.venue',
    'obligations.presets.christmas.decor',
    'obligations.presets.christmas.catering',
    'obligations.presets.christmas.gifts',
  ],
  graduation: [
    'obligations.presets.graduation.venue',
    'obligations.presets.graduation.catering',
    'obligations.presets.graduation.photographer',
    'obligations.presets.graduation.invitations',
  ],
  anniversary: [
    'obligations.presets.anniversary.venue',
    'obligations.presets.anniversary.catering',
    'obligations.presets.anniversary.photographer',
    'obligations.presets.anniversary.decor',
  ],
  engagement: [
    'obligations.presets.engagement.venue',
    'obligations.presets.engagement.photographer',
    'obligations.presets.engagement.catering',
    'obligations.presets.engagement.invitations',
  ],
};
