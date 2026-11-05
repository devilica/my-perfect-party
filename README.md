# Wedding Planner BH

A local-first wedding planner app for Bosnia and Herzegovina, built with **Expo** and **React Native**. Plan multiple wedding events, track guest RSVPs, manage expenses (without currency symbols), and view spending charts — all stored on your device.

## Features

- **Multi-event support** — manage several weddings/events in one app
- **Guest list & RSVP** — tap to confirm who is coming
- **Expense tracking** — categories (music, food, photography, etc.) with optional custom categories
- **Payer attribution** — mark expenses covered by someone else (parents, kum, etc.)
- **Charts** — pie and bar charts for expense breakdown by category
- **Languages** — Bosnian / Serbian / Croatian (BS) and English (EN)
- **Offline & local** — no database, no account; data saved with AsyncStorage

## Platforms

- iOS
- Android
- Web

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Expo Go for SDK 57](https://expo.dev/go?sdkVersion=57) on your phone (optional; must match project SDK)

### Install

If you encounter SSL certificate errors on Windows, run:

```bash
npm install --strict-ssl=false
```

Otherwise:

```bash
npm install
```

### Run

Scripts use `--offline` because Expo's online dependency check can fail on some Windows/network setups (SSL/proxy issues).

```bash
# Start dev server
npm start

# Or target a platform
npm run ios
npm run android
npm run web
```

### Expo Go (SDK 57)

This project uses **Expo SDK 57**. The Play Store Expo Go app is often **SDK 58**, which shows “Project is incompatible”. Use a matching client:

**Android**

1. Uninstall Expo Go from the Play Store (SDK 58).
2. On your PC, open [expo.dev/go?sdkVersion=57](https://expo.dev/go?sdkVersion=57) and install the **SDK 57 Android APK** on your phone.
3. Run `npm start` and scan the QR code with that Expo Go build.

Pressing `a` does not work with `--offline` — use QR scan instead.

**Keep SDK 57 Expo Go**

- Turn off **auto-update** for Expo Go in the Play Store (or avoid updating it). An update usually installs SDK 58 and breaks this project until you reinstall the SDK 57 APK from the link above.

**Limits**

- Some native features (e.g. Google Mobile Ads) may not work in Expo Go. Use an EAS preview/production APK (`npm run build:apk`) for full behavior.

**Other platforms**

- Scan the QR code with Expo Go (mobile) or press `w` for web.
- iOS: sideloading older Expo Go builds is awkward; use a development build from EAS if you need device testing without Android.

## Native Android (`android/` folder)

The **`android/`** directory is **committed** on purpose. Release APK/AAB builds (EAS) and local Gradle work use this native project together with [`app.json`](app.json) config plugins (AdMob, splash, media permissions, etc.).

You **do not** need `prebuild` for normal JS/TS changes — `npm start` and EAS builds pick up app code from Metro.

### When to run `npx expo prebuild` (you run it manually)

Regenerate or refresh native Android files after changes that affect the native layer, for example:

- Bumping **Expo SDK** or major versions of native modules (`react-native-google-mobile-ads`, `expo-notifications`, …)
- Adding, removing, or changing entries under **`app.json` → `plugins`**
- Changing **`app.json` → `android`** (package name, `versionCode`, permissions-related config, adaptive icon paths)
- Adding or editing files in **`plugins/`** (e.g. [`withRemoveMediaReadPermissions.js`](plugins/withRemoveMediaReadPermissions.js))
- After pulling git changes that **modified `android/`** and your local build fails with manifest/Gradle mismatches

Typical workflow when prebuild is needed:

```bash
# Review git diff afterward — android/ is tracked
npx expo prebuild --platform android --clean
```

Use **`--clean`** when plugins or SDK changed a lot; omit it for a lighter regen if you know what changed.

Then rebuild the installable app (when you are ready):

```bash
npm run build:apk        # EAS preview
npm run build:apk:prod   # EAS production AAB/APK
```

**Expo Go** does not use this folder; only dev clients and store builds do.

## Project Structure

```
app/                 # Expo Router screens
  event/[id]/        # Event tabs: overview, guests, expenses
  modals/            # Add event, guest, expense modals
  settings.tsx       # Language settings
components/          # Reusable UI components
store/               # Zustand store with persistence
locales/             # BS and EN translations
lib/                 # i18n and expense stats helpers
theme/               # Colors and spacing
```

## Tech Stack

- Expo SDK 57 + Expo Router
- TypeScript
- Zustand + AsyncStorage
- react-native-gifted-charts
- expo-localization, expo-haptics

## Data Privacy

All events, guests, and expenses are stored locally on your device. Nothing is sent to a server.

## License

Private project.
