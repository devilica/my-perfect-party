import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { playListings, validatePlayListings } from './play-listings-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function csvEscape(value) {
  const s = String(value).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return `"${s.replace(/"/g, '""')}"`;
}

const issues = validatePlayListings();
if (issues.length) {
  console.error('Character limit issues:\n' + issues.join('\n'));
  process.exit(1);
}

const header = ['Locale', 'Language', 'Title', 'Short description', 'Full description'];
const rows = playListings.map((e) =>
  [e.locale, e.language, e.title, e.short, e.full].map(csvEscape).join(',')
);

const csv = `\uFEFF${header.join(',')}\n${rows.join('\n')}\n`;
const csvPath = path.join(__dirname, 'play-console-listings.csv');
fs.writeFileSync(csvPath, csv, 'utf8');

const mdRows = playListings
  .map(
    (e) =>
      `| ${e.locale} | ${[...e.title].length} | ${[...e.short].length} | ${[...e.full].length} |`
  )
  .join('\n');

const readme = `# Google Play store listings (ASO)

Generated files for **Main store listing** translations.

## Files

- \`play-console-listings.csv\` — import / copy-paste helper (UTF-8 with BOM for Excel)
- \`play-listings-data.mjs\` — source of truth

## Limits (Play Console)

| Field | Max |
| --- | --- |
| Title (App name) | **30–50** (brand only) |
| Short description | **80** characters |
| Full description | **4000** characters |

> Titles: **My Perfect Party** (EN), **Moja savršena proslava** (HR/SR), localized brand elsewhere. ASO keywords stay in short/full description.

## How to use in Play Console

1. Open **Grow users → Store presence → Main store listing**
2. **Manage translations → Select languages** — add the locales from the CSV
3. For each language, paste **Title**, **Short description**, and **Full description** from the CSV (or open CSV in Excel / Google Sheets)
4. Save / submit for review

There is no official bulk “titles only” import for all languages in one click for every account; CSV is the working sheet. If your Console shows **Upload translations / Gemini localization**, use the same columns: Locale, Title, Short description, Full description.

## Notes

- **Bosnian (bs)** is not a separate Play listing language — use **Croatian (hr)** and/or **Serbian (sr)** for the region.
- Hebrew locale code in Play is \`iw-IL\` (not \`he\`).
- Default / primary listing language is usually \`en-US\`.

## Length check

| Locale | Title | Short | Full |
| --- | ---: | ---: | ---: |
${mdRows}
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), readme, 'utf8');
console.log(`Wrote ${playListings.length} locales → ${csvPath}`);
