# Google Play store listings (ASO)

Generated files for **Main store listing** translations.

## Files

- `play-console-listings.csv` — import / copy-paste helper (UTF-8 with BOM for Excel)
- `play-listings-data.mjs` — source of truth

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
- Hebrew locale code in Play is `iw-IL` (not `he`).
- Default / primary listing language is usually `en-US`.

## Length check

| Locale | Title | Short | Full |
| --- | ---: | ---: | ---: |
| en-US | 16 | 77 | 1206 |
| en-GB | 16 | 77 | 1197 |
| hr | 22 | 74 | 1066 |
| sr | 22 | 73 | 1049 |
| sq | 20 | 72 | 806 |
| bg | 21 | 68 | 750 |
| mk-MK | 24 | 68 | 728 |
| sl | 21 | 69 | 761 |
| de-DE | 20 | 75 | 797 |
| fr-FR | 16 | 77 | 873 |
| es-ES | 18 | 73 | 844 |
| es-419 | 18 | 73 | 835 |
| it-IT | 21 | 68 | 796 |
| pt-BR | 20 | 74 | 828 |
| pt-PT | 22 | 74 | 829 |
| nl-NL | 19 | 72 | 761 |
| pl-PL | 20 | 69 | 752 |
| cs-CZ | 20 | 68 | 723 |
| sk | 20 | 73 | 744 |
| hu-HU | 18 | 76 | 738 |
| ro | 23 | 76 | 796 |
| el-GR | 19 | 69 | 751 |
| tr-TR | 15 | 77 | 769 |
| ru-RU | 22 | 66 | 794 |
| uk | 18 | 75 | 787 |
| ar | 14 | 64 | 651 |
| iw-IL | 18 | 61 | 618 |
| fa | 16 | 68 | 697 |
| hi-IN | 19 | 71 | 721 |
| bn-BD | 20 | 74 | 619 |
| id | 19 | 77 | 768 |
| ms-MY | 19 | 75 | 783 |
| th | 26 | 62 | 582 |
| vi | 25 | 72 | 727 |
| ja-JP | 13 | 32 | 387 |
| ko-KR | 9 | 34 | 389 |
| zh-CN | 6 | 25 | 294 |
| da-DK | 17 | 77 | 680 |
| sv-SE | 17 | 71 | 685 |
| fi-FI | 19 | 76 | 706 |
| et | 18 | 70 | 692 |
| lv | 19 | 75 | 720 |
| lt | 18 | 78 | 770 |
