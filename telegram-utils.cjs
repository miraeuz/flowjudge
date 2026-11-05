'use strict';

function cleanText(value, max = 80) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function validateTelegramConfig(token, chatId) {
  const safeToken = String(token ?? '').trim();
  const safeChatId = String(chatId ?? '').trim();
  if (!/^\d{6,16}:[A-Za-z0-9_-]{25,}$/.test(safeToken)) return { ok: false, error: 'invalid_token' };
  if (!/^-?\d{5,20}$/.test(safeChatId)) return { ok: false, error: 'invalid_chat_id' };
  return { ok: true, token: safeToken, chatId: safeChatId };
}

function buildSolvedMessage(payload, now = new Date()) {
  const first = cleanText(payload?.firstName, 50);
  const last = cleanText(payload?.lastName, 50);
  const student = cleanText(`${first} ${last}`.trim() || payload?.displayName || 'Talaba', 100);
  const group = cleanText(payload?.groupName, 50) || 'Ko‘rsatilmagan';
  const problemId = cleanText(payload?.problemId, 30);
  const title = cleanText(payload?.problemTitle, 120);
  if (!/^[A-Z0-9-]{3,30}$/i.test(problemId)) throw new Error('Invalid problem ID');
  return [
    '✅ Mirae Flow — lokal masala natijasi',
    '',
    `O‘quvchi: ${student}`,
    `Guruh: ${group}`,
    `Masala: ${problemId}${title ? ` — ${title}` : ''}`,
    'Natija: Accepted (lokal tekshiruv)',
    `Sana: ${now.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`,
  ].join('\n');
}

module.exports = { cleanText, validateTelegramConfig, buildSolvedMessage };
