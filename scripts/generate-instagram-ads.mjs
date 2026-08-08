import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'marketing/instagram/sources');
const COMPOSITES_DIR = path.join(ROOT, 'marketing/instagram/composites');
const FEED_DIR = path.join(ROOT, 'marketing/instagram/feed');
const STORIES_DIR = path.join(ROOT, 'marketing/instagram/stories');
const CAPTIONS_FILE = path.join(ROOT, 'marketing/instagram/captions-sr.md');

const BRAND = {
  name: 'Moja savršena proslava',
  tagline: 'Slavi bez stresa',
  instagram: '@mojasavrsenaproslava',
  bgTop: '#FDF6F4',
  bgBottom: '#FCE8EC',
  accent: '#B45C68',
  accentDark: '#8B4650',
  text: '#2D2D2D',
  textMuted: '#7A6A6C',
  green: '#3D5A45',
  footerBar: '#8B4650',
};

const FEED = { w: 1080, h: 1350 };
const STORY = { w: 1080, h: 1920 };
const SAFE = 80;

const SCREENSHOTS = [
  {
    id: 'ss01-expenses-donut',
    file: 'ss01-expenses-donut.png',
    headline: 'Gdje odlazi novac?',
    headlineAccent: 'Vidi odmah.',
    subtitle: 'Budžet proslave — jasno i pregledno',
    bullets: ['Po kategorijama', 'Tvoj dio vs ukupno', 'Grafikon troškova'],
    caption: {
      hook: 'Gdje odlazi novac? Vidi odmah. 💰',
      body: 'Prati svaki trošak proslave po kategorijama — lokacija, hrana, muzika, fotografija i više. Vidi ukupan budžet i svoj dio na jednom mjestu, bez Excel tablica i haosa.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#budzet', '#troskovi', '#vencanje', '#planiranjevencanja', '#svadba', '#organizacija'],
  },
  {
    id: 'ss02-overview-countdown',
    file: 'ss02-overview-countdown.png',
    headline: 'Još 92 dana —',
    headlineAccent: 'sve pod kontrolom.',
    subtitle: 'Odbrojavanje, gosti i pozivnice',
    bullets: ['Countdown do proslave', 'Status pozivnica', '544 gostiju — pregledno'],
    caption: {
      hook: 'Još 92 dana do vašeg velikog dana! ⏳',
      body: 'Prati odbrojavanje, vidi koliko je pozivnica poslano, potvrđeno ili odbijeno — sve na jednom ekranu. Bez stresa, sa jasnom slikom.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#vencanje', '#countdown', '#rsvp', '#pozivnice', '#gosti', '#planiranje'],
  },
  {
    id: 'ss03-expenses-barchart',
    file: 'ss03-expenses-barchart.png',
    headline: 'Najveći troškovi',
    headlineAccent: 'na jednom mjestu.',
    subtitle: 'Grafikon + lista — sve jasno',
    bullets: ['Bar chart po kategorijama', 'Lista svih stavki', 'Brzo dodavanje troškova'],
    caption: {
      hook: 'Najveći troškovi? Na jednom mjestu. 📊',
      body: 'Vidi odmah koja kategorija najviše košta — lokacija, muzika, hrana. Svaki trošak na listi sa kategorijom i cijenom. Budžet pod kontrolom.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#budzet', '#troskovi', '#vencanje', '#planiranje', '#svadba', '#organizacija'],
  },
  {
    id: 'ss04-guests-status',
    file: 'ss04-guests-status.png',
    headline: '544 gosta?',
    headlineAccent: 'Nema problema.',
    subtitle: 'Lista gostiju sa statusom dolaska',
    bullets: ['Potvrđeno / Ne dolazi / Poslana', 'Kategorije i strane', 'Sto i posebni zahtjevi'],
    caption: {
      hook: '544 gosta? Nema problema. 👥',
      body: 'Svaki gost sa statusom — potvrđeno, ne dolazi, poslana pozivnica. Označi stranu, kategoriju, sto i posebne zahtjeve za meni. Sve na dlanu.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#gosti', '#rsvp', '#vencanje', '#listagostiju', '#svadba', '#organizacija'],
  },
  {
    id: 'ss05-seating-list',
    file: 'ss05-seating-list.png',
    headline: 'Sto 30 pun.',
    headlineAccent: 'Sto 31 slobodan.',
    subtitle: 'Raspored sjedenja po stolovima',
    bullets: ['Kapacitet po stolu', 'Gosti grupisani porodicom', 'Puni / Dostupni stolovi'],
    caption: {
      hook: 'Sto 30 pun. Sto 31 slobodan. 🪑',
      body: 'Organizuj raspored sjedenja bez glavobolje. Vidi koji sto je pun, koliko mjesta je slobodno i ko sjeda gdje — porodice zajedno.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#rasporedsjedenja', '#stolovi', '#vencanje', '#svadba', '#organizacija', '#gosti'],
  },
  {
    id: 'ss06-hall-overview',
    file: 'ss06-hall-overview.png',
    headline: 'Vidi salu',
    headlineAccent: 'kao na dlanu.',
    subtitle: 'Interaktivna mapa stolova',
    bullets: ['Zauzeto vs slobodno', 'Prevuci stolove', 'Zoom i pregled sale'],
    caption: {
      hook: 'Vidi salu kao na dlanu. 🏛️',
      body: 'Vizuelni pregled sale sa svim stolovima — crveno zauzeto, zeleno slobodno. Prevuci stolove, zumiraj i organizuj prostor kao profesionalac.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#rasporedsjedenja', '#mapasale', '#vencanje', '#stolovi', '#svadba', '#organizacija'],
  },
  {
    id: 'ss07-invitation-editor',
    file: 'ss07-invitation-editor.png',
    headline: 'Pozivnice',
    headlineAccent: 'za par minuta.',
    subtitle: 'Elegantne digitalne pozivnice',
    bullets: ['Više dizajna i okvira', 'Imena, datum, lokacija', 'Podijeli sa gostima'],
    caption: {
      hook: 'Pozivnice za par minuta. 💌',
      body: 'Kreiraj prekrasnu digitalnu pozivnicu — izaberi okvir, temu i unesi detalje. Ana i Marko, datum, lokacija — sve spremno za slanje gostima.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#pozivnice', '#vencanje', '#digitalnepozivnice', '#svadba', '#planiranje', '#organizacija'],
  },
  {
    id: 'ss08-guests-search',
    file: 'ss08-guests-search.png',
    headline: 'Nađi gosta',
    headlineAccent: 'za sekundu.',
    subtitle: 'Pretraga i filteri',
    bullets: ['Pretraži po imenu', 'Filteri i sortiranje', 'Brza promjena statusa'],
    caption: {
      hook: 'Nađi gosta za sekundu. 🔍',
      body: 'Pretraži goste po imenu, filtriraj po statusu i sortiraj listu. Promijeni status jednim dodirom — poslana pozivnica, potvrđeno, ne dolazi.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#gosti', '#rsvp', '#vencanje', '#listagostiju', '#organizacija', '#svadba'],
  },
  {
    id: 'ss09-obligations',
    file: 'ss09-obligations.png',
    headline: 'Ništa',
    headlineAccent: 'ne zaboravi.',
    subtitle: 'Obaveze sa rokovima',
    bullets: ['Predlošci za brzi start', 'Status: dogovoreno / nije', 'Datum i lokacija'],
    caption: {
      hook: 'Ništa ne zaboravi. ✅',
      body: 'Lista obaveza sa rokovima — proba haljine, matičar, restoran, fotograf. Dodaj predloške, prati status i završi sve na vrijeme.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#obaveze', '#checklist', '#vencanje', '#planiranje', '#svadba', '#organizacija'],
  },
  {
    id: 'ss10-dashboard-full',
    file: 'ss10-dashboard-full.png',
    headline: 'Sve na',
    headlineAccent: 'jednom mjestu.',
    subtitle: 'Gosti, stolovi, troškovi, obaveze',
    bullets: ['544 gostiju', '49 stolova', 'Budžet i obaveze'],
    caption: {
      hook: 'Sve na jednom mjestu. 📱',
      body: 'Pregled cijele proslave — koliko gostiju potvrđeno, koliko stolova popunjeno, budžet i obaveze. Jedan ekran, potpuna kontrola.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#vencanje', '#planiranje', '#organizacija', '#svadba', '#dashboard', '#gosti'],
  },
  {
    id: 'ss11-expenses-shared',
    file: 'ss11-expenses-shared.png',
    headline: 'Ko plaća šta?',
    headlineAccent: 'Jasno.',
    subtitle: 'Troškovi koje pokrivaju drugi',
    bullets: ['Pokriva: kumovi, roditelji…', 'Tvoj trošak vs pokriveno', 'Pregled po stavkama'],
    caption: {
      hook: 'Ko plaća šta? Jasno. 🎁',
      body: 'Označi ko pokriva koji trošak — kumovi, majka mlade, roditelji. Vidi koliko si ti platila, a koliko je pokriveno od drugih.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#budzet', '#troskovi', '#vencanje', '#svadba', '#planiranje', '#organizacija'],
  },
  {
    id: 'ss12-events-home',
    file: 'ss12-events-home.png',
    headline: 'Vjenčanje, rođendan,',
    headlineAccent: 'djevojačko…',
    subtitle: 'Više događaja — jedna aplikacija',
    bullets: ['Vjenčanje, rođendani, proslave', 'Svaki događaj posebno', 'Sve na jednom mjestu'],
    caption: {
      hook: 'Vjenčanje, rođendan, djevojačko… 🎉',
      body: 'Planiraj više proslava u jednoj aplikaciji. Vjenčanje Ana & Marko, rođendan Nikole, Nina\'s 18th — svaki događaj sa svojim gostima, stolovima i budžetom.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#proslave', '#vencanje', '#rodjendan', '#organizacija', '#planiranje', '#aplikacija'],
  },
];

