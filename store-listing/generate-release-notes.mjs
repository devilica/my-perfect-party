import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { releaseNotes, validateReleaseNotes } from './release-notes-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const issues = validateReleaseNotes();
if (issues.length) {
  console.error('Character limit issues:\n' + issues.join('\n'));
  process.exit(1);
}

const blocks = Object.entries(releaseNotes)
  .map(([locale, text]) => `<${locale}>\n${text.trim()}\n</${locale}>`)
  .join('\n\n');

const xml = `${blocks}\n`;
const outPath = path.join(__dirname, 'release-notes.xml');
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`Wrote ${Object.keys(releaseNotes).length} locales → ${outPath}`);
