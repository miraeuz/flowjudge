// Writes config.json from CI secrets. Never commit config.json.
import { writeFileSync } from 'node:fs';
const token = process.env.TELEGRAM_BOT_TOKEN || '', chatId = process.env.TELEGRAM_CHAT_ID || '';
writeFileSync(new URL('../config.json', import.meta.url), JSON.stringify({ token, chatId }));
console.log(token && chatId ? 'config.json written (Telegram configured)' : 'config.json written (Telegram NOT configured)');
