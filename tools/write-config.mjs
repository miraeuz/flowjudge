// Repository secrets are read only during the Windows CI build. Never commit config.json.
import { writeFileSync } from "node:fs";
const token = process.env.TELEGRAM_BOT_TOKEN?.trim(),
  chatId = process.env.TELEGRAM_CHAT_ID?.trim();
if (!token || !chatId)
  throw new Error(
    "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID repository secret. Refusing to publish an installer that cannot activate.",
  );
if (!/^\d+:[A-Za-z0-9_-]+$/.test(token) || !/^-?\d+$/.test(chatId))
  throw new Error(
    "Telegram configuration has an invalid format. Values have not been logged.",
  );
writeFileSync(
  new URL("../config.json", import.meta.url),
  JSON.stringify({ token, chatId }),
  { mode: 0o600 },
);
console.log("Activation configured. Secret values are not logged.");
