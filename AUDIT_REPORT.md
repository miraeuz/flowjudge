# Mirae Flow 1.0.1 — source audit and patch report

Audit date: 2026-11-05
Audited inputs: `flowjudge-1.0.0.zip` and `Mirae-Flow-Setup-1.0.0.exe`

## Summary

The application has a useful offline Flowgorithm foundation, but version 1.0.0 should not be treated as a secure competitive judge or multi-student web service. The current judgement and progress storage run locally in the student's browser/app profile. Hidden checker data is bundled with the renderer and can be inspected by a technically capable user. The code therefore improves offline practice reliability, but it cannot make a client-side judge tamper-proof.

The patch is source version 1.0.1. It is not a rebuilt Windows installer.

## Applied fixes

### Flowgorithm interpreter and checker

- Tightened XML parsing: rejects malformed/mismatched tags, duplicate attributes, unquoted attributes, DTD/entity declarations, extra roots, unsupported markup, and oversize/deep/over-complex documents.
- Bounded expression tokenization, AST nesting, cache size, runtime steps/time, recursion, array sizes, input size and output size.
- Improved scientific-notation and finite-number handling; rejects unsafe integers, `NaN`, and `Infinity` as numeric input.
- Tightened function parameter validation and checker configuration validation.
- Preserved hidden-test result redaction in the checker API: hidden test input, expected output, and student output are not returned in per-test result objects.
- Synchronized the desktop and renderer copies of the interpreter.

### Telegram notifications

- Removed build-time Telegram token injection into `config.json` and removed the `write-config` build helper.
- No live bot token or personal Chat ID is present in the patched source. The token must be re-created and entered manually in Settings.
- Desktop-only token storage uses Electron `safeStorage`; the weak Linux `basic_text` fallback is rejected.
- Token values are not exposed by the preload status API, copied into renderer local storage, placed in build-time environment variables, or written to application logs.
- Notifications are sent to one configured destination Chat ID and identify the learner, group, problem ID/title, local Accepted result, and timestamp. Phone and email are excluded.
- Only the first Accepted result per local profile/problem is notified. Failed sends are stored as structured sanitized queue records and retried.
- Queue operations are serialized to avoid races; changing/disconnecting the receiving Chat ID clears pending notices so old learner data is not sent to a new recipient.
- Test messages are rate-limited. The message explicitly says it is a local result, not a protected server verdict.

### Student settings and local data

- Replaced the single display-name-only profile with first name, surname, class/group, school/academy, phone and email.
- Added validation and bounded text lengths for profile data.
- Added theme, language, zoom and Telegram-notification preferences to Settings.
- Added Telegram connection status, save/test/disconnect controls and secure-storage capability feedback.
- Progress imports validate known problem IDs, verdicts, timestamps and field sizes. Local reads normalize malformed profile/submission records.
- Submission and reset operations now report local-storage write failures rather than pretending data was saved.
- Profile and submission history remain local; there is no real authentication or cross-device synchronization in this build.

### Electron hardening and usability

- Retains context isolation and sandboxing; Node integration remains disabled.
- Disables DevTools in packaged builds.
- Blocks arbitrary new windows and only opens the official Flowgorithm documentation domain externally.

## Verified checks

- Flowgorithm engine regression tests: **51 passed, 0 failed**.
- Telegram/profile utility tests: **11 passed, 0 failed**.
- Node syntax checks: `main.js`, `preload.js`, and `telegram-utils.cjs` passed.
- TypeScript/TSX syntax transpilation: 8 source files passed syntax diagnostics.
- JSON parse checks: root and web package manifests and TypeScript configuration files passed.
- Interpreter copies: desktop and renderer copies match.
- Catalogue: 444 problems, 441 checker-enabled, 3 without checkers; every checker entry maps to a known problem ID.
- Credential scan: the supplied live token and supplied Chat ID are absent from the patched source tree.

## Not verified in this environment

- `npm ci` could not complete because the package registry timed out. Therefore a dependency-backed `tsc -b`, Vite production build, and actual Electron app launch were not completed.
- No Windows installer was rebuilt. Build the patched source on Windows after dependencies are installed.
- Telegram delivery was not tested against a live bot. The included tests validate message construction and input validation, not external network delivery.
- No real multi-user authentication or server-side judging service is present.

## Risks that remain by design

1. **Local checker visibility:** `problemTests.json` is bundled for offline judging. Hidden tests cannot remain secret in a client-only/offline app. Use a server-side judge for contests, exams, rankings, or trusted results.
2. **Local activation tampering:** the current activation state is device-local. A technically capable user with access to their profile files or modified app code can alter or bypass local activation. Tamper-resistant licensing requires a server verification service.
3. **Telegram notification trust:** notifications reflect the local offline judge's verdict. They are useful progress signals, not cryptographic proof that a student solved a task. The message labels this clearly.
4. **Single receiving chat:** Telegram notifications go to one configured Chat ID. To notify each student individually, add a per-student Telegram account-linking flow and store each student's Chat ID after they start the bot.
5. **Old installer:** the uploaded 1.0.0 EXE is an unsigned NSIS installer. Its embedded payload is compressed; this audit does not establish whether a build-time credential exists inside it. Since a bot token was pasted into a chat, revoke it with BotFather and use a newly generated token only in the patched Settings page. Do not redistribute the old EXE.

## Original uploaded EXE metadata

- File size: 82,265,331 bytes
- Format: PE32 / NSIS self-extracting installer
- Certificate table: absent (unsigned)
- SHA-256: `c6105cf8ef81524053c74498745ec25dea6ba33c21da76e7885f26d916d760d4`
- The executable was inspected as a file only; it was not launched.

## Rebuild the patched Windows app

On Windows, from the extracted project folder:

```powershell
cd web
npm ci
npm run build
cd ..
npm install --no-audit --no-fund
npm test
npm run dist
```

The generated installer is under `release/`. Use a trusted code-signing certificate before distributing it publicly.
