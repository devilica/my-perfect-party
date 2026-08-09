/**
 * Sync Android launcher + splash from assets/images/icon.png — no expo prebuild.
 * Preserves transparency on adaptive foreground / splash logo.
 *
 * Usage: npm run assets:android-icons
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const RES = path.join(ROOT, 'android/app/src/main/res');
const ASSETS = path.join(ROOT, 'assets/images');
const ICON = path.join(ASSETS, 'icon.png');
const ADAPTIVE = path.join(ASSETS, 'adaptive-icon.png');
const SPLASH_ASSET = path.join(ASSETS, 'splash-icon.png');
const BG = '#FFF8F4';

const FOREGROUND = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432,
};

const LEGACY = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const SPLASH_LOGO = {
  'drawable-mdpi': 288,
  'drawable-hdpi': 432,
  'drawable-xhdpi': 576,
  'drawable-xxhdpi': 864,
  'drawable-xxxhdpi': 1152,
};

async function writeWebp(buffer, outPath) {
  await sharp(buffer).webp({ quality: 90, alphaQuality: 100 }).toFile(outPath);
  console.log(`  ${path.relative(ROOT, outPath)}`);
}

async function writePng(buffer, outPath) {
  await sharp(buffer).png().toFile(outPath);
  console.log(`  ${path.relative(ROOT, outPath)}`);
}

/** Resize keeping transparency (no background fill). */
async function resizeContainTransparent(sourcePath, size) {
  return sharp(sourcePath)
    .ensureAlpha()
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function writeAdaptiveAsset() {
  // Adaptive foreground asset: icon scaled into safe zone, transparency kept.
  const size = 1024;
  const logoSize = Math.round(size * 0.72);
  const logo = await sharp(ICON)
    .ensureAlpha()
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const canvas = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .toBuffer();

  await sharp(canvas)
    .composite([{ input: logo, gravity: 'centre' }])
    .png()
    .toFile(ADAPTIVE);

  console.log(`  ${path.relative(ROOT, ADAPTIVE)} (1024, transparent, 72% safe zone)`);
}

async function main() {
  if (!fs.existsSync(ICON)) {
    throw new Error(`Missing source: ${path.relative(ROOT, ICON)}`);
  }

  const iconStat = fs.statSync(ICON);
  console.log(
    `Source icon.png — ${iconStat.size} bytes, modified ${iconStat.mtime.toISOString()}\n`
  );
  console.log('Regenerating from assets/images/icon.png...\n');

  await writeAdaptiveAsset();

  // Expo splash asset: transparent logo (native splash bg color is separate).
  await sharp(ICON)
    .ensureAlpha()
    .resize(1024, 1024, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(SPLASH_ASSET);
  console.log(`  ${path.relative(ROOT, SPLASH_ASSET)} (1024, transparent)`);

  console.log('\nAndroid mipmaps:');
  for (const [folder, size] of Object.entries(FOREGROUND)) {
    const dir = path.join(RES, folder);
    fs.mkdirSync(dir, { recursive: true });
    // Foreground layer must keep alpha — background color comes from colors.xml
    const fg = await resizeContainTransparent(ADAPTIVE, size);
    await writeWebp(fg, path.join(dir, 'ic_launcher_foreground.webp'));
  }

  for (const [folder, size] of Object.entries(LEGACY)) {
    const dir = path.join(RES, folder);
    // Same transparent artwork as the app icon (no baked cream background).
    const full = await resizeContainTransparent(ICON, size);
    await writeWebp(full, path.join(dir, 'ic_launcher.webp'));
    await writeWebp(full, path.join(dir, 'ic_launcher_round.webp'));
  }

  console.log('\nAndroid splash logos:');
  for (const [folder, size] of Object.entries(SPLASH_LOGO)) {
    const dir = path.join(RES, folder);
    fs.mkdirSync(dir, { recursive: true });
    // Transparent logo; windowSplashScreenBackground supplies cream
    const logo = await resizeContainTransparent(ICON, size);
    await writePng(logo, path.join(dir, 'splashscreen_logo.png'));
  }

  const colorsPath = path.join(RES, 'values/colors.xml');
  if (fs.existsSync(colorsPath)) {
    const colors = fs.readFileSync(colorsPath, 'utf8');
    const next = colors
      .replace(
        /<color name="iconBackground">#[0-9A-Fa-f]+<\/color>/,
        `<color name="iconBackground">${BG}</color>`
      )
      .replace(
        /<color name="splashscreen_background">#[0-9A-Fa-f]+<\/color>/,
        `<color name="splashscreen_background">${BG}</color>`
      );
    if (next !== colors) {
      fs.writeFileSync(colorsPath, next);
      console.log(`\n  Updated ${path.relative(ROOT, colorsPath)} → ${BG}`);
    }
  }

  console.log('\nDone.');
  console.log('If Cursor still shows old previews: close the image tab and reopen the file.');
  console.log('Then commit android + assets changes and rebuild AAB.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
