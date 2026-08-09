# 拾字 Shízì — HSK 3.0 Level 3 practice

A real Expo (React Native) app, ported from the web prototype. Runs on your
iPhone through **Expo Go** — no Mac, no Xcode, no App Store submission needed
to try it.

## Run it on your iPhone

You need a computer (Windows, Mac, or Linux) with **Node.js** installed —
download it from [nodejs.org](https://nodejs.org) if you don't have it (get
the "LTS" version).

1. Unzip this project, open a terminal, and `cd` into the folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npx expo start
   ```
   A QR code appears in the terminal.
4. On your iPhone, install **Expo Go** from the App Store (search "Expo Go").
5. Open your iPhone's **Camera** app and point it at the QR code in the
   terminal. Tap the notification that pops up — it opens directly in Expo Go.

The app now runs live on your phone. Edit any file in `src/` on your
computer and save — the app on your phone updates automatically (usually
within a second or two), no reinstalling needed.

Your computer and iPhone need to be on the **same Wi-Fi network** for this
to work. If it won't connect, run `npx expo start --tunnel` instead (slower,
but works across different networks).

## What's in here

```
App.js                    — root component: state, persistence, screen switching
src/data/vocab.js         — the 949-word HSK 3.0 Level 3 list (hanzi/pinyin/EN/VN)
src/data/practice.js      — road/unit batching, quiz building, shuffling
src/data/speech.js        — text-to-speech pronunciation (expo-speech)
src/data/persistence.js   — saves streak/progress/wrong-words to the device
src/data/memes.js         — the reaction images shown after answering
src/theme/                — colors and font-family constants
src/components/           — SealStamp, Switch, WrongWordRow (swipe-to-remove)
src/screens/               — Home, Quiz, Result, WrongWords
assets/memes/              — the actual cat meme image files
```

## Known limitations to know about

- **Pronunciation uses the phone's built-in text-to-speech**, not real
  human recordings. iOS usually has a decent zh-CN voice, but quality varies.
  Swapping in real audio clips per word would sound much better — ask if you
  want that built out.
- **Progress is saved on-device only** (via AsyncStorage), tied to this one
  phone. There's no account system or cloud sync yet.
- **Road progress isn't gated** — you can jump ahead to any Road without
  finishing earlier ones. Ask if you'd like it to lock ahead-of-progress
  Roads like Duolingo does.
- Only ~2 of 8 available weights for the Chinese font are bundled (still
  ~30MB combined, since CJK fonts must include thousands of glyphs) — if app
  size becomes a concern, switching Chinese text to the phone's built-in
  system font instead of a custom one would drop that to near zero with
  very little visual difference.

## Getting a real standalone app icon for free (Sideloadly)

This gets the app installed as a real icon on your Home Screen — no PC
needs to be running afterward — without paying Apple's $99/year fee. The
tradeoff: you re-do the install every 7 days (that's an Apple limit on
free-tier signing, not something this project can avoid).

### 1. Put this project on GitHub

You need a (free) GitHub account.

1. Go to [github.com/new](https://github.com/new), create a new repository
   (any name, Public or Private both work).
2. In this project's folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```
   (Replace the URL with the one GitHub shows you after creating the repo.)

### 2. Build the .ipa (free, runs on GitHub's servers)

1. On your repo's GitHub page, click the **Actions** tab.
2. Click **"Build unsigned iOS IPA (for Sideloadly)"** on the left, then the
   **"Run workflow"** button, then confirm.
3. Wait for it to finish (~10-15 minutes) — the little dot turns green when done.
4. Click into the finished run, scroll down to **Artifacts**, and download
   **ChineseHSK3-unsigned-ipa**. Unzip it — you now have `ChineseHSK3-unsigned.ipa`.

This step is free. GitHub gives every account free macOS build minutes each
month; this project's occasional builds fit comfortably inside that.

### 3. Install Sideloadly and sign the .ipa onto your iPhone

1. Download Sideloadly from [sideloadly.io](https://sideloadly.io) (Windows
   or Mac) and install it.
2. Install **iTunes** (Windows only — Sideloadly needs Apple's device
   drivers) if you don't already have it.
3. Connect your iPhone to your PC with a cable, unlock it, and tap **Trust**
   if prompted.
4. Open Sideloadly. Your iPhone should appear in the device dropdown.
5. Drag `ChineseHSK3-unsigned.ipa` into Sideloadly.
6. Enter your Apple ID email and password when prompted (this is only used
   locally to get the same free signing certificate Xcode would give you —
   it isn't sent anywhere else). You may need a 2FA code from your phone.
7. Click **Start**. Sideloadly signs the app and installs it.
8. On your iPhone: **Settings → General → VPN & Device Management** → tap
   your Apple ID → **Trust**. The app icon now opens normally from your
   Home Screen.

### 4. Every 7 days

The signature expires after 7 days (Apple's free-tier limit — this is the
same limit Xcode's free signing has). Reconnect your phone, open Sideloadly,
and hit **Start** again with the same .ipa — no need to rebuild unless
you've changed the code. Takes under a minute.

If you *do* change the code, re-run step 2 to get a fresh .ipa first.

## Getting this onto the actual App Store later

Running through Expo Go (above) is for development/testing only. When
you're ready to publish for real:

1. Create a free [Expo account](https://expo.dev) and an
   [Apple Developer account](https://developer.apple.com) ($99/year, required
   by Apple for App Store distribution).
2. Run `npx eas build --platform ios` (EAS = Expo Application Services) to
   produce a real installable build.
3. Run `npx eas submit --platform ios` to send it to App Store Connect for review.

Happy to walk through that step by step whenever you're actually ready to publish.