const COMPOSITE_PANELS = [
  {
    slide: 1,
    message: 'Organizuj savršenu proslavu bez stresa — sve funkcije',
    caption: {
      hook: 'Organizuj savršenu proslavu bez stresa! 🎊',
      body: 'Gosti, raspored stolova, troškovi, obaveze i statistike — sve u jednoj aplikaciji. Od malih okupljanja do velikih proslava.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#proslave', '#organizacija', '#vencanje', '#aplikacija', '#planiranje', '#svadba'],
  },
  {
    slide: 2,
    message: 'Zaboravi haos — gosti, stolovi, troškovi, obaveze',
    caption: {
      hook: 'Zaboravi na haos. Organizuj sve na jednom mjestu! ✨',
      body: 'Lista gostiju sa potvrdom dolaska, raspored sjedenja, evidencija troškova, lista obaveza i pregled u realnom vremenu. Ti uživaj, mi pomažemo.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#organizacija', '#vencanje', '#gosti', '#planiranje', '#svadba', '#aplikacija'],
  },
  {
    slide: 3,
    message: 'Tvoj lični planer — mapa sale',
    caption: {
      hook: 'Tvoj lični planer za svaki događaj! 📋',
      body: 'Prati goste, organizuj stolove, kontroliši budžet, vodi obaveze i prati napredak kroz statistike. Sve na jednom mjestu. Jednostavno. Brzo. Bez stresa.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#planer', '#organizacija', '#vencanje', '#stolovi', '#svadba', '#aplikacija'],
  },
  {
    slide: 4,
    message: 'Potpuna kontrola nad svakim detaljem',
    caption: {
      hook: 'Potpuna kontrola nad svakim detaljem! 🎯',
      body: 'Gosti, stolovi, troškovi, obaveze i statistike — povezani u jednu aplikaciju. Planiraj pametnije, uživaj više.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#organizacija', '#vencanje', '#planiranje', '#svadba', '#kontrola', '#aplikacija'],
  },
  {
    slide: 5,
    message: 'Najlepši Trenuci zaslužuju savršenu organizaciju',
    fixTrenuci: true,
    caption: {
      hook: 'Najlepši Trenuci zaslužuju savršenu organizaciju! 💍',
      body: 'Organizuj goste, isplaniraj raspored stolova, prati troškove, završi obaveze na vrijeme. Ti uživaj u slavlju, aplikacija vodi računa o organizaciji.',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#trenuci', '#vencanje', '#organizacija', '#svadba', '#planiranje', '#ljubav'],
  },
  {
    slide: 6,
    message: 'Preuzmi aplikaciju — jednostavno, pregledno, sve na jednom mjestu',
    caption: {
      hook: 'Preuzmi aplikaciju i organizuj bez brige! 📲',
      body: 'Jednostavna za korišćenje, pregledna i intuitivna. Sve što ti treba — na jednom mjestu. Tvoj događaj, tvoja priča!',
      cta: 'Preuzmi besplatno — link u bio 👆',
    },
    tags: ['#aplikacija', '#googleplay', '#organizacija', '#proslave', '#vencanje', '#planiranje'],
  },
];

const COMMON_TAGS = [
  '#mojasavrsenaproslava',
  '#slabibezstresa',
  '#organizacijaproslava',
  '#planiranjeproslava',
  '#bosna',
  '#srbija',
  '#hrvatska',
  '#crnagora',
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function ensureDirs() {
  await fs.mkdir(COMPOSITES_DIR, { recursive: true });
  await fs.mkdir(FEED_DIR, { recursive: true });
  await fs.mkdir(STORIES_DIR, { recursive: true });
}

async function createGradientBg(width, height) {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${BRAND.bgTop}"/>
        <stop offset="100%" stop-color="${BRAND.bgBottom}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <circle cx="${width * 0.85}" cy="${height * 0.12}" r="120" fill="${BRAND.accent}" opacity="0.06"/>
    <circle cx="${width * 0.15}" cy="${height * 0.75}" r="160" fill="${BRAND.accent}" opacity="0.05"/>
    <circle cx="${width * 0.7}" cy="${height * 0.85}" r="90" fill="${BRAND.accent}" opacity="0.04"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

function buildStoryBars(width) {
  const header = `<svg width="${width}" height="120" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${BRAND.bgTop}" opacity="0.95"/>
    <text x="540" y="52" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="${BRAND.text}">${escapeXml(BRAND.name)}</text>
    <text x="540" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="${BRAND.accent}">${escapeXml(BRAND.tagline)}</text>
  </svg>`;

  const footer = `<svg width="${width}" height="180" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${BRAND.footerBar}"/>
    <text x="540" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#FFFFFF">Preuzmi besplatno</text>
    <text x="540" y="108" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#FFFFFF" opacity="0.9">Link u bio · Google Play</text>
    <text x="540" y="148" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#FFFFFF" opacity="0.85">${escapeXml(BRAND.instagram)}</text>
  </svg>`;

  return { header, footer };
}

async function fitImageContain(inputBuffer, maxW, maxH) {
  const meta = await sharp(inputBuffer).metadata();
  const scale = Math.min(maxW / meta.width, maxH / meta.height);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  return sharp(inputBuffer).resize(w, h, { fit: 'inside' }).png().toBuffer();
}

async function createPhoneFrame(screenshotBuffer, phoneW, phoneH) {
  const padding = 14;
  const screenW = phoneW - padding * 2;
  const screenH = phoneH - padding * 2;
  const fitted = await fitImageContain(screenshotBuffer, screenW, screenH);
  const fittedMeta = await sharp(fitted).metadata();

  const offsetX = padding + Math.round((screenW - fittedMeta.width) / 2);
  const offsetY = padding + Math.round((screenH - fittedMeta.height) / 2);

  const frameSvg = `<svg width="${phoneW}" height="${phoneH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect x="0" y="0" width="${phoneW}" height="${phoneH}" rx="36" ry="36" fill="#1A1A1A" filter="url(#shadow)"/>
    <rect x="${padding}" y="${padding}" width="${screenW}" height="${screenH}" rx="4" ry="4" fill="#FFFFFF"/>
  </svg>`;

  const frame = await sharp(Buffer.from(frameSvg)).png().toBuffer();

  return sharp(frame)
    .composite([{ input: fitted, left: offsetX, top: offsetY }])
    .png()
    .toBuffer();
}

function buildScreenshotOverlay({ width, height, headline, headlineAccent, subtitle, bullets, isStory }) {
  const headlineY = isStory ? 200 : 130;
  const subtitleY = isStory ? 290 : 210;
  const bulletStartY = isStory ? height - 320 : height - 280;
  const ctaY = isStory ? height - 200 : height - 160;

  const bulletLines = bullets
    .map(
      (b, i) =>
        `<text x="${SAFE + 20}" y="${bulletStartY + i * 36}" font-family="Arial, sans-serif" font-size="24" fill="${BRAND.text}">• ${escapeXml(b)}</text>`
    )
    .join('\n');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <text x="${SAFE}" y="${headlineY}" font-family="Georgia, serif" font-size="42" font-weight="700" fill="${BRAND.text}">${escapeXml(headline)}</text>
    <text x="${SAFE}" y="${headlineY + 52}" font-family="Georgia, serif" font-size="42" font-weight="700" fill="${BRAND.accent}">${escapeXml(headlineAccent)}</text>
    <text x="${SAFE}" y="${subtitleY}" font-family="Arial, sans-serif" font-size="24" fill="${BRAND.textMuted}">${escapeXml(subtitle)}</text>
    ${bulletLines}
    <rect x="${SAFE}" y="${ctaY - 36}" width="340" height="64" rx="32" fill="#1A1A1A"/>
    <text x="${SAFE + 28}" y="${ctaY + 4}" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#FFFFFF">PREUZMI NA</text>
    <text x="${SAFE + 28}" y="${ctaY + 28}" font-family="Arial, sans-serif" font-size="16" fill="#FFFFFF" opacity="0.85">Google Play</text>
    <text x="${width - SAFE}" y="${ctaY + 8}" text-anchor="end" font-family="Arial, sans-serif" font-size="20" fill="${BRAND.accent}">${escapeXml(BRAND.tagline)}</text>
    <text x="${width - SAFE}" y="${ctaY + 36}" text-anchor="end" font-family="Georgia, serif" font-size="22" font-weight="600" fill="${BRAND.text}">${escapeXml(BRAND.name)}</text>
  </svg>`;
}

async function generateScreenshotAd(screenshot, format) {
  const isStory = format === 'story';
  const canvas = isStory ? STORY : FEED;
  const screenshotPath = path.join(SRC, screenshot.file);
  const screenshotBuffer = await fs.readFile(screenshotPath);

  const headerH = isStory ? 120 : 0;
  const footerH = isStory ? 180 : 0;
  const contentTop = headerH + (isStory ? 100 : 240);
  const contentBottom = canvas.h - footerH - (isStory ? 340 : 300);
  const contentH = contentBottom - contentTop;
  const contentW = canvas.w - SAFE * 2;

  const phoneAspect = 472 / 1024;
  let phoneH = contentH;
  let phoneW = Math.round(phoneH * phoneAspect);
  if (phoneW > contentW) {
    phoneW = contentW;
    phoneH = Math.round(phoneW / phoneAspect);
  }

  const phone = await createPhoneFrame(screenshotBuffer, phoneW, phoneH);
  const phoneX = Math.round((canvas.w - phoneW) / 2);
  const phoneY = contentTop + Math.round((contentH - phoneH) / 2);

  const bg = await createGradientBg(canvas.w, canvas.h);
  const overlaySvg = buildScreenshotOverlay({
    width: canvas.w,
    height: canvas.h,
    headline: screenshot.headline,
    headlineAccent: screenshot.headlineAccent,
    subtitle: screenshot.subtitle,
    bullets: screenshot.bullets,
    isStory,
  });

  const composites = [
    { input: Buffer.from(overlaySvg), top: 0, left: 0 },
    { input: phone, top: phoneY, left: phoneX },
  ];

  if (isStory) {
    const bars = buildStoryBars(canvas.w);
    composites.unshift({ input: Buffer.from(bars.header), top: 0, left: 0 });
    composites.push({ input: Buffer.from(bars.footer), top: canvas.h - footerH, left: 0 });
  }

  const outDir = isStory ? STORIES_DIR : FEED_DIR;
  const outPath = path.join(outDir, `${screenshot.id}.png`);

  await sharp(bg).composite(composites).png().toFile(outPath);
  return outPath;
}

async function splitCompositePanels(version) {
  const srcPath = path.join(SRC, `composite-${version}.png`);
  const img = sharp(srcPath);
  const meta = await img.metadata();
  const COLS = 3;
  const ROWS = 2;
  const cellW = Math.floor(meta.width / COLS);
  const cellH = Math.floor(meta.height / ROWS);

  const panels = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const slide = row * COLS + col + 1;
      let panel = await img
        .clone()
        .extract({
          left: col * cellW,
          top: row * cellH,
          width: cellW,
          height: cellH,
        })
        .png()
        .toBuffer();

      if (slide === 5) {
        panel = await applyTrenuciFix(panel, cellW, cellH);
      }

      const outPath = path.join(COMPOSITES_DIR, `${version}-slide-${String(slide).padStart(2, '0')}.png`);
      await sharp(panel).toFile(outPath);
      panels.push({ version, slide, path: outPath, buffer: panel });
    }
  }
  return panels;
}

async function applyTrenuciFix(panelBuffer, width, height) {
  const overlaySvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${width}" height="${Math.round(height * 0.14)}" fill="${BRAND.bgTop}"/>
    <text x="${Math.round(width * 0.06)}" y="${Math.round(height * 0.07)}" font-family="Georgia, serif" font-size="${Math.round(width * 0.075)}" font-weight="700" fill="${BRAND.text}">NAJLEPŠI</text>
    <text x="${Math.round(width * 0.06)}" y="${Math.round(height * 0.115)}" font-family="Georgia, serif" font-size="${Math.round(width * 0.075)}" font-weight="700" fill="${BRAND.text}">TRENUCI</text>
    <text x="${Math.round(width * 0.06)}" y="${Math.round(height * 0.135)}" font-family="Georgia, serif" font-size="${Math.round(width * 0.048)}" font-style="italic" fill="${BRAND.accent}">zaslužuju savršenu</text>
    <text x="${Math.round(width * 0.06)}" y="${Math.round(height * 0.155)}" font-family="Georgia, serif" font-size="${Math.round(width * 0.048)}" font-style="italic" fill="${BRAND.accent}">organizaciju!</text>
  </svg>`;

  return sharp(panelBuffer)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .png()
    .toBuffer();
}

async function generateCompositeAd(panelBuffer, version, slide, format) {
  const isStory = format === 'story';
  const canvas = isStory ? STORY : FEED;

  const headerH = isStory ? 120 : 0;
  const footerH = isStory ? 180 : 0;
  const pad = SAFE;
  const maxW = canvas.w - pad * 2;
  const maxH = canvas.h - headerH - footerH - pad * 2;

  const fitted = await fitImageContain(panelBuffer, maxW, maxH);
  const fittedMeta = await sharp(fitted).metadata();
  const x = Math.round((canvas.w - fittedMeta.width) / 2);
  const y = headerH + pad + Math.round((maxH - fittedMeta.height) / 2);

  const bg = await createGradientBg(canvas.w, canvas.h);
  const composites = [{ input: fitted, top: y, left: x }];

  if (isStory) {
    const bars = buildStoryBars(canvas.w);
    composites.unshift({ input: Buffer.from(bars.header), top: 0, left: 0 });
    composites.push({ input: Buffer.from(bars.footer), top: canvas.h - footerH, left: 0 });
  }

  const outDir = isStory ? STORIES_DIR : FEED_DIR;
  const outPath = path.join(outDir, `composite-${version}-slide-${String(slide).padStart(2, '0')}.png`);

  await sharp(bg).composite(composites).png().toFile(outPath);
  return outPath;
}

function buildCaptionsMarkdown() {
  const lines = [
    '# Instagram captions — Moja savršena proslava',
    '',
    '> Jezik: srpski (ijekavica). Reč **Trenuci** (ne Trenutci).',
    '',
    '---',
    '',
    '## Screenshot reklame (12)',
    '',
  ];

  for (const ss of SCREENSHOTS) {
    const allTags = [...new Set([...ss.tags, ...COMMON_TAGS])].slice(0, 15);
    lines.push(`### ${ss.id}`);
    lines.push('');
    lines.push(`**Feed:** \`feed/${ss.id}.png\`  ·  **Story:** \`stories/${ss.id}.png\``);
    lines.push('');
    lines.push('```');
    lines.push(ss.caption.hook);
    lines.push('');
    lines.push(ss.caption.body);
    lines.push('');
    lines.push(ss.caption.cta);
    lines.push('');
    lines.push(allTags.join(' '));
    lines.push('```');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Composite reklame (18 — v1, v2, v3 × 6 panela)');
  lines.push('');

  for (const version of ['v1', 'v2', 'v3']) {
    lines.push(`### Verzija ${version.toUpperCase()}`);
    lines.push('');

    for (const panel of COMPOSITE_PANELS) {
      const slug = `composite-${version}-slide-${String(panel.slide).padStart(2, '0')}`;
      const allTags = [...new Set([...panel.tags, ...COMMON_TAGS])].slice(0, 15);
      lines.push(`#### ${slug}`);
      lines.push('');
      lines.push(`**Feed:** \`feed/${slug}.png\`  ·  **Story:** \`stories/${slug}.png\``);
      lines.push('');
      lines.push(`*Poruka:* ${panel.message}`);
      lines.push('');
      lines.push('```');
      lines.push(panel.caption.hook);
      lines.push('');
      lines.push(panel.caption.body);
      lines.push('');
      lines.push(panel.caption.cta);
      lines.push('');
      lines.push(allTags.join(' '));
      lines.push('```');
      lines.push('');
    }
  }

  return lines.join('\n');
}

async function verifyDimensions(dir, expectedW, expectedH) {
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.png'));
  const errors = [];
  for (const file of files) {
    const meta = await sharp(path.join(dir, file)).metadata();
    if (meta.width !== expectedW || meta.height !== expectedH) {
      errors.push(`${file}: ${meta.width}x${meta.height} (expected ${expectedW}x${expectedH})`);
    }
  }
  return errors;
}

async function main() {
  console.log('Generating Instagram ads...\n');
  await ensureDirs();

  console.log('1/4 Splitting composite panels...');
  const allPanels = [];
  for (const version of ['v1', 'v2', 'v3']) {
    const panels = await splitCompositePanels(version);
    allPanels.push(...panels);
    console.log(`  ${version}: 6 panels extracted`);
  }

  console.log('\n2/4 Generating screenshot ads...');
  for (const ss of SCREENSHOTS) {
    await generateScreenshotAd(ss, 'feed');
    await generateScreenshotAd(ss, 'story');
    console.log(`  ${ss.id}`);
  }

  console.log('\n3/4 Generating composite ads...');
  for (const panel of allPanels) {
    await generateCompositeAd(panel.buffer, panel.version, panel.slide, 'feed');
    await generateCompositeAd(panel.buffer, panel.version, panel.slide, 'story');
    console.log(`  ${panel.version}-slide-${String(panel.slide).padStart(2, '0')}`);
  }

  console.log('\n4/4 Writing captions...');
  await fs.writeFile(CAPTIONS_FILE, buildCaptionsMarkdown(), 'utf8');

  console.log('\nVerifying dimensions...');
  const feedErrors = await verifyDimensions(FEED_DIR, FEED.w, FEED.h);
  const storyErrors = await verifyDimensions(STORIES_DIR, STORY.w, STORY.h);

  if (feedErrors.length) {
    console.warn('Feed dimension warnings:', feedErrors);
  }
  if (storyErrors.length) {
    console.warn('Story dimension warnings:', storyErrors);
  }

  const feedCount = (await fs.readdir(FEED_DIR)).filter((f) => f.endsWith('.png')).length;
  const storyCount = (await fs.readdir(STORIES_DIR)).filter((f) => f.endsWith('.png')).length;

  console.log(`\nDone!`);
  console.log(`  Feed:    ${feedCount} images (${FEED.w}x${FEED.h})`);
  console.log(`  Stories: ${storyCount} images (${STORY.w}x${STORY.h})`);
  console.log(`  Captions: ${CAPTIONS_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
