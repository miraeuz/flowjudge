# Mirae Flow — web renderer

The `web/` folder is the React + TypeScript renderer used by the Electron desktop app and the PWA. The current 1.0.1 project judges `.fprg` files locally with the bundled Flowgorithm interpreter and stores the student profile/submissions in local browser or application storage. It does not include a remote FastAPI service, shared accounts, or cross-device synchronization.

## Pages

Dashboard, Learning Roadmap, Topics, Problemset, individual Problem Workspace, Submissions, local Leaderboard snapshot, Student Profile and Settings.

## Local development

```bash
npm ci
npm run dev
```

## Check and build

```bash
npm run check
npm run build
```

The build output is consumed by the Electron shell when `TARGET=desktop` is set in the Vite configuration.

## Judge trust boundary

The `.fprg` interpreter and reference test data are bundled in the client to support offline use. This means test data can be inspected by a technically capable user and local verdicts can be modified on the device. Treat this as an offline practice/checking environment, not as a tamper-proof exam or a protected online contest judge. A true public competitive judge needs the checker data and execution in a server-side isolated worker.

## Telegram

The renderer uses a narrow Electron preload bridge for optional completion notifications. Bot tokens are not accepted in the PWA/browser renderer. Desktop credentials are encrypted by Electron `safeStorage` and are not included in build-time `config.json`. For multi-student web deployments, use a backend proxy and keep the bot token on the server.
