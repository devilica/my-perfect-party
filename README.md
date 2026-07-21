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
- [Expo Go](https://expo.dev/go) on your phone (optional)

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

**Android with Expo Go:** Open the Expo Go app on your phone (SDK 54), then scan the QR code from the terminal. Pressing `a` does not work with `--offline` — use QR scan instead.

Scan the QR code with Expo Go (mobile) or press `w` for web.

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

- Expo SDK 54 + Expo Router
- TypeScript
- Zustand + AsyncStorage
- react-native-gifted-charts
- expo-localization, expo-haptics

## Data Privacy

All events, guests, and expenses are stored locally on your device. Nothing is sent to a server.

## License

Private project.
