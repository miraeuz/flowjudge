# Mirae Flow

Offline-first Flowgorithm learning platform: **website (PWA)** + **desktop installer** from one React codebase.

- `web/` — React + TypeScript + Tailwind app. Judges `.fprg` files **in the browser** with the bundled Flowgorithm interpreter (`engine/fprg.mjs`), keeps progress in `localStorage`, hash-routing so it works offline, from `file://` and under any sub-path.
- `main.js`, `preload.js` — Electron shell for the installers (.exe / .deb / .AppImage); adds the one-time Telegram activation.
- `content/` + `tools/build_bank.py` — builds `web/src/data/*.json` from the teacher's book (`content/source/`), attaching a checker to every problem.
- `tests/run.mjs` — judge engine + bank tests (`node tests/run.mjs`).

Develop: `cd web && npm install && npm run dev`. Website build: `npm run build` (PWA). Desktop: `TARGET=desktop npm run build`, then `npm install && npm run dist` in the repo root.
Releases: push a `v*` tag → GitHub Actions builds installers + website zip. Repository secrets `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` enable the activation code in the desktop build.
