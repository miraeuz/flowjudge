import { useEffect, useState, type ReactNode } from 'react';

type Status = { state: 'ok' | 'none' | 'expired' | 'clock'; name?: string; daysLeft?: number };
type Native = { activation: { status(): Promise<Status>; request(name: string): Promise<{ ok: boolean; error?: string }>; verify(code: string): Promise<{ ok: boolean; error?: string }> } };
declare global { interface Window { miraeNative?: Native } }

const uz = navigator.language.toLowerCase().startsWith('uz') || !navigator.language.toLowerCase().startsWith('en');
const T = uz ? {
  title: 'Faollashtirish', hint: 'Bir martalik kod Telegram botga yuboriladi. Uni o‘qituvchidan oling.', name: 'Ismingiz', send: 'Kod yuborish', code: '6 xonali kod', verify: 'Tasdiqlash', sent: 'Kod yuborildi. 10 daqiqa amal qiladi.',
  expired: 'Faollashtirish muddati tugadi — qayta faollashtiring.', clock: 'Kompyuter sanasi noto‘g‘ri.', checking: 'Tekshirilmoqda…',
  e: { name: 'Ismni kiriting', not_configured: 'Ilova sozlanmagan (Telegram kaliti yo‘q)', send_failed: 'Kod yuborilmadi. Internetni tekshiring', bad: 'Kod noto‘g‘ri', expired: 'Kod eskirgan, qaytadan so‘rang', locked: 'Juda ko‘p urinish. Yangi kod so‘rang', rate: 'Juda ko‘p so‘rov. Biroz kuting' } as Record<string, string>,
} : {
  title: 'Activation', hint: 'A one-time code is sent to a Telegram bot. Get it from your teacher.', name: 'Your name', send: 'Send code', code: '6-digit code', verify: 'Verify', sent: 'Code sent. Valid for 10 minutes.',
  expired: 'Activation expired — activate again.', clock: 'Your computer date looks wrong.', checking: 'Checking…',
  e: { name: 'Enter your name', not_configured: 'App is not configured (no Telegram key)', send_failed: 'Could not send the code. Check your internet', bad: 'Wrong code', expired: 'Code expired, request a new one', locked: 'Too many attempts. Request a new code', rate: 'Too many requests. Please wait' } as Record<string, string>,
};

/** Desktop builds ask for a one-time Telegram code on first run. The website/PWA build has no gate. */
export function ActivationGate({ children }: { children: ReactNode }) {
  const native = window.miraeNative?.activation;
  const [status, setStatus] = useState<Status | null>(native ? null : { state: 'ok' });
  const [name, setName] = useState(''), [code, setCode] = useState(''), [note, setNote] = useState(''), [bad, setBad] = useState(false), [busy, setBusy] = useState(false);
  useEffect(() => { void native?.status().then(setStatus); }, [native]);
  if (!native || status?.state === 'ok') return <>{children}</>;
  const say = (m: string, err = false) => { setNote(m); setBad(err); };
  const send = async () => { setBusy(true); const r = await native.request(name); setBusy(false); say(r.ok ? T.sent : (T.e[r.error ?? ''] ?? r.error ?? 'Error'), !r.ok); };
  const verify = async () => { setBusy(true); const r = await native.verify(code); setBusy(false); if (r.ok) setStatus(await native.status()); else say(T.e[r.error ?? ''] ?? 'Error', true); };
  return <div className="gate-wrap"><div className="gate-card">
    <img src="./mascot.png" alt="" className="gate-mascot"/><h1>{T.title}</h1>
    {status === null ? <p className="gate-hint">{T.checking}</p> : <>
      {status.state === 'expired' && <p className="gate-error">{T.expired}</p>}{status.state === 'clock' && <p className="gate-error">{T.clock}</p>}
      <p className="gate-hint">{T.hint}</p>
      {status.state !== 'clock' && <>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={T.name} maxLength={60} autoComplete="off"/>
        <button className="button-primary" disabled={busy} onClick={() => void send()}>{T.send}</button>
        <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder={T.code} inputMode="numeric" autoComplete="off"/>
        <button className="button-secondary" disabled={busy || code.length !== 6} onClick={() => void verify()}>{T.verify}</button></>}
      {note && <p className={bad ? 'gate-error' : 'gate-hint'} role="status">{note}</p>}</>}
  </div></div>;
}
