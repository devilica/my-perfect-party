export const GOOGLE_ADS_PRIVACY_URL = 'https://policies.google.com/technologies/partner-sites';

export type LegalSection = {
  titleKey: string;
  bodyKey: string;
  linkKey?: string;
  linkUrl?: string;
};

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    titleKey: 'legal.privacy.localDataTitle',
    bodyKey: 'legal.privacy.localDataBody',
  },
  {
    titleKey: 'legal.privacy.adsTitle',
    bodyKey: 'legal.privacy.adsBody',
    linkKey: 'legal.privacy.adsLink',
    linkUrl: GOOGLE_ADS_PRIVACY_URL,
  },
  {
    titleKey: 'legal.privacy.sharingTitle',
    bodyKey: 'legal.privacy.sharingBody',
  },
  {
    titleKey: 'legal.privacy.childrenTitle',
    bodyKey: 'legal.privacy.childrenBody',
  },
  {
    titleKey: 'legal.privacy.contactTitle',
    bodyKey: 'legal.privacy.contactBody',
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    titleKey: 'legal.terms.acceptanceTitle',
    bodyKey: 'legal.terms.acceptanceBody',
  },
  {
    titleKey: 'legal.terms.serviceTitle',
    bodyKey: 'legal.terms.serviceBody',
  },
  {
    titleKey: 'legal.terms.accountTitle',
    bodyKey: 'legal.terms.accountBody',
  },
  {
    titleKey: 'legal.terms.userContentTitle',
    bodyKey: 'legal.terms.userContentBody',
  },
  {
    titleKey: 'legal.terms.backupTitle',
    bodyKey: 'legal.terms.backupBody',
  },
  {
    titleKey: 'legal.terms.adsTitle',
    bodyKey: 'legal.terms.adsBody',
    linkKey: 'legal.terms.adsLink',
    linkUrl: GOOGLE_ADS_PRIVACY_URL,
  },
  {
    titleKey: 'legal.terms.notificationsTitle',
    bodyKey: 'legal.terms.notificationsBody',
  },
  {
    titleKey: 'legal.terms.availabilityTitle',
    bodyKey: 'legal.terms.availabilityBody',
  },
  {
    titleKey: 'legal.terms.liabilityTitle',
    bodyKey: 'legal.terms.liabilityBody',
  },
  {
    titleKey: 'legal.terms.contactTitle',
    bodyKey: 'legal.terms.contactBody',
  },
];
