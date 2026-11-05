// Offline data layer: the same interface the web app used to call on a server, now fully local.
// Problems are bundled, .fprg files are judged in the browser by the bundled Flowgorithm interpreter, progress lives in localStorage.
import catalogData from '../data/problemCatalog.json';

export interface ApiUser { id: string; displayName: string; firstName: string; lastName: string; groupName: string; school: string; phone: string; email: string; role: 'student' | 'teacher' | 'admin'; createdAt: string }
export interface ApiStudentProfile { firstName: string; lastName: string; groupName: string; school: string; phone: string; email: string }
export interface ApiSubmission { id: string; problemId: string; verdict: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | string; output: string; message: string; runtimeMs: number; createdAt: string }
export interface ApiStats { solved: string[]; attempts: number; accepted: number; activityDates: string[]; recentSubmissions: ApiSubmission[] }
export interface ApiExample { input: string; output: string }
export interface ApiProblem {
  id: string; topicId: string; topicTitleEn: string; topicTitleUz: string; sourceProblemNo: number; topicSequenceNo: number; sourcePart: number; sourceSection: string; sourceBook: string;
  titleUz: string; titleEn: string; statementUz: string; statementEn: string; set: 'classwork' | 'homework' | 'mastery'; difficulty: 'beginner' | 'middle' | 'finish'; xp: number; judgeReady: boolean;
  examples?: ApiExample[]; checker?: string;
}
export interface ApiTopic { id: string; slug: string; titleUz: string; titleEn: string; subtitleUz: string; subtitleEn: string; sourceHeading: string | null; state: 'available' | 'awaiting-source'; problemCount: number }
export interface ApiLeaderboardEntry { rank: number; userId: string; displayName: string; solved: number }

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status; }
}

const catalog = catalogData as unknown as { topics: Omit<ApiTopic, 'problemCount'>[]; problems: ApiProblem[] };
const LS_USER = 'mirae-flow-user-v1', LS_SUBS = 'mirae-flow-submissions-v1';
const VERDICT: Record<string, string> = { AC: 'Accepted', WA: 'Wrong Answer', RE: 'Runtime Error', TLE: 'Time Limit Exceeded', CE: 'Compilation Error' };

function read<T>(key: string, fallback: T): T { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }
function write(key: string, value: unknown): boolean { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
const uid = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const VALID_VERDICTS = new Set(['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error']);
const KNOWN_PROBLEM_IDS = new Set(catalog.problems.map((problem) => problem.id));
const cleanStoredText = (value: unknown, max: number) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max) : '';
function subs(): ApiSubmission[] {
  const raw = read<unknown>(LS_SUBS, []);
  if (!Array.isArray(raw)) return [];
  const normalized: ApiSubmission[] = [];
  for (const item of raw.slice(0, 5000)) {
    if (!item || typeof item !== 'object') continue;
    const value = item as Partial<ApiSubmission>;
    if (typeof value.id !== 'string' || !value.id || value.id.length > 100) continue;
    if (typeof value.problemId !== 'string' || !KNOWN_PROBLEM_IDS.has(value.problemId)) continue;
    if (!VALID_VERDICTS.has(String(value.verdict))) continue;
    if (typeof value.createdAt !== 'string' || !Number.isFinite(Date.parse(value.createdAt))) continue;
    normalized.push({
      id: value.id,
      problemId: value.problemId,
      verdict: value.verdict as ApiSubmission['verdict'],
      output: cleanStoredText(value.output, 20_000),
      message: cleanStoredText(value.message, 4_000),
      runtimeMs: Number.isFinite(value.runtimeMs) ? Math.max(0, Math.min(120_000, Number(value.runtimeMs))) : 0,
      createdAt: new Date(value.createdAt).toISOString(),
    });
  }
  return normalized.slice(0, 500);
}
function me(): ApiUser {
  const raw = read<unknown>(LS_USER, null);
  const stored = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw as Partial<ApiUser> : null;
  if (!stored || typeof stored.id !== 'string' || !stored.id || stored.id.length > 100) {
    const fresh: ApiUser = { id: uid(), displayName: 'Talaba', firstName: '', lastName: '', groupName: '', school: '', phone: '', email: '', role: 'student', createdAt: new Date().toISOString() };
    write(LS_USER, fresh);
    return fresh;
  }
  const legacyNames = cleanStoredText(stored.displayName, 100).trim().split(/\s+/);
  const firstName = cleanStoredText(stored.firstName, 40) || legacyNames[0] || '';
  const lastName = cleanStoredText(stored.lastName, 50) || legacyNames.slice(1).join(' ');
  const fullName = `${firstName} ${lastName}`.trim();
  const createdAt = typeof stored.createdAt === 'string' && Number.isFinite(Date.parse(stored.createdAt)) ? new Date(stored.createdAt).toISOString() : new Date().toISOString();
  const user: ApiUser = {
    id: stored.id,
    displayName: fullName || 'Talaba',
    firstName, lastName,
    groupName: cleanStoredText(stored.groupName, 50),
    school: cleanStoredText(stored.school, 100),
    phone: cleanStoredText(stored.phone, 30),
    email: cleanStoredText(stored.email, 120),
    role: 'student',
    createdAt,
  };
  write(LS_USER, user);
  return user;
}
const page = <T,>(items: T[], p: number, size: number) => ({ items: items.slice((p - 1) * size, p * size), total: items.length, page: p, pageSize: size });
let testsPromise: Promise<Record<string, { mode: string; tests: { in?: string; out: string | string[]; hidden?: boolean }[] }>> | null = null;

