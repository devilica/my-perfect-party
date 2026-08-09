import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import type { LegalSection } from '@/constants/legal';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type UsageGuideSection = LegalSection & {
  icon: IoniconName;
};

export const USAGE_GUIDE_SECTIONS: UsageGuideSection[] = [
  { icon: 'home-outline', titleKey: 'legal.usage.homeTitle', bodyKey: 'legal.usage.homeBody' },
  {
    icon: 'calendar-outline',
    titleKey: 'legal.usage.eventsTitle',
    bodyKey: 'legal.usage.eventsBody',
  },
  {
    icon: 'create-outline',
    titleKey: 'legal.usage.eventHeaderTitle',
    bodyKey: 'legal.usage.eventHeaderBody',
  },
  { icon: 'apps-outline', titleKey: 'legal.usage.tabsTitle', bodyKey: 'legal.usage.tabsBody' },
  {
    icon: 'stats-chart-outline',
    titleKey: 'legal.usage.overviewTitle',
    bodyKey: 'legal.usage.overviewBody',
  },
  {
    icon: 'people-outline',
    titleKey: 'legal.usage.guestsTitle',
    bodyKey: 'legal.usage.guestsBody',
  },
  {
    icon: 'person-add-outline',
    titleKey: 'legal.usage.guestFormTitle',
    bodyKey: 'legal.usage.guestFormBody',
  },
  {
    icon: 'grid-outline',
    titleKey: 'legal.usage.seatingTitle',
    bodyKey: 'legal.usage.seatingBody',
  },
  {
    icon: 'restaurant-outline',
    titleKey: 'legal.usage.tablesTitle',
    bodyKey: 'legal.usage.tablesBody',
  },
  { icon: 'map-outline', titleKey: 'legal.usage.hallTitle', bodyKey: 'legal.usage.hallBody' },
  {
    icon: 'wallet-outline',
    titleKey: 'legal.usage.expensesTitle',
    bodyKey: 'legal.usage.expensesBody',
  },
  {
    icon: 'checkbox-outline',
    titleKey: 'legal.usage.obligationsTitle',
    bodyKey: 'legal.usage.obligationsBody',
  },
  {
    icon: 'mail-outline',
    titleKey: 'legal.usage.invitationsTitle',
    bodyKey: 'legal.usage.invitationsBody',
  },
  {
    icon: 'settings-outline',
    titleKey: 'legal.usage.settingsTitle',
    bodyKey: 'legal.usage.settingsBody',
  },
  {
    icon: 'cloud-upload-outline',
    titleKey: 'legal.usage.backupTitle',
    bodyKey: 'legal.usage.backupBody',
  },
];
