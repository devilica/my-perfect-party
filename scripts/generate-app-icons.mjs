import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const APP_ICON_SOURCE = path.join(ROOT, 'assets/images/app-icon.png');
const OUT_DIR = path.join(ROOT, 'assets/images');
const BG = '#FFF8F5';

async function writeIcon(sourceBuffer, filename, size, logoScale) {
  const logoSize = Math.round(size * logoScale);
  const logo = await sharp(sourceBuffer)
    .resize(logoSize, logoSize, { fit: 'contain', background: BG })
    .png()
    .toBuffer();

  const logoMeta = await sharp(logo).metadata();
  const left = Math.round((size - logoMeta.width) / 2);
  const top = Math.round((size - logoMeta.height) / 2);

  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .png()
    .toBuffer();

  await sharp(background)
    .composite([{ input: logo, left, top }])
    .png()
    .toFile(path.join(OUT_DIR, filename));

  console.log(`  ${filename} (${size}x${size}, scale ${Math.round(logoScale * 100)}%)`);
}

async function main() {
  console.log('Generating installed app icons from app-icon.png...\n');
  console.log('(splash-icon.png is not modified)\n');

  const sourceBuffer = await sharp(APP_ICON_SOURCE).png().toBuffer();

  await writeIcon(sourceBuffer, 'icon.png', 1024, 1);
  await writeIcon(sourceBuffer, 'adaptive-icon.png', 1024, 0.72);

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