export const api = {
  health: async () => ({ status: 'ok', importedProblems: catalog.problems.length }),
  topics: async (): Promise<ApiTopic[]> => catalog.topics.map((t) => ({ ...t, problemCount: catalog.problems.filter((p) => p.topicId === t.id).length })),
  problems: async (p = 1, size = 100) => { const x = page(catalog.problems, p, size); return { items: x.items, total: x.total, page: x.page, pages: Math.max(1, Math.ceil(x.total / size)) }; },
  me: async () => ({ user: me() }),
  updateProfile: async (profile: Partial<ApiStudentProfile>) => {
    const current = me();
    const clean = (value: unknown, max: number) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
    const firstName = clean(profile.firstName ?? current.firstName, 40);
    const lastName = clean(profile.lastName ?? current.lastName, 50);
    const phone = clean(profile.phone ?? current.phone, 30);
    const email = clean(profile.email ?? current.email, 120).toLowerCase();
    if (!firstName) throw new ApiError('Ism / First name is required.', 400);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new ApiError('Email address is not valid.', 400);
    if (phone && !/^[+0-9()\-\s]{6,30}$/.test(phone)) throw new ApiError('Phone number contains unsupported characters.', 400);
    const next: ApiUser = { ...current, firstName, lastName, groupName: clean(profile.groupName ?? current.groupName, 50), school: clean(profile.school ?? current.school, 100), phone, email, displayName: `${firstName} ${lastName}`.trim() || 'Talaba' };
    if (!write(LS_USER, next)) throw new ApiError('Could not save profile. Browser storage may be full or disabled.', 507);
    return { user: next };
  },
  stats: async (): Promise<ApiStats> => {
    const all = subs(), accepted = all.filter((s) => s.verdict === 'Accepted');
    return { solved: [...new Set(accepted.map((s) => s.problemId))], attempts: all.length, accepted: accepted.length, activityDates: [...new Set(all.map((s) => s.createdAt.slice(0, 10)))], recentSubmissions: all.slice(0, 8) };
  },
  submissions: async (p = 1, size = 50) => page(subs(), p, size),
  problemSubmissions: async (problemId: string, p = 1, size = 20) => page(subs().filter((s) => s.problemId === problemId), p, size),
  submit: async (problemId: string, sourceCode: string): Promise<ApiSubmission> => {
    const meta = catalog.problems.find((p) => p.id === problemId);
    if (!meta) throw new ApiError('Problem not found.', 404);
    if (typeof sourceCode !== 'string' || sourceCode.length === 0) throw new ApiError('Upload a valid .fprg file.', 400);
    if (sourceCode.length > 1_000_000) throw new ApiError('File is too large (max 1 MB).', 413);
    testsPromise ??= import('../data/problemTests.json').then((m) => m.default as never);
    const entry = (await testsPromise)[problemId];
    if (!meta.judgeReady || !entry) throw new ApiError('This problem has no automatic checker yet.', 409);
    const { judge } = await import('./fprg.js');
    await new Promise((r) => setTimeout(r, 40));              // let the UI paint "checking…"
    const t0 = performance.now(), res = judge(sourceCode, entry.tests, { mode: entry.mode }), ms = Math.round(performance.now() - t0);
    const bad = res.results.find((r) => r.verdict !== 'AC');
    let message = `${res.passed}/${res.total} tests passed`;
    if (res.message) message += ` — ${res.message}`;
    if (bad) {
      message += ` — test ${bad.n}: ${VERDICT[bad.verdict]}${bad.message ? ` (${bad.message})` : ''}`;
      if (bad.input !== undefined) message += `\nInput:\n${bad.input || '∅'}\nExpected:\n${bad.expected ?? ''}\nYours:\n${bad.got || '∅'}`;
    }
    const sub: ApiSubmission = { id: uid(), problemId, verdict: VERDICT[res.verdict] ?? res.verdict, output: bad?.got ?? '', message, runtimeMs: ms, createdAt: new Date().toISOString() };
    if (!write(LS_SUBS, [sub, ...subs()].slice(0, 500))) throw new ApiError('Could not save the submission. Browser storage may be full or disabled.', 507);
    return sub;
  },
  leaderboard: async (): Promise<ApiLeaderboardEntry[]> => { const u = me(); return [{ rank: 1, userId: u.id, displayName: u.displayName, solved: new Set(subs().filter((s) => s.verdict === 'Accepted').map((s) => s.problemId)).size }]; },
  exportProgress: () => JSON.stringify({ app: 'mirae-flow', version: 2, exportedAt: new Date().toISOString(), user: me(), submissions: subs() }, null, 2),
  importProgress: (json: string) => {
    if (typeof json !== 'string' || json.length > 2_000_000) throw new Error('Progress file is too large (max 2 MB).');
    const d = JSON.parse(json) as { app?: string; version?: number; user?: Partial<ApiUser>; submissions?: unknown[] };
    if (d.app !== 'mirae-flow' || ![1, 2].includes(Number(d.version)) || !Array.isArray(d.submissions) || d.submissions.length > 5000) throw new Error('Not a supported Mirae Flow progress file.');
    const knownProblems = new Set(catalog.problems.map((problem) => problem.id));
    const seen = new Set<string>();
    const valid: ApiSubmission[] = [];
    for (const item of d.submissions) {
      if (!item || typeof item !== 'object') continue;
      const value = item as Partial<ApiSubmission>;
      if (typeof value.id !== 'string' || value.id.length > 100 || seen.has(value.id)) continue;
      if (typeof value.problemId !== 'string' || !knownProblems.has(value.problemId)) continue;
      if (!['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error'].includes(String(value.verdict))) continue;
      if (typeof value.createdAt !== 'string' || !Number.isFinite(Date.parse(value.createdAt))) continue;
      seen.add(value.id);
      valid.push({
        id: value.id,
        problemId: value.problemId,
        verdict: value.verdict as ApiSubmission['verdict'],
        output: typeof value.output === 'string' ? value.output.slice(0, 20_000) : '',
        message: typeof value.message === 'string' ? value.message.slice(0, 4_000) : '',
        runtimeMs: Number.isFinite(value.runtimeMs) ? Math.max(0, Math.min(120_000, Number(value.runtimeMs))) : 0,
        createdAt: new Date(value.createdAt).toISOString(),
      });
    }
    const have = new Set(subs().map((submission) => submission.id));
    const merged = [...subs(), ...valid.filter((submission) => !have.has(submission.id))].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (!write(LS_SUBS, merged.slice(0, 500))) throw new Error('Could not import submissions: local storage is full.');
    if (d.user && typeof d.user === 'object') {
      const current = me();
      const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
      const firstName = clean(d.user.firstName, 40);
      const lastName = clean(d.user.lastName, 50);
      const emailCandidate = clean(d.user.email, 120).toLowerCase();
      const phoneCandidate = clean(d.user.phone, 30);
      const email = !emailCandidate || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailCandidate) ? emailCandidate : current.email;
      const phone = !phoneCandidate || /^[+0-9()\-\s]{6,30}$/.test(phoneCandidate) ? phoneCandidate : current.phone;
      const profile: ApiUser = { ...current, firstName: firstName || current.firstName, lastName, groupName: clean(d.user.groupName, 50), school: clean(d.user.school, 100), phone, email, displayName: `${firstName || current.firstName} ${lastName}`.trim() || 'Talaba' };
      if (!write(LS_USER, profile)) throw new Error('Could not import profile: local storage is full.');
    }
  },
  resetProgress: () => { if (!write(LS_SUBS, [])) throw new ApiError('Could not clear progress. Browser storage may be unavailable.', 507); },
  getProfile: () => me(),
};
