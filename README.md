# Flowgorithm Academy

Desktop app (Electron) to learn Flowgorithm: lessons, problems, and an automatic judge for `.fprg` files.

- `engine/fprg.mjs` — .fprg interpreter + judge (`node tests/run.mjs`)
- `content/topics/*.json` — topics, lessons, problems (uz/en) with visible + hidden tests
- `main.js` — activation (one-time Telegram code), judge IPC; hidden tests never reach the UI
- `renderer/` — liquid-glass UI, day/night/system theme, uz/en

## Installers
Push to `main` → Actions → **Build** → Artifacts (Windows, macOS, Linux).
Add repository secrets `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (Settings → Secrets and variables → Actions).
