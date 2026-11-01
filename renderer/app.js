(() => {
'use strict';
const D = {
uz: { tag:"Algoritmlarni amalda o‘rganing", topics:'Mavzular', solved:'Yechilgan', all:'Jami masala', back:'← Orqaga', lesson:'Dars', cw:'Sinf ishi', hw:'Uyga vazifa', soon:'Masalalar tez orada qo‘shiladi',
  inp:'Kirish formati', out:'Chiqish formati', ex:'Namunalar', drop:'.fprg faylni shu yerga tashlang', or:'yoki', pick:'Fayl tanlash', busy:'Tekshirilmoqda…', tests:'test',
  aT:'Faollashtirish', aN:'Ismingiz', aS:'Kod yuborish', aC:'6 xonali kod', aV:'Tasdiqlash', aH:'Kod Telegram botga yuboriladi. Uni administratordan oling.', sent:'Kod yuborildi. 10 daqiqa amal qiladi.',
  name:'Ismni kiriting', not_configured:'Ilova sozlanmagan (Telegram kaliti yo‘q)', send_failed:'Kod yuborilmadi. Internetni tekshiring', bad:'Kod noto‘g‘ri', expired:'Kod eskirgan, qaytadan so‘rang', locked:'Juda ko‘p urinish. Yangi kod so‘rang', rate:'Juda ko‘p so‘rov. Biroz kuting',
  s_expired:'Faollashtirish muddati tugadi — shu kod bilan yangilang', s_clock:'Kompyuter sanasi noto‘g‘ri', days:'kun qoldi',
  AC:'Qabul qilindi', WA:'Noto‘g‘ri javob', RE:'Ishlash xatosi', TLE:'Vaqt tugadi', CE:'Fayl xatosi', exp:'Kutilgan', got:'Sizniki', input:'Kirish', t_system:'Tizim', t_light:'Kunduz', t_dark:'Tun', auto:'Avto-tekshiruv', practice:'Mashq (o‘zingiz tekshirasiz)', bench:'Ish stoli', run:'Ishga tushirish', submit:'Yuborish', mark:'Bajardim deb belgilash', inpHint:'Kirish qiymatlari — har biri yangi qatorda', needFile:'Avval .fprg faylni tanlang', big:'Fayl juda katta', search:'Qidirish…', extraT:'Qo‘shimcha', prT:'Amaliyot', bkT:'Mirae kitobi', hi:'Salom', first:'Birinchi qadam', cont:'Davom eting', start:'Boshlash', daysS:'kun', lvl:'Daraja', home:'Bosh sahifa', pend:'Tekshiruvchi kutayotgan', wait:'kutmoqda', pendNote:'ta masala uchun tekshiruvchi tayyorlanmoqda' },
en: { tag:'Learn algorithms by doing', topics:'Topics', solved:'Solved', all:'Total problems', back:'← Back', lesson:'Lesson', cw:'Classwork', hw:'Homework', soon:'Problems are coming soon',
  inp:'Input format', out:'Output format', ex:'Examples', drop:'Drop your .fprg file here', or:'or', pick:'Choose file', busy:'Checking…', tests:'tests',
  aT:'Activation', aN:'Your name', aS:'Send code', aC:'6-digit code', aV:'Verify', aH:'The code is sent to a Telegram bot. Get it from the administrator.', sent:'Code sent. Valid for 10 minutes.',
  name:'Enter your name', not_configured:'App is not configured (no Telegram key)', send_failed:'Could not send the code. Check your internet', bad:'Wrong code', expired:'Code expired, request a new one', locked:'Too many attempts. Request a new code', rate:'Too many requests. Please wait',
  s_expired:'Activation expired — renew with the same flow', s_clock:'Your computer date looks wrong', days:'days left',
  AC:'Accepted', WA:'Wrong answer', RE:'Runtime error', TLE:'Time limit', CE:'File error', exp:'Expected', got:'Yours', input:'Input', t_system:'System', t_light:'Day', t_dark:'Night', auto:'Auto-judged', practice:'Practice (self-check)', bench:'Workbench', run:'Run', submit:'Submit', mark:'Mark as done', inpHint:'Input values — one per line', needFile:'Choose a .fprg file first', big:'File is too large', search:'Search…', extraT:'Extra', prT:'Practice', bkT:'Mirae book', hi:'Hello', first:'First step', cont:'Continue', start:'Start', daysS:'days', lvl:'Level', home:'Home', pend:'Awaiting checkers', wait:'pending', pendNote:'problems are waiting for their checker' } };
let lang = localStorage.lang || (navigator.language.startsWith('uz') ? 'uz' : 'en'), theme = localStorage.theme || 'system';
let tab = 'cw', q = '', curFile = null, curName = '', lastKey = '';
let topics = [], progress = {}, act = { state: 'none' }, note = '', noteErr = false;
const t = k => D[lang][k] ?? k, L = o => (o && (o[lang] || o.uz || o.en)) || '';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const app = document.getElementById('app');
const applyTheme = () => { document.documentElement.dataset.theme = theme === 'system' ? '' : theme; document.documentElement.lang = lang; };

const themeSeg = () => `<div class="seg">${['system', 'light', 'dark'].map(x => `<button data-theme="${x}" class="${theme === x ? 'on' : ''}">${t('t_' + x)}</button>`).join('')}</div>`;
const langSeg = () => `<div class="seg">${['uz', 'en'].map(x => `<button data-lang="${x}" class="${lang === x ? 'on' : ''}">${x.toUpperCase()}</button>`).join('')}</div>`;
const isDark = () => theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
const tgl = () => `<button class="tgl ${isDark() ? 'dark' : ''}" data-act="theme" role="switch" aria-checked="${isDark()}" aria-label="${t('t_dark')}"><span class="ico sun">☀</span><span class="ico moon">☾</span><i class="thumb"></i></button>`;
const ring = (p, tone = 'lapis', inner = '') => `<span class="ring ${tone}"><svg viewBox="0 0 36 36"><circle class="rt" cx="18" cy="18" r="15.9"/><circle class="rv" cx="18" cy="18" r="15.9" pathLength="100" stroke-dasharray="${Math.round(p * 100)} 100" transform="rotate(-90 18 18)"/></svg><i>${inner}</i></span>`;
const xpOf = () => Object.values(progress).filter(v => v > 0).length * 10;
const lvl = xp => { let l = 1; while (xp >= 40 * l * l) l++; return { l, into: xp - 40 * (l - 1) ** 2, need: 40 * (2 * l - 1) }; };
const streak = () => { const d = new Set(Object.values(progress).filter(v => v > 0).map(v => new Date(v).toDateString())); let n = 0, x = new Date(); if (!d.has(x.toDateString())) x.setDate(x.getDate() - 1); while (d.has(x.toDateString())) { n++; x.setDate(x.getDate() - 1); } return n; };
const stats = tp => { const a = flat(tp); return { n: a.length, d: a.filter(p => progress[tp.id + '/' + p.id] > 0).length }; };
const sidebar = () => { const cur = location.hash.split('/')[2], xp = xpOf(), v = lvl(xp);
  return `<aside class="side"><button class="brand" data-go="#/"><img class="logo" src="mascot.png" alt=""><span class="bt"><span class="wm">m<i>ı</i>rae</span> <b>flow</b><small class="credit">Mirae Academy created this</small></span></button>
  <button class="searchbtn" data-act="pal">🔍 <span>${t('search')}</span><kbd>Ctrl K</kbd></button><button class="navi ${cur ? '' : 'on'}" data-go="#/">🏠 ${t('home')}</button><div class="label">${t('topics')}</div>
  <nav class="tree">${topics.map(x => { const s = stats(x); return `<button class="titem ${cur === x.id ? 'on' : ''}" data-go="#/t/${x.id}">${ring(s.n ? s.d / s.n : 0, 'lapis', s.n ? Math.round(100 * s.d / s.n) : 0)}<span class="tt">${esc(L(x.title))}</span><small>${s.d}/${s.n}</small></button>`; }).join('')}</nav>
  <div class="foot"><div class="tglrow">${tgl()}${langSeg()}</div><div class="me"><span class="av">${esc((act.name || '?')[0].toUpperCase())}</span><span class="who"><b>${esc(act.name || '')}</b><small>${t('lvl')} ${v.l} · ${xp} XP</small><progress value="${v.into}" max="${v.need}"></progress></span></div></div></aside>`; };
const solvedIn = (tp, list) => list.filter(p => progress[`${tp.id}/${p.id}`]).length;

function gate() {
  const msg = act.state === 'expired' ? t('s_expired') : act.state === 'clock' ? t('s_clock') : '';
  return `<div class="glass gate"><h2>${t('aT')}</h2>${msg ? `<div class="msg err">${msg}</div>` : ''}<p class="msg">${t('aH')}</p>
  ${act.state === 'clock' ? '' : `<input type="text" id="nm" placeholder="${t('aN')}" maxlength="60" autocomplete="off"><button class="btn" data-act="send">${t('aS')}</button>
  <input type="text" id="cd" placeholder="${t('aC')}" maxlength="6" inputmode="numeric" autocomplete="off"><button class="btn ghost" data-act="verify">${t('aV')}</button>`}
  <div class="msg ${noteErr ? 'err' : ''}" id="note" role="status">${esc(note)}</div></div>`;
}
function home() {
  const xp = xpOf(), v = lvl(xp), all = topics.flatMap(tp => flat(tp).map(p => ({ tp, p }))), key = x => x.tp.id + '/' + x.p.id, done = all.filter(x => progress[key(x)] > 0).length;
  const nx = all.find(x => !(progress[key(x)] > 0)), pend = topics.reduce((n, x) => n + (x.pending || 0), 0);
  return `<header class="htop"><div><p class="date">${new Date().toLocaleDateString(lang === 'uz' ? 'uz-UZ' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1>${t('hi')}${act.name ? ', ' + esc(act.name) : ''} 👋</h1></div>
  <div class="chips"><span class="chip">🔥 <b>${streak()}</b> ${t('daysS')}</span><span class="chip gold">⚡ <b>${xp}</b> XP</span></div></header>
  ${nx ? `<section class="hero"><div class="glow"></div><p class="eyebrow">${done ? t('cont') : t('first')} · ${esc(L(nx.tp.title))}</p><h2>${esc(L(nx.p.title))}</h2><p class="short">${esc(L(nx.p.statement))}</p><button class="btn" data-go="#/t/${nx.tp.id}/${nx.p.id}">${done ? t('cont') : t('start')} →</button></section>` : ''}
  <section class="stats"><div class="stat">${ring(v.into / v.need, 'gold', v.l)}<div><small>${t('lvl')}</small><b>${v.l}</b></div></div><div class="stat"><div><small>${t('solved')}</small><b>${done}<em>/${all.length}</em></b></div></div><div class="stat"><div><small>${t('pend')}</small><b>${pend}</b></div></div></section>
  <h2 class="sech">${t('topics')}</h2><div class="grid">${topics.map(x => { const s = stats(x); return `<button class="card" data-go="#/t/${x.id}">${ring(s.n ? s.d / s.n : 0, 'lapis', topics.indexOf(x) + 1)}<h3>${esc(L(x.title))}</h3><small>${s.d}/${s.n} ✓${x.pending ? ` · +${x.pending} ${t('wait')}` : ''}</small><progress value="${s.d}" max="${s.n || 1}"></progress></button>`; }).join('')}</div>`;
}
const SEC = { cw: 'classwork', hw: 'homework', pr: 'practice', bk: 'book', ex: 'extra' }, flat = tp => [...tp.classwork, ...tp.homework, ...(tp.book || []), ...(tp.practice || []), ...(tp.extra || [])];
const stOf = k => (progress[k] > 0 ? 'ok' : progress[k] < 0 ? 'self' : '');
const plist = (tp, list) => {
  const f = q ? list.filter(p => (L(p.title) + ' ' + L(p.statement)).toLowerCase().includes(q)) : list;
  return f.length ? `<div class="list">${f.map(p => `<button class="row" data-go="#/t/${tp.id}/${p.id}"><span class="dot ${stOf(tp.id + '/' + p.id)}"></span><b>${list.indexOf(p) + 1}.</b><span class="rt">${esc(L(p.title))}</span>${p.judged ? `<span class="tag ok">${t('auto')}</span>` : ''}</button>`).join('')}</div>` : `<p class="sub">${t('soon')}</p>`;
};
function topic(tp) {
  const tabs = ['cw', 'hw', 'bk', 'pr', 'ex'].filter(k => (tp[SEC[k]] || []).length); if (!tabs.includes(tab)) tab = tabs[0] || 'cw';
  const list = tp[SEC[tab]] || [], d = solvedIn(tp, list), lbl = { cw: t('cw'), hw: t('hw'), pr: t('prT'), bk: t('bkT'), ex: t('extraT') };
  return `<button class="crumb" data-go="#/">${t('back')}</button><h1>${esc(L(tp.title))}</h1>
  <div class="glass panel"><h2>${t('lesson')}</h2><p>${esc(L(tp.lesson))}</p></div>
  <div class="glass panel"><div class="bar"><div class="seg">${tabs.map(k => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${lbl[k]} · ${tp[SEC[k]].length}</button>`).join('')}</div>
  <input type="text" id="q" class="search" placeholder="${t('search')}" value="${esc(q)}"></div>
  <progress value="${d}" max="${list.length || 1}"></progress>${tp.pending ? `<p class="sub">${tp.pending} ${t('pendNote')}</p>` : ''}<div id="plist">${plist(tp, list)}</div></div>`;
}
function problem(tp, p) {
  const all = flat(tp), i = all.indexOf(p), k = tp.id + '/' + p.id;
  const nav = (x, a) => x ? `<button class="btn ghost" data-go="#/t/${tp.id}/${x.id}">${a}</button>` : `<button class="btn ghost" disabled>${a}</button>`;
  return `<button class="crumb" data-go="#/t/${tp.id}">${t('back')}</button>
  <div class="phead"><h1>${esc(L(p.title))}</h1><div class="nav">${nav(all[i - 1], '←')}<span>${i + 1} / ${all.length}</span>${nav(all[i + 1], '→')}</div></div>
  <div class="split"><div class="glass panel"><span class="tag ${p.judged ? 'ok' : ''}">${p.judged ? t('auto') : t('practice')}</span>
   <p class="stmt">${esc(L(p.statement))}</p>${p.inputFormat ? `<h2>${t('inp')}</h2><p>${esc(L(p.inputFormat))}</p>` : ''}${p.outputFormat ? `<h2>${t('out')}</h2><p>${esc(L(p.outputFormat))}</p>` : ''}
   ${p.examples.length ? `<h2>${t('ex')}</h2>` + p.examples.map(e => `<b>${t('input')}</b><pre>${esc(e.in) || '∅'}</pre><b>${t('out')}</b><pre>${esc(e.out)}</pre>`).join('') : ''}</div>
  <div class="glass panel"><h2>${t('bench')}</h2><div class="drop" id="drop"><span id="fname">${curName ? '📄 ' + esc(curName) : t('drop')}</span><button class="btn ghost" data-act="pick">${t('pick')}</button><input type="file" id="file" accept=".fprg" hidden></div>
   <h2>${t('inp')}</h2><textarea id="inp" rows="4" placeholder="${t('inpHint')}">${esc(p.examples[0]?.in ?? '')}</textarea>
   <div class="actions"><button class="btn ghost" data-act="run">▶ ${t('run')}</button>${p.judged ? `<button class="btn" data-act="judge">✓ ${t('submit')}</button>` : `<button class="btn" data-act="mark">${stOf(k) ? '✓ ' : ''}${t('mark')}</button>`}</div>
   <div id="result" aria-live="polite"></div></div></div>`;
}
const resultHtml = r => {
  if (r.error) return `<div class="res bad">${esc(r.error)}</div>`;
  const f = r.results.find(x => x.verdict !== 'AC' && x.input !== undefined);
  return `<div class="res ${r.verdict === 'AC' ? 'ok' : 'bad'}"><div class="vd"><b>${t(r.verdict)}</b><span>${r.passed}/${r.total} ${t('tests')}</span></div>${r.message ? `<p>${esc(r.message)}</p>` : ''}
  <div class="chips">${r.results.map(x => `<span class="chip ${x.verdict === 'AC' ? 'ok' : 'bad'}" title="${esc(x.message || x.verdict)}">${x.n}</span>`).join('')}</div>
  ${f ? `<b>${t('input')}</b><pre>${esc(f.input)}</pre><b>${t('exp')}</b><pre>${esc(f.expected)}</pre><b>${t('got')}</b><pre>${esc(f.got)}</pre>${f.message ? `<small>${esc(f.message)}</small>` : ''}` : ''}</div>`;
};

function render() {
  applyTheme(); const [, , tid, pid] = location.hash.split('/');
  if (act.state !== 'ok') { app.innerHTML = `<main class="solo"><div class="gatebar">${tgl()}${langSeg()}</div><div class="gatelogo"><img class="logo" src="mascot.png" alt=""><b class="wm">m<i>ı</i>rae</b><b class="fl">flow</b><small class="credit">Mirae Academy created this</small></div>${gate()}</main>`; return; }
  const tp = topics.find(x => x.id === tid), p = tp && flat(tp).find(x => x.id === pid);
  app.innerHTML = `<div class="shell">${sidebar()}<main><button class="btn ghost menu" data-act="menu">☰</button>${p ? problem(tp, p) : tp ? topic(tp) : home()}</main></div>`;
}
async function submit(file) {   // picks the file (kept in memory only)
  if (!file) return; const big = file.size > 1e6; curFile = big ? null : await file.text(); curName = big ? '' : file.name;
  const n = document.getElementById('fname'); if (n) n.textContent = big ? t('big') : '📄 ' + curName;
}
const ids = () => { const [, , topic, problem] = location.hash.split('/'); return { topic, problem }; };
const show = html => { const b = document.getElementById('result'); if (b) b.innerHTML = html; };
async function doAct(a) {
  if (a === 'mark') { await api.mark(ids()); progress = (await api.state()).progress; return render(); }
  if (!curFile) return show(`<div class="res bad">${t('needFile')}</div>`);
  show(`<div class="res">${t('busy')}</div>`);
  if (a === 'run') { const r = await api.run({ ...ids(), file: curFile, input: document.getElementById('inp').value });
    return show(r.error ? `<div class="res bad"><b>${t(r.kind || 'RE')}</b><p>${esc(r.error)}</p></div>` : `<div class="res"><b>${t('out')}</b><pre>${esc(r.out) || '∅'}</pre></div>`); }
  const r = await api.judge({ ...ids(), file: curFile }); show(resultHtml(r)); if (r.verdict === 'AC') progress = (await api.state()).progress;
}
function openPal() { if (document.getElementById('pal') || act.state !== 'ok') return; const d = document.createElement('div'); d.id = 'pal'; d.className = 'pal';
  d.innerHTML = `<div class="pbox"><input id="ps" type="text" placeholder="${t('search')}" autocomplete="off"><div id="pr"></div></div>`; document.body.appendChild(d); fillPal(''); document.getElementById('ps').focus(); }
const closePal = () => document.getElementById('pal')?.remove();
function fillPal(v) { v = v.trim().toLowerCase(); const r = topics.flatMap(tp => flat(tp).map(p => ({ tp, p }))).filter(x => !v || (L(x.p.title) + ' ' + L(x.p.statement)).toLowerCase().includes(v)).slice(0, 12);
  document.getElementById('pr').innerHTML = r.map(x => `<button class="prow" data-go="#/t/${x.tp.id}/${x.p.id}"><small>${esc(L(x.tp.title))}</small><span>${esc(L(x.p.title))}</span></button>`).join('') || '<p class="sub">—</p>'; }
document.addEventListener('click', e => { if (e.target.id === 'pal') closePal(); });
const setNote = (m, err) => { note = m; noteErr = !!err; const n = document.getElementById('note'); if (n) { n.textContent = m; n.className = 'msg' + (err ? ' err' : ''); } };

document.addEventListener('click', async e => {
  const b = e.target.closest('button, [data-go]'); if (!b) return;
  if (b.dataset.go) { location.hash = b.dataset.go; closePal(); document.querySelector('.side')?.classList.remove('open'); }
  else if (b.dataset.lang) { lang = localStorage.lang = b.dataset.lang; render(); }
  else if (b.dataset.act === 'theme') { theme = localStorage.theme = isDark() ? 'light' : 'dark'; render(); }
  else if (b.dataset.theme) { theme = localStorage.theme = b.dataset.theme; render(); }
  else if (b.dataset.act === 'menu') document.querySelector('.side')?.classList.toggle('open');
  else if (b.dataset.act === 'pal') openPal();
  else if (b.dataset.tab) { tab = b.dataset.tab; q = ''; render(); }
  else if (['run', 'judge', 'mark'].includes(b.dataset.act)) doAct(b.dataset.act);
  else if (b.dataset.act === 'pick') document.getElementById('file').click();
  else if (b.dataset.act === 'send') { const r = await api.request(document.getElementById('nm').value); setNote(r.ok ? t('sent') : t(r.error), !r.ok); }
  else if (b.dataset.act === 'verify') { const r = await api.verify(document.getElementById('cd').value);
    if (r.ok) { act = await api.status(); setNote(''); render(); } else setNote(t(r.error), true); }
});
document.addEventListener('change', e => { if (e.target.id === 'file') { submit(e.target.files[0]); e.target.value = ''; } });
document.addEventListener('dragover', e => { const d = e.target.closest('#drop'); if (d) { e.preventDefault(); d.classList.add('over'); } });
document.addEventListener('dragleave', e => e.target.closest?.('#drop')?.classList.remove('over'));
document.addEventListener('drop', e => { const d = e.target.closest('#drop'); e.preventDefault(); if (d) { d.classList.remove('over'); submit(e.dataTransfer.files[0]); } });
window.addEventListener('hashchange', () => { const k = ids().problem; if (k !== lastKey) { curFile = null; curName = ''; lastKey = k; } closePal(); render(); });
document.addEventListener('input', e => { if (e.target.id === 'ps') return fillPal(e.target.value); if (e.target.id !== 'q') return; q = e.target.value.trim().toLowerCase();
  const tp = topics.find(x => x.id === ids().topic), el = document.getElementById('plist'); if (tp && el) el.innerHTML = plist(tp, tp[SEC[tab]] || []); });
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') { e.preventDefault(); return openPal(); }
  if (e.key === 'Escape') closePal();
  if (e.ctrlKey && e.key.toLowerCase() === 'b') document.querySelector('.shell')?.classList.toggle('collapsed');
  if (e.ctrlKey && e.key === 'Enter') return document.querySelector('[data-act=judge],[data-act=run]')?.click();
  if (e.ctrlKey && e.key === 'o') { e.preventDefault(); return document.getElementById('file')?.click(); }
  if (e.target.matches?.('input,textarea') || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  document.querySelectorAll('.nav button')[e.key === 'ArrowLeft' ? 0 : 1]?.click();
});
(async () => { act = await api.status(); topics = await api.topics(); progress = (await api.state()).progress; render(); })();
})();
