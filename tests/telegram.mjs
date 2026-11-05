import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { validateTelegramConfig, buildSolvedMessage, cleanText } = require('../telegram-utils.cjs');
let failed = 0;
function check(name, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${name}`);
  if (!condition) failed += 1;
}
const testToken = '123456:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi';
check('Telegram config accepts a valid token and numeric chat id', validateTelegramConfig(testToken, '123456789').ok === true);
check('Telegram config rejects malformed token', validateTelegramConfig('not-a-token', '123456789').error === 'invalid_token');
check('Telegram config rejects non-numeric chat id', validateTelegramConfig(testToken, 'not-a-chat').error === 'invalid_chat_id');
check('Telegram config supports negative group chat ids', validateTelegramConfig(testToken, '-1001234567890').ok === true);
check('cleanText strips newlines and control characters', cleanText('Ali\nInjected\u0000Name', 80) === 'Ali Injected Name');
const message = buildSolvedMessage({
  firstName: 'Ali\nInjected', lastName: 'Valiyev', displayName: 'Ignored', groupName: '9-A',
  email: 'private@example.com', phone: '+998901234567', problemId: 'BAS-006', problemTitle: 'Yig‘indi',
}, new Date('2026-11-05T08:00:00.000Z'));
check('completion notice identifies student, group and problem', message.includes('Ali Injected Valiyev') && message.includes('9-A') && message.includes('BAS-006 — Yig‘indi'));
check('completion notice does not include email or phone', !message.includes('private@example.com') && !message.includes('+998901234567'));
check('completion notice uses accepted verdict', message.includes('Natija: Accepted'));
check('completion notice is explicitly a local practice result', message.includes('offline') || message.includes('lokal')); 
check('invalid problem ids cannot enter the Telegram message', (() => { try { buildSolvedMessage({ problemId: '../state', firstName: 'A' }); return false; } catch { return true; } })());
check('long student fields are bounded', buildSolvedMessage({ firstName: 'A'.repeat(1000), problemId: 'BAS-001' }).length < 500);
process.exit(failed ? 1 : 0);
