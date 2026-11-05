# Mirae Flow 1.0.1

Offline-first Flowgorithm learning application built with React, TypeScript, Vite and Electron.

## Important product behavior

- The learning catalogue contains 444 source-based exercises.
- The bundled interpreter judges supported `.fprg` files locally on the student's device.
- This is an **offline practice judge**, not a protected remote competitive judge. The checker data is part of the installed application and a technically capable student can inspect it. Do not use local verdicts as tamper-proof exam evidence.
- Student profile and submissions are stored locally in the browser/Electron user-data profile. There is no remote account system or cross-device synchronization in this release.
- Telegram notifications are optional. In the desktop build, the bot token is encrypted using Electron `safeStorage` and kept in the operating-system user profile. The token is never written into `config.json`, the renderer's localStorage, source files or build artifacts.
- The public PWA/browser build does not accept a Telegram bot token. A future multi-user website should send Telegram messages through a server-side proxy with server-held credentials.

## Student profile and settings

Settings includes first name, surname, group/class, school/academy, phone, email, theme, language, zoom, Telegram connection and notification preferences. The Telegram notification contains only the student's name, group, problem ID/title, accepted status and the timestamp; it does not include phone or email.

The desktop app sends one completion notice for the first accepted submission of each problem for each local profile. Failed sends are queued and retried while the app remains open and on the next launch. Test messages are rate-limited.

## Telegram setup

1. Create or select a Telegram bot using BotFather.
2. Send `/start` to the bot from the receiving account or add the bot to the receiving group.
3. Obtain the receiving chat ID using a trusted method.
4. Open Mirae Flow Settings → Telegram notifications, enter the bot token and chat ID, save securely, then send a test message.
5. Enable “Notify when a problem is solved”.

Never commit bot tokens to source control or include them in a client package. If a token was pasted into a chat, ticket, log or repository, revoke it and create a new one before use.

## Run locally

```bash
cd web
npm ci
npm run dev
```

## Test and build

```bash
node tests/run.mjs
node tests/telegram.mjs
node --check main.js
node --check preload.js
cd web
npm ci
npm run check
npm run build
```

Desktop package (on the target operating system):

```bash
# Build web renderer first
cd web && npm ci && npm run build && cd ..
npm ci
npm run dist
```

## Data handling

Progress export/import uses `mirae-flow-progress.json`. Imports are validated against known problem IDs, accepted verdict values, record limits and field-size limits. Clearing submissions keeps the learner profile.

## Version 1.0.1 audit notes

- Removed CI injection of Telegram credentials into `config.json`.
- Added a settings-driven Telegram configuration stored through Electron `safeStorage`.
- Added Telegram test, disconnect, notification deduplication, rate limiting and queued retries.
- Improved profile data and progress import validation.
- Clarified the local/offline judge and local-profile limitations in the interface and documentation.
- Hardened Flowgorithm XML parsing, local profile/submission recovery, and interpreter limits while preserving supported flowchart behavior.
- Serialized Telegram queue updates, store structured sanitized retry records, clear pending messages when the receiving chat changes, reject weak Linux `basic_text` credential storage, and disable packaged DevTools.

The current activation state is still local to the device and can be altered by a technically capable user; a tamper-resistant licensing system needs a server-side verification service. A signed Windows installer must be built on Windows with a trusted code-signing certificate. The previous 1.0.0 installer has not been replaced by this source audit; build a new 1.0.1 package from the patched source before distributing it.
