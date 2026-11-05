import { useEffect, useState, type ReactNode } from 'react';
import type { ActivationStatus, TelegramStatus } from './lib/native';

const uz = navigator.language.toLowerCase().startsWith('uz') || !navigator.language.toLowerCase().startsWith('en');
const T = uz ? {
  title: 'Faollashtirish', hint: 'Bir martalik kod Telegram botga yuboriladi. Uni o‘qituvchidan oling.', name: 'Ism va familiyangiz', send: 'Kod yuborish', code: '6 xonali kod', verify: 'Tasdiqlash', sent: 'Kod yuborildi. 10 daqiqa amal qiladi.',
  expired: 'Faollashtirish muddati tugadi — qayta faollashtiring.', clock: 'Kompyuter sanasi noto‘g‘ri.', checking: 'Tekshirilmoqda…',
  setupTitle: 'Telegram botni sozlash', setupHint: 'Bot tokeni va xabar yuboriladigan Telegram chat ID sini kiriting. Token qurilmada shifrlangan holda saqlanadi.', token: 'Bot API tokeni', chatId: 'Telegram Chat ID', save: 'Xavfsiz saqlash',
  e: { name: 'Ismni kiriting', not_configured: 'Telegram bot sozlanmagan', send_failed: 'Xabar yuborilmadi. Internetni tekshiring', bad: 'Kod noto‘g‘ri', expired: 'Kod eskirgan, qaytadan so‘rang', locked: 'Juda ko‘p urinish. Yangi kod so‘rang', rate: 'Juda ko‘p so‘rov. Biroz kuting', invalid_token: 'Bot token formati noto‘g‘ri', invalid_chat_id: 'Chat ID formati noto‘g‘ri', secure_storage_unavailable: 'Operatsion tizimning xavfsiz xotirasi mavjud emas', secure_storage_failed: 'Tokenni xavfsiz saqlab bo‘lmadi' } as Record<string, string>,
} : {
  title: 'Activation', hint: 'A one-time code is sent to your Telegram bot. Ask your teacher for the code.', name: 'Student name', send: 'Send code', code: '6-digit code', verify: 'Verify', sent: 'Code sent. Valid for 10 minutes.',
  expired: 'Activation expired — activate again.', clock: 'Your computer date looks wrong.', checking: 'Checking…',
  setupTitle: 'Connect Telegram bot', setupHint: 'Enter the bot token and the Telegram chat ID that should receive messages. The token is encrypted on this device.', token: 'Bot API token', chatId: 'Telegram Chat ID', save: 'Save securely',
  e: { name: 'Enter your name', not_configured: 'Telegram bot is not configured', send_failed: 'Could not send the message. Check your internet', bad: 'Wrong code', expired: 'Code expired, request a new one', locked: 'Too many attempts. Request a new code', rate: 'Too many requests. Please wait', invalid_token: 'Invalid bot token format', invalid_chat_id: 'Invalid Telegram chat ID format', secure_storage_unavailable: 'Operating-system secure storage is unavailable', secure_storage_failed: 'Could not securely save the token' } as Record<string, string>,
};

export function ActivationGate({ children }: { children: ReactNode }) {
  const native = window.miraeNative;
  const [status, setStatus] = useState<ActivationStatus | null>(native ? null : { state: 'ok' });
  const [telegram, setTelegram] = useState<TelegramStatus | null>(null);
  const [name, setName] = useState(''), [code, setCode] = useState(''), [note, setNote] = useState(''), [bad, setBad] = useState(false), [busy, setBusy] = useState(false);
  const [token, setToken] = useState(''), [chatId, setChatId] = useState('');

  useEffect(() => {
    if (!native) return;
    let active = true;
    Promise.all([native.activation.status(), native.telegram.status()]).then(([activation, bot]) => {
      if (active) { setStatus(activation); setTelegram(bot); }
    }).catch(() => { if (active) setStatus({ state: 'none' }); });
    return () => { active = false; };
  }, [native]);

  if (!native || status?.state === 'ok') return <>{children}</>;
  const say = (message: string, error = false) => { setNote(message); setBad(error); };
  const setup = async () => {
    setBusy(true);
    try {
      const result = await native.telegram.save(token, chatId);
      if (result.ok) {
        setToken('');
        setTelegram(await native.telegram.status());
        say(uz ? 'Telegram bot xavfsiz saqlandi.' : 'Telegram bot saved securely.');
      } else say(T.e[result.error ?? ''] ?? result.error ?? 'Error', true);
    } catch { say(uz ? 'Telegram sozlamasini saqlab bo‘lmadi.' : 'Could not save Telegram settings.', true); }
    finally { setBusy(false); }
  };
  const send = async () => {
    setBusy(true);
    try { const result = await native.activation.request(name); say(result.ok ? T.sent : (T.e[result.error ?? ''] ?? result.error ?? 'Error'), !result.ok); }
    catch { say(T.e.send_failed, true); }
    finally { setBusy(false); }
  };
  const verify = async () => {
    setBusy(true);
    try {
      const result = await native.activation.verify(code);
      if (result.ok) setStatus(await native.activation.status());
      else say(T.e[result.error ?? ''] ?? 'Error', true);
    } catch { say(uz ? 'Kod tekshirilayotganda xato yuz berdi.' : 'Could not verify the code.', true); }
    finally { setBusy(false); }
  };

  return <div className="gate-wrap"><div className="gate-card">
    <img src="./mascot.png" alt="" className="gate-mascot"/><h1>{T.title}</h1>
    {status === null ? <p className="gate-hint">{T.checking}</p> : <>
      {status.state === 'expired' && <p className="gate-error">{T.expired}</p>}
      {status.state === 'clock' && <p className="gate-error">{T.clock}</p>}
      {telegram && !telegram.configured ? <>
        <h2>{T.setupTitle}</h2><p className="gate-hint">{T.setupHint}</p>
        {!telegram.secureStorageAvailable && <p className="gate-error">{T.e.secure_storage_unavailable}</p>}
        <input type="password" value={token} onChange={event => setToken(event.target.value)} placeholder={T.token} autoComplete="new-password" spellCheck={false}/>
        <input value={chatId} onChange={event => setChatId(event.target.value)} placeholder={T.chatId} inputMode="numeric" autoComplete="off"/>
        <button className="button-primary" disabled={busy || !telegram.secureStorageAvailable || !token.trim() || !chatId.trim()} onClick={() => void setup()}>{T.save}</button>
      </> : <>
        {status.state !== 'clock' && <>
          <p className="gate-hint">{T.hint}</p>
          <input value={name} onChange={event => setName(event.target.value)} placeholder={T.name} maxLength={60} autoComplete="name"/>
          <button className="button-primary" disabled={busy || name.trim().length < 2} onClick={() => void send()}>{T.send}</button>
          <input value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder={T.code} inputMode="numeric" autoComplete="one-time-code"/>
          <button className="button-secondary" disabled={busy || code.length !== 6} onClick={() => void verify()}>{T.verify}</button>
        </>}
      </>}
      {note && <p className={bad ? 'gate-error' : 'gate-hint'} role="status">{note}</p>}
    </>}
  </div></div>;
}
