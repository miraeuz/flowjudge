// Offline data layer: the same interface the web app used to call on a server, now fully local.
// Problems are bundled, .fprg files are judged in the browser by the bundled Flowgorithm interpreter, progress lives in localStorage.
import catalogData from '../data/problemCatalog.json';

export interface ApiUser { id: string; displayName: string; email: string; role: 'student' | 'teacher' | 'admin'; createdAt: string }
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
function write(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ } }
const uid = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const subs = () => read<ApiSubmission[]>(LS_SUBS, []);
function me(): ApiUser {
  let user = read<ApiUser | null>(LS_USER, null);
  if (!user) { user = { id: uid(), displayName: 'Talaba', email: '', role: 'student', createdAt: new Date().toISOString() }; write(LS_USER, user); }
  return user;
}
const page = <T,>(items: T[], p: number, size: number) => ({ items: items.slice((p - 1) * size, p * size), total: items.length, page: p, pageSize: size });
let testsPromise: Promise<Record<string, { mode: string; tests: { in?: string; out: string | string[]; hidden?: boolean }[] }>> | null = null;

export const api = {
  health: async () => ({ status: 'ok', importedProblems: catalog.problems.length }),
  topics: async (): Promise<ApiTopic[]> => catalog.topics.map((t) => ({ ...t, problemCount: catalog.problems.filter((p) => p.topicId === t.id).length })),
  problems: async (p = 1, size = 100) => { const x = page(catalog.problems, p, size); return { items: x.items, total: x.total, page: x.page, pages: Math.max(1, Math.ceil(x.total / size)) }; },
  me: async () => ({ user: me() }),
  register: async (displayName: string, email: string, _password: string) => { void _password; const user = { ...me(), displayName: displayName.trim().slice(0, 40) || 'Talaba', email }; write(LS_USER, user); return { user }; },
  login: async (_email: string, _password: string) => { void _email; void _password; return { user: me() }; },
  logout: async () => ({ ok: true }),
  stats: async (): Promise<ApiStats> => {
    const all = subs(), accepted = all.filter((s) => s.verdict === 'Accepted');
    return { solved: [...new Set(accepted.map((s) => s.problemId))], attempts: all.length, accepted: accepted.length, activityDates: [...new Set(all.map((s) => s.createdAt.slice(0, 10)))], recentSubmissions: all.slice(0, 8) };
  },
  submissions: async (p = 1, size = 50) => page(subs(), p, size),
  problemSubmissions: async (problemId: string, p = 1, size = 20) => page(subs().filter((s) => s.problemId === problemId), p, size),
  submit: async (problemId: string, sourceCode: string): Promise<ApiSubmission> => {
    const meta = catalog.problems.find((p) => p.id === problemId);
    if (!meta) throw new ApiError('Problem not found.', 404);
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
    write(LS_SUBS, [sub, ...subs()].slice(0, 500));
    return sub;
  },
  leaderboard: async (): Promise<ApiLeaderboardEntry[]> => { const u = me(); return [{ rank: 1, userId: u.id, displayName: u.displayName, solved: new Set(subs().filter((s) => s.verdict === 'Accepted').map((s) => s.problemId)).size }]; },
  exportProgress: () => JSON.stringify({ app: 'mirae-flow', version: 1, user: me(), submissions: subs() }, null, 1),
  importProgress: (json: string) => {
    const d = JSON.parse(json) as { app?: string; user?: ApiUser; submissions?: ApiSubmission[] };
    if (d.app !== 'mirae-flow' || !Array.isArray(d.submissions)) throw new Error('Not a Mirae Flow progress file');
    const have = new Set(subs().map((s) => s.id)), merged = [...subs(), ...d.submissions.filter((s) => !have.has(s.id))].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    write(LS_SUBS, merged.slice(0, 500)); if (d.user) write(LS_USER, { ...me(), displayName: d.user.displayName });
  },
  resetProgress: () => { write(LS_SUBS, []); },
};
