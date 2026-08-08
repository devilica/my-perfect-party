import fs from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..');
const en = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.json'), 'utf8'));

const APP = {
  id: 'Pesta Sempurna Saya',
  ms: 'Parti Sempurna Saya',
  th: 'ปาร์ตี้สมบูรณ์แบบของฉัน',
  vi: 'Bữa tiệc hoàn hảo của tôi',
  tr: 'Mükemmel Partim',
};

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function applyLocale(base, locale, appName) {
  const t = locale;
  const a = appName;
  base.app.name = a;
  base.app.tagline = t.appTagline;
  Object.assign(base.common, t.common);
  Object.assign(base.onboarding, t.onboarding);
  Object.assign(base.events, t.events);
  Object.assign(base.events.themes, t.eventThemes);
  Object.assign(base.tabs, t.tabs);
  Object.assign(base.overview, t.overview);
  Object.assign(base.invitation, t.invitation);
  Object.assign(base.invitation.defaults, t.invitationDefaults);
  Object.assign(base.invitation.months, t.invitationMonths);
  Object.assign(base.invitation.templates, t.invitationTemplates);
  Object.assign(base.guests, t.guests);
  Object.assign(base.guests.categories, t.guestCategories);
  Object.assign(base.guests.status, t.guestStatus);
  Object.assign(base.guests.filters, t.guestFilters);
  Object.assign(base.guests.sides, t.guestSides);
  Object.assign(base.guests.sort, t.guestSort);
  Object.assign(base.seating, t.seating);
  Object.assign(base.expenses, t.expenses);
  Object.assign(base.obligations, t.obligations);
  Object.assign(base.obligations.status, t.obligationStatus);
  for (const k of Object.keys(base.obligations.presets)) {
    Object.assign(base.obligations.presets[k], t.obligationPresets[k]);
  }
  Object.assign(base.categories, t.categories);
  Object.assign(base.charts, t.charts);
  Object.assign(base.settings, t.settings);
  base.settings.aboutText = t.settingsAboutText.replace(/\{\{APP\}\}/g, a);
  base.settings.supportEmailSubject = t.supportEmailSubject.replace(/\{\{APP\}\}/g, a);
  base.settings.reviewPromptMessage = t.reviewPromptMessage.replace(/\{\{APP\}\}/g, a);
  Object.assign(base.notifications, t.notifications);
  Object.assign(base.ads, t.ads);
  Object.assign(base.legal.privacy, t.legalPrivacy);
  base.legal.privacy.title = t.legalPrivacyTitle.replace(/\{\{APP\}\}/g, a);
  base.legal.privacy.intro = t.legalPrivacyIntro.replace(/\{\{APP\}\}/g, a);
  base.legal.privacy.localDataBody = t.legalPrivacyLocalDataBody.replace(/\{\{APP\}\}/g, a);
  base.legal.privacy.childrenBody = t.legalPrivacyChildrenBody.replace(/\{\{APP\}\}/g, a);
  Object.assign(base.legal.terms, t.legalTerms);
  base.legal.terms.title = t.legalTermsTitle.replace(/\{\{APP\}\}/g, a);
  base.legal.terms.intro = t.legalTermsIntro.replace(/\{\{APP\}\}/g, a);
  base.legal.terms.acceptanceBody = t.legalTermsAcceptanceBody.replace(/\{\{APP\}\}/g, a);
  base.legal.terms.serviceBody = t.legalTermsServiceBody.replace(/\{\{APP\}\}/g, a);
  base.legal.terms.liabilityBody = t.legalTermsLiabilityBody.replace(/\{\{APP\}\}/g, a);
  Object.assign(base.legal.ads, t.legalAds);
  base.legal.ads.title = t.legalAdsTitle.replace(/\{\{APP\}\}/g, a);
  base.legal.ads.intro = t.legalAdsIntro.replace(/\{\{APP\}\}/g, a);
  Object.assign(base.legal.usage, t.legalUsage);
  base.legal.usage.title = t.legalUsageTitle.replace(/\{\{APP\}\}/g, a);
  base.legal.usage.intro = t.legalUsageIntro.replace(/\{\{APP\}\}/g, a);
  return base;
}

const locales = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'locale-data-id-ms-th-vi-tr.json'), 'utf8'));

function countKeys(o) {
  return Object.entries(o).reduce(
    (n, [, v]) => (typeof v === 'object' && v !== null && !Array.isArray(v) ? n + countKeys(v) : n + 1),
    0,
  );
}

const enCount = countKeys(en);
for (const code of ['id', 'ms', 'th', 'vi', 'tr']) {
  const out = applyLocale(deepClone(en), locales[code], APP[code]);
  const outPath = path.join(root, 'locales', `${code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  const count = countKeys(out);
  const hint = out.seating.hallOverviewHint;
  if (!hint.startsWith('+') && !hint.includes('+/−') && !hint.includes('+/-') && !hint.includes('+ / −')) {
    console.warn(`${code}: hallOverviewHint may missing zoom prefix: ${hint.slice(0, 40)}`);
  }
  console.log(`${code}.json: ${count} keys ${count === enCount ? 'OK' : 'MISMATCH'}`);
}
