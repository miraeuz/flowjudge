# Flowgorithm Academy · Mirae

A Windows learning application: read an Uzbek or English lesson, build a solution in Flowgorithm, save `.fprg`, submit, and learn from test feedback.

## Install

Download **one** `Flowgorithm-Academy-Setup-<version>.exe` from the release. No Node or Python installation is needed. The installer creates Desktop and Start Menu shortcuts and preserves existing progress. Enter your name, request the one-time Telegram code, get it from your teacher, and verify. Learning and judging then work offline.

Flowgorithm itself is used to **author** flowcharts and must already be installed on the student's PC. It is not bundled or needed by the judging engine. This project does not redistribute Flowgorithm.

## Version 0.2.0

- Mirae violet interface with fluid grids, responsive sidebar, day/night/system themes, Uzbek/English, text sizing and reduced motion.
- Learning path, next-unsolved shortcut, topic lessons, classwork/homework tabs and searchable exercises. Search handles common Uzbek apostrophe variants.
- 15 topics, 300 classwork + 450 homework exercises. These are **practice families with scenario/parameter variants**, not 750 distinct algorithms. See [curriculum notes](docs/CURRICULUM.md).
- `.fprg` drag/drop, per-test verdicts, visible-test differences, hints, local progress, first-solve XP and the latest 1,000 attempts.
- Atomic state writes, progress backup/merge and student CSV results. No source submissions are retained.
- Isolated judge worker, five-second whole-submission deadline, memory limits, XML validation, hidden-error redaction and structural checks.
- A single Windows x64 NSIS installer. The build fails when activation secrets are missing rather than publishing a nonfunctional setup.

## Development

Node 22 or newer:

```sh
npm ci
npm test
npm run test:ui
npm start
```

For local activation configuration, set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in your shell and run `node tools/write-config.mjs`. Never commit the resulting `config.json`. The production app has no activation bypass.

`npm run test:ui` uses a separate Electron renderer host with a mocked bridge. It tests navigation, layouts, search, language/theme state and feedback. It does **not** certify Windows installation, real Telegram delivery or the native file dialogs. Its host is excluded from the installer.

The complete test suite checks every reference solution against independently calculated expected values, rejects deliberately wrong output, and exercises worker timeout/recovery and security regressions. Teacher reference files are under `tests/reference/` and are not included in the installer.

## Build and release

Repository Actions secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. A push to `main` builds an artifact; a version tag also publishes one `.exe` release asset. Pull requests run tests without accessing secrets.

```sh
git tag v0.2.0
git push origin v0.2.0
```

GitHub may display its automatic source archives below the installer. Those are GitHub-generated source links, not additional student installers.

## Important boundaries

- Existing Telegram activation embeds the bot credential in the executable. It is extractable. Use a dedicated bot; a hosted activation relay is needed before broad/untrusted distribution. Secrets do not become safe merely because they came from GitHub Actions.
- Hidden cases never go to the renderer, but an offline package cannot keep its local content secret from a determined user. Structural checks detect block presence, not proof of algorithmic reasoning.
- Local progress and activation are classroom convenience features, not tamper-proof identity or grading records. Backups are not verified exam evidence.
- The interpreter supports the tested Flowgorithm subset; full semantic parity with every Flowgorithm version is not certified. File I/O and unsupported blocks are rejected.
- The installer is unsigned unless a signing certificate is configured. No automatic updater, exam proctoring, classroom aggregation, similarity checker, certificate generator or execution tracer is claimed in this release.

See [release notes](docs/RELEASE-0.2.0.md) and [teacher guide](docs/TEACHER-GUIDE.md).
