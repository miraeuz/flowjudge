import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode, RefObject } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity, ArrowLeft, ArrowRight, ArrowUpRight, Award, BarChart3,
  BookOpen, BookMarked, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, Clock3, Code2, Compass, FileCode2, Flame, GraduationCap,
  Home, Languages, Layers3, ListFilter, LockKeyhole, LogIn, Menu,
  Moon, Search, Settings2, ShieldCheck, Sparkles, Sun, Target, Trophy,
  UploadCloud, UserRound, Users, Workflow, X, Zap, ZoomIn, ZoomOut,
  CircleDot, CircleX, CircleAlert, ExternalLink, Download,
} from 'lucide-react';
import catalogData from './data/problemCatalog.json';
import { api, ApiError, type ApiLeaderboardEntry, type ApiProblem, type ApiStats, type ApiSubmission, type ApiTopic, type ApiUser } from './lib/api';
import { currentPath, resolveRoute, routePath } from './lib/routes';
import { useMiraeStore, type NavigationPage, type ThemeMode } from './lib/storage';

type Problem = ApiProblem;
type Topic = ApiTopic;
type PageKey = NavigationPage;
type FilterSet = 'all' | 'classwork' | 'homework' | 'mastery';
type FilterLevel = 'all' | 'beginner' | 'middle' | 'finish';
type FilterStatus = 'all' | 'solved' | 'unsolved' | 'judge-ready';

const localCatalog = catalogData as {
  meta: { importedProblemCount: number; sourceFile: string };
  topics: Omit<Topic, 'problemCount'>[];
  problems: Problem[];
};
const localTopics: Topic[] = localCatalog.topics.map((topic) => ({
  ...topic,
  problemCount: localCatalog.problems.filter((problem) => problem.topicId === topic.id).length,
}));
const pageTitles: Record<PageKey, string> = {
  dashboard: 'Dashboard', roadmap: 'Learning roadmap', topics: 'Topics', problems: 'Problemset',
  problem: 'Problem workspace', submissions: 'Submissions',
  leaderboard: 'Leaderboard', account: 'Account', settings: 'Settings',
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'S';
}

function difficultyLabel(value: Problem['difficulty'], uz = false) {
  if (value === 'beginner') return uz ? 'Boshlang‘ich' : 'Easy';
  if (value === 'middle') return uz ? 'O‘rta' : 'Medium';
  return uz ? 'Yakuniy' : 'Hard';
}

function verdictTone(verdict: string) {
  return verdict === 'Accepted' ? 'accepted' : verdict === 'Wrong Answer' ? 'wrong' : 'runtime';
}

function useStreak(dates: string[]) {
  return useMemo(() => {
    const days = new Set(dates);
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!days.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
    let total = 0;
    while (days.has(key(cursor))) { total += 1; cursor.setDate(cursor.getDate() - 1); }
    return total;
  }, [dates]);
}

function App() {
  const { theme, language, zoom, setTheme, setLanguage, setZoom, setActivePage } = useMiraeStore();
  const [route, setRoute] = useState(() => resolveRoute(currentPath()));
  const [mobileMenu, setMobileMenu] = useState(false);
  const [problems, setProblems] = useState<Problem[]>(localCatalog.problems);
  const [topics, setTopics] = useState<Topic[]>(localTopics);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [remoteStats, setRemoteStats] = useState<ApiStats | null>(null);
  const [globalSubmissions, setGlobalSubmissions] = useState<ApiSubmission[]>([]);
  const [leaderboard, setLeaderboard] = useState<ApiLeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [setFilter, setSetFilter] = useState<FilterSet>('all');
  const [levelFilter, setLevelFilter] = useState<FilterLevel>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortOrder, setSortOrder] = useState<'sequence' | 'difficulty'>('sequence');
  const [accountRefresh, setAccountRefresh] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const isUz = language === 'uz';

  const [selectedProblemId, setSelectedProblemId] = useState(() => resolveRoute(currentPath()).problemId ?? 'BAS-001');
  const selectedProblem = problems.find((problem) => problem.id === selectedProblemId);
  const solved = user && remoteStats ? remoteStats.solved : [];
  const attempts = user && remoteStats ? remoteStats.attempts : 0;
  const activityDates = user && remoteStats ? remoteStats.activityDates : [];
  const streak = useStreak(activityDates);

  useEffect(() => { document.documentElement.style.fontSize = `${16 * zoom / 100}px`; }, [zoom]);
  useEffect(() => { document.documentElement.lang = language; }, [language]);

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const effective = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      root.dataset.theme = effective;
      root.style.colorScheme = effective;
    };
    applyTheme();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  useEffect(() => {
    const handlePop = () => {
      const next = resolveRoute(currentPath());
      setRoute(next);
      if (next.problemId) setSelectedProblemId(next.problemId);
      setActivePage(next.page);
      setMobileMenu(false);
    };
    window.addEventListener('popstate', handlePop); window.addEventListener('hashchange', handlePop);
    return () => { window.removeEventListener('popstate', handlePop); window.removeEventListener('hashchange', handlePop); };
  }, [setActivePage]);

  useEffect(() => {
    let alive = true;
    const boot = async () => {
      try {
        const health = await api.health();
        if (!alive) return;
        setApiOnline(true);
        setApiMessage('');
        if (health.importedProblems > 0) {
          const first = await api.problems(1, 100);
          const pages = await Promise.all(Array.from({ length: Math.max(0, first.pages - 1) }, (_, index) => api.problems(index + 2, 100)));
          const all = [...first.items, ...pages.flatMap((page) => page.items)];
          if (all.length) setProblems(all);
        }
        const topicData = await api.topics();
        if (topicData.length) setTopics(topicData);
        try {
          const session = await api.me();
          if (!alive) return;
          setUser(session.user);
          const stats = await api.stats();
          if (alive) setRemoteStats(stats);
        } catch (error) {
          if (error instanceof ApiError && error.status !== 401 && alive) setApiMessage(error.message);
        }
      } catch (error) {
        if (alive) {
          setApiOnline(false);
          setApiMessage(error instanceof Error ? error.message : 'API unavailable');
        }
      }
    };
    void boot();
    return () => { alive = false; };
  }, [accountRefresh]);

  useEffect(() => {
    document.title = `${route.page === 'problem' && selectedProblem ? `${selectedProblem.id} · ` : ''}${pageTitles[route.page]} — Mirae Flow`;
  }, [route.page, selectedProblem]);

  const navigate = (page: PageKey, problemId?: string, replace = false) => {
    const path = routePath(page, problemId);
    if (currentPath() !== path) {
      if (replace) window.history.replaceState({}, '', `#${path}`);
      else window.history.pushState({}, '', `#${path}`);
    }
    setRoute({ page, problemId });
    if (problemId) setSelectedProblemId(problemId);
    setActivePage(page);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadUserData = async () => {
    if (!user) return;
    const [stats, submissions] = await Promise.all([api.stats(), api.submissions(1, 100)]);
    setRemoteStats(stats);
    setGlobalSubmissions(submissions.items);
  };

  const onAuth = (nextUser: ApiUser) => {
    setUser(nextUser);
    setAccountRefresh((value) => value + 1);
    navigate('dashboard');
  };

  const onLogout = async () => {
    try { await api.logout(); } catch { /* Local guest mode remains available if the API is down. */ }
    setUser(null);
    setRemoteStats(null);
    setGlobalSubmissions([]);
    navigate('dashboard');
  };

  const submitFlowchart = async (problem: Problem, source: string) => {
    if (!user) {
      navigate('account');
      setApiMessage(isUz ? 'Yechim yuborish uchun avval tizimga kiring.' : 'Sign in before submitting a solution.');
      return null;
    }
    try {
      const result = await api.submit(problem.id, source);
      setApiOnline(true);
      setApiMessage('');
      await loadUserData();
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Submission failed.';
      setApiMessage(message);
      throw error;
    }
  };

  const filteredProblems = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const rows = problems.filter((problem) => {
      if (topicFilter !== 'all' && problem.topicId !== topicFilter) return false;
      if (setFilter !== 'all' && problem.set !== setFilter) return false;
      if (levelFilter !== 'all' && problem.difficulty !== levelFilter) return false;
      if (statusFilter === 'solved' && !solved.includes(problem.id)) return false;
      if (statusFilter === 'unsolved' && solved.includes(problem.id)) return false;
      if (statusFilter === 'judge-ready' && !problem.judgeReady) return false;
      if (query && !`${problem.id} ${problem.titleUz} ${problem.statementUz} ${problem.topicTitleEn}`.toLocaleLowerCase().includes(query)) return false;
      return true;
    });
    if (sortOrder === 'difficulty') {
      const weights = { beginner: 1, middle: 2, finish: 3 };
      rows.sort((a, b) => weights[a.difficulty] - weights[b.difficulty] || a.topicId.localeCompare(b.topicId) || a.topicSequenceNo - b.topicSequenceNo);
    } else {
      rows.sort((a, b) => a.topicId.localeCompare(b.topicId) || a.topicSequenceNo - b.topicSequenceNo);
    }
    return rows;
  }, [problems, topicFilter, setFilter, levelFilter, statusFilter, searchQuery, solved, sortOrder]);

  useEffect(() => {
    const onCommand = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        navigate('problems');
        window.setTimeout(() => searchRef.current?.focus(), 80);
      }
      if (event.key === 'Escape' && mobileMenu) setMobileMenu(false);
    };
    window.addEventListener('keydown', onCommand);
    return () => window.removeEventListener('keydown', onCommand);
  }, [mobileMenu]);

  useEffect(() => {
    if (route.page === 'submissions' && user) void api.submissions(1, 100).then((r) => setGlobalSubmissions(r.items)).catch((e) => setApiMessage(e.message));
    if (route.page === 'leaderboard') void api.leaderboard().then(setLeaderboard).catch(() => setLeaderboard([]));
  }, [route.page, user]);

  const activePageTitle = route.page === 'problem' && selectedProblem
    ? selectedProblem.id
    : pageTitles[route.page];
  const displaySolved = solved.length;

  return (
    <div className="platform-shell">
      <aside className={`platform-sidebar ${mobileMenu ? 'is-open' : ''}`}>
        <div className="brand-row">
          <img src="./mascot.png" alt="Mirae Flow" className="brand-mascot" />
          <div className="brand-text"><strong>m<span className="brand-dot">ı</span>rae</strong><span>FLOW</span></div>
          <button className="icon-btn sidebar-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-pill"><span className="workspace-emblem"><GraduationCap size={17}/></span><span><strong>Mirae Academy</strong><small>Learning workspace</small></span><ChevronDown size={15}/></div>
        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-caption">LEARN</span>
          <SideLink active={route.page === 'dashboard'} icon={<Home size={18}/>} label={isUz ? 'Bosh sahifa' : 'Overview'} onClick={() => navigate('dashboard')}/>
          <SideLink active={route.page === 'roadmap'} icon={<Compass size={18}/>} label={isUz ? 'O‘quv xaritasi' : 'Roadmap'} onClick={() => navigate('roadmap')}/>
          <SideLink active={route.page === 'topics'} icon={<Layers3 size={18}/>} label={isUz ? 'Mavzular' : 'Topics'} onClick={() => navigate('topics')}/>
          <SideLink active={route.page === 'problems' || route.page === 'problem'} icon={<BookMarked size={18}/>} label="Problemset" onClick={() => navigate('problems')} count={problems.length}/>
          <span className="nav-caption nav-caption-spaced">COMPETE</span>
          <SideLink active={route.page === 'submissions'} icon={<Activity size={18}/>} label={isUz ? 'Yuborilgan yechimlar' : 'Submissions'} onClick={() => navigate('submissions')}/>
          <SideLink active={route.page === 'leaderboard'} icon={<Trophy size={18}/>} label={isUz ? 'Reyting' : 'Leaderboard'} onClick={() => navigate('leaderboard')}/>
        </nav>
        <div className="sidebar-progress-card">
          <div className="sidebar-progress-head"><span>YOUR PROGRESS</span><strong>{displaySolved}/{problems.length}</strong></div>
          <div className="meter"><i style={{ width: `${problems.length ? displaySolved / problems.length * 100 : 0}%` }}/></div>
          <small>{isUz ? 'Har kuni kichik qadam.' : 'A little progress every day.'}</small>
        </div>
        <div className="sidebar-bottom">
          <button className={`side-link ${route.page === 'account' ? 'active' : ''}`} onClick={() => navigate('account')}><UserRound size={18}/><span>{user ? user.displayName : (isUz ? 'Kirish / profil' : 'Sign in / profile')}</span>{user && <i className="user-online-dot"/>}</button>
          <button className={`side-link ${route.page === 'settings' ? 'active' : ''}`} onClick={() => navigate('settings')}><Settings2 size={18}/><span>{isUz ? 'Sozlamalar' : 'Settings'}</span></button>
          <div className="sidebar-user-row"><span className="avatar-small">{user ? initials(user.displayName) : 'G'}</span><span><strong>{user?.displayName ?? 'Guest learner'}</strong><small>{user ? user.email : 'Browse in guest mode'}</small></span><span className={`api-mini-dot ${apiOnline ? 'online' : ''}`} title={apiOnline ? 'API connected' : 'API unavailable'}/></div>
        </div>
      </aside>

      {mobileMenu && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)}/>}

      <main className="platform-main">
        <header className="platform-topbar">
          <div className="topbar-left"><button className="icon-btn mobile-menu-toggle" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Menu size={20}/></button><div className="crumbs"><span>Mirae Flow</span><ChevronRight size={14}/><strong>{activePageTitle}</strong></div></div>
          <div className="topbar-tools">
            <button className="global-search" onClick={() => { navigate('problems'); window.setTimeout(() => searchRef.current?.focus(), 80); }}><Search size={16}/><span>{isUz ? 'Masalani qidirish...' : 'Search problems...'}</span><kbd>⌘ K</kbd></button>
            <div className="topbar-zoom"><button className="icon-btn" onClick={() => setZoom(zoom - 5)} disabled={zoom <= 85} aria-label="Zoom out"><ZoomOut size={15}/></button><span>{zoom}%</span><button className="icon-btn" onClick={() => setZoom(zoom + 5)} disabled={zoom >= 125} aria-label="Zoom in"><ZoomIn size={15}/></button></div>
            <button className="topbar-language" onClick={() => setLanguage(isUz ? 'en' : 'uz')} aria-label="Switch language"><Languages size={16}/>{language.toUpperCase()}</button>
            <button className="icon-btn topbar-theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</button>
            <button className="topbar-profile" onClick={() => navigate('account')} aria-label="Account">{user ? initials(user.displayName) : <UserRound size={17}/>}</button>
          </div>
        </header>

        {!apiOnline && <div className="api-banner"><CircleAlert size={15}/><span>{isUz ? 'Demo rejimi: serverga ulanish yo‘q. Masalalar ko‘rinadi, lekin akkaunt va onlayn tekshiruv ishlamaydi.' : 'Preview mode: the API is not connected. You can browse source problems, but accounts and online judging require the server.'}</span><button onClick={() => setAccountRefresh((value) => value + 1)}>{isUz ? 'Qayta ulanish' : 'Reconnect'}</button></div>}
        {apiMessage && <div className="api-message"><CircleAlert size={15}/><span>{apiMessage}</span><button onClick={() => setApiMessage('')} aria-label="Dismiss"><X size={14}/></button></div>}

        <div className="platform-content">
          <AnimatePresence mode="wait">
            {route.page === 'dashboard' && <PageTransition keyName="dashboard"><DashboardPage user={user} solved={solved} attempts={attempts} streak={streak} topics={topics} problems={problems} submissions={remoteStats?.recentSubmissions ?? []} onProblems={() => navigate('problems')} onRoadmap={() => navigate('roadmap')} onProblem={(id) => navigate('problem', id)}/></PageTransition>}
            {route.page === 'roadmap' && <PageTransition keyName="roadmap"><RoadmapPage topics={topics} solved={solved} onTopics={() => navigate('topics')} onTopic={(id) => { setTopicFilter(id); navigate('problems'); }}/></PageTransition>}
            {route.page === 'topics' && <PageTransition keyName="topics"><TopicsPage topics={topics} solved={solved} onOpen={(id) => { setTopicFilter(id); navigate('problems'); }}/></PageTransition>}
            {route.page === 'problems' && <PageTransition keyName="problems"><ProblemLibrary problems={filteredProblems} topics={topics} solved={solved} query={searchQuery} setQuery={setSearchQuery} searchRef={searchRef} topicFilter={topicFilter} setTopicFilter={setTopicFilter} setFilter={setFilter} setSetFilter={setSetFilter} levelFilter={levelFilter} setLevelFilter={setLevelFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sortOrder={sortOrder} setSortOrder={setSortOrder} onOpen={(id) => navigate('problem', id)}/></PageTransition>}
            {route.page === 'problem' && !selectedProblem && <PageTransition keyName="problem-not-found"><ProblemNotFound onBack={() => navigate('problems')}/></PageTransition>}
            {route.page === 'problem' && selectedProblem && <PageTransition keyName={`problem-${selectedProblem.id}`}><ProblemWorkspace problem={selectedProblem} user={user} apiOnline={apiOnline} onSubmit={submitFlowchart} onLogin={() => navigate('account')} onBack={() => navigate('problems')} onNext={() => { const ix = problems.findIndex((p) => p.id === selectedProblem.id); navigate('problem', problems[(ix + 1) % problems.length]?.id ?? 'BAS-001'); }}/></PageTransition>}
            {route.page === 'submissions' && <PageTransition keyName="submissions"><SubmissionsPage user={user} submissions={globalSubmissions} onLogin={() => navigate('account')} onProblem={(id) => navigate('problem', id)}/></PageTransition>}
            {route.page === 'leaderboard' && <PageTransition keyName="leaderboard"><LeaderboardPage entries={leaderboard} user={user}/></PageTransition>}
            {route.page === 'account' && <PageTransition keyName="account"><AccountPage user={user} apiOnline={apiOnline} onAuth={onAuth} onLogout={onLogout}/></PageTransition>}
            {route.page === 'settings' && <PageTransition keyName="settings"><SettingsPage theme={theme} language={language} zoom={zoom} setTheme={setTheme} setLanguage={setLanguage} setZoom={setZoom}/></PageTransition>}
          </AnimatePresence>
        </div>
        <footer className="platform-footer"><span>© {new Date().getFullYear()} Mirae Flow</span><span>Flowgorithm · Algorithmic thinking</span><a href="https://www.flowgorithm.org/documentation/" target="_blank" rel="noreferrer">Flowgorithm documentation <ExternalLink size={12}/></a></footer>
      </main>
    </div>
  );
}


function ProblemNotFound({ onBack }: { onBack: () => void }) {
  return <Panel className="empty-results"><CircleHelp size={30}/><strong>Problem not found</strong><p>This problem ID is not in the published Mirae Flow catalogue.</p><button className="button-primary" onClick={onBack}><ArrowLeft size={15}/> Back to problemset</button></Panel>;
}

function PageTransition({ keyName, children }: { keyName: string; children: ReactNode }) {
  return <motion.div key={keyName} className="page-transition" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .18 }}>{children}</motion.div>;
}

function SideLink({ active, icon, label, onClick, count }: { active: boolean; icon: ReactNode; label: string; onClick: () => void; count?: number }) {
  return <button className={`side-link ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{count !== undefined && <small>{count}</small>}</button>;
}

function SectionHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: ReactNode }) {
  return <div className="section-header"><div><div className="eyebrow-line"><i/>{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>;
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function MetricCard({ icon, label, value, foot, tone }: { icon: ReactNode; label: string; value: string; foot: string; tone: string }) {
  return <Panel className={`metric-card metric-${tone}`}><div className="metric-top"><span className="metric-icon">{icon}</span><span className="metric-caption">{label}</span></div><strong>{value}</strong><small>{foot}</small></Panel>;
}

function DashboardPage({ user, solved, attempts, streak, topics, problems, submissions, onProblems, onRoadmap, onProblem }: {
  user: ApiUser | null; solved: string[]; attempts: number; streak: number; topics: Topic[]; problems: Problem[];
  submissions: ApiSubmission[]; onProblems: () => void; onRoadmap: () => void; onProblem: (id: string) => void;
}) {
  const next = problems.find((problem) => !solved.includes(problem.id) && problem.judgeReady) ?? problems.find((problem) => !solved.includes(problem.id)) ?? problems[0];
  const readyCount = problems.filter((problem) => problem.judgeReady).length;
  const earnedXp = problems.filter((problem) => solved.includes(problem.id)).reduce((sum, problem) => sum + problem.xp, 0);
  const percent = readyCount ? Math.round(solved.length / readyCount * 100) : 0;
  return <>
    <SectionHeader eyebrow="YOUR LEARNING SPACE" title={user ? `Welcome back, ${user.displayName.split(' ')[0]}.` : 'Build your algorithmic thinking.'} subtitle="A clear path from your first Flowgorithm blocks to confident problem solving." action={<button className="button-secondary" onClick={onRoadmap}><Compass size={16}/> Explore roadmap</button>}/>
    <section className="dashboard-hero">
      <div className="hero-copy-block"><span className="hero-kicker"><Sparkles size={14}/> MIRAE FLOW · PRACTICE PLATFORM</span><h2>Think clearly.<br/><span>Build logically.</span></h2><p>Learn Flowgorithm with a structured curriculum, source-based exercises and judged .fprg submissions.</p><div className="hero-cta-row"><button className="button-primary" onClick={() => next && onProblem(next.id)}>Continue practicing <ArrowRight size={16}/></button><button className="button-quiet" onClick={onProblems}>Browse all problems</button></div><div className="hero-trust"><ShieldCheck size={14}/> 444 exercises imported from the Mirae problem collection</div></div>
      <div className="hero-flow-art" aria-hidden="true"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-block block-start"><i>▶</i> Start</div><span className="hero-connector c-one"/><div className="hero-block block-assign"><i>ƒ</i><span>Assign</span><small>a = 5</small></div><span className="hero-connector c-two"/><div className="hero-block block-output"><i>↗</i><span>Output</span><small>a</small></div><span className="hero-connector c-three"/><div className="hero-block block-end"><i/> End</div><div className="hero-code-chip"><Code2 size={14}/> .fprg</div></div>
    </section>
    <div className="metric-grid"><MetricCard icon={<CheckCircle2 size={19}/>} label="PROBLEMS SOLVED" value={String(solved.length)} foot={`${percent}% of currently judged problems`} tone="violet"/><MetricCard icon={<Zap size={19}/>} label="TOTAL XP" value={earnedXp.toLocaleString()} foot="Earn XP by accepted submissions" tone="orange"/><MetricCard icon={<Activity size={19}/>} label="SUBMISSIONS" value={String(attempts)} foot="Every attempt is part of progress" tone="blue"/><MetricCard icon={<Flame size={19}/>} label="DAILY STREAK" value={`${streak} days`} foot={streak ? 'Your learning rhythm is active' : 'Solve today to start a streak'} tone="green"/></div>
    <div className="dashboard-columns">
      <Panel className="journey-panel"><div className="panel-heading"><div><span className="eyebrow-small">YOUR CURRENT PATH</span><h3>Learning progress</h3></div><button className="text-link" onClick={onRoadmap}>Open roadmap <ArrowUpRight size={14}/></button></div><div className="journey-overview"><div className="journey-topic-icon"><Code2 size={22}/></div><div className="journey-title"><strong>01 · Basics</strong><span>Assignment & Output</span></div><strong className="journey-percent">{Math.min(100, Math.round(solved.filter((id) => id.startsWith('BAS-')).length / 65 * 100))}%</strong></div><div className="progress-track"><i style={{ width: `${Math.min(100, solved.filter((id) => id.startsWith('BAS-')).length / 65 * 100)}%` }}/></div><div className="progress-foot"><span>{solved.filter((id) => id.startsWith('BAS-')).length} / 65 completed</span><span>Topic 1</span></div><div className="next-topic-row"><span className="next-topic-node"><Check size={13}/></span><span className="next-topic-line"/><span className="next-topic-node active">02</span><span className="next-topic-line"/><span className="next-topic-node muted">03</span><span className="next-topic-node muted">04</span></div><div className="journey-topic-labels"><span>Basics</span><span>Input</span><span>Types</span><span>String</span></div><div className="source-integrity-note"><ShieldCheck size={14}/> The library preserves the original source statements. Topic grouping and levels are Mirae platform organization.</div></Panel>
      <Panel className="recommend-panel"><div className="recommend-badge"><Sparkles size={14}/> RECOMMENDED NEXT</div>{next ? <><span className="problem-code">{next.id} · {next.topicTitleEn.toUpperCase()}</span><h3>{next.titleUz}</h3><p>{next.statementUz}</p><div className="recommend-meta"><span className={`difficulty-pill ${next.difficulty}`}>{difficultyLabel(next.difficulty)}</span><span><Zap size={14}/> +{next.xp} XP</span></div><button className="button-primary button-full" onClick={() => onProblem(next.id)}>Solve this problem <ArrowRight size={15}/></button></> : <div className="empty-state"><CheckCircle2 size={24}/><strong>All imported problems completed</strong></div>}</Panel>
    </div>
    <div className="dashboard-bottom-grid">
      <Panel><div className="panel-heading"><div><span className="eyebrow-small">CURRICULUM</span><h3>Active topics</h3></div><button className="text-link" onClick={onRoadmap}>View all <ArrowRight size={14}/></button></div><div className="active-topic-list">{topics.filter((topic) => topic.problemCount > 0).slice(0, 4).map((topic) => <div className="active-topic-row" key={topic.id}><span className="topic-num">{topic.id}</span><span className="active-topic-copy"><strong>{topic.titleEn}</strong><small>{topic.subtitleEn}</small></span><span className="active-topic-count">{topic.problemCount} problems</span><ChevronRight size={15}/></div>)}</div></Panel>
      <Panel><div className="panel-heading"><div><span className="eyebrow-small">RECENT ACTIVITY</span><h3>Latest submissions</h3></div><button className="text-link" onClick={onProblems}>Practice <ArrowRight size={14}/></button></div>{submissions.length ? <div className="recent-submissions">{submissions.slice(0, 4).map((item) => <div className="recent-submission" key={item.id}><span className={`verdict-icon ${verdictTone(item.verdict)}`}>{item.verdict === 'Accepted' ? <Check size={14}/> : <X size={14}/>}</span><span><strong>{item.problemId}</strong><small>{new Date(item.createdAt).toLocaleString()}</small></span><b className={verdictTone(item.verdict)}>{item.verdict}</b></div>)}</div> : <div className="empty-inline"><Clock3 size={18}/><span>Your first online submission will appear here.</span></div>}</Panel>
    </div>
  </>;
}

function RoadmapPage({ topics, solved, onTopics, onTopic }: { topics: Topic[]; solved: string[]; onTopics: () => void; onTopic: (id: string) => void }) {
  return <>
    <SectionHeader eyebrow="SKILL TREE" title="Your Flowgorithm roadmap" subtitle="A 12-part path. Topics are marked available only where source exercises have been imported." action={<button className="button-secondary" onClick={onTopics}><Layers3 size={16}/> Topic catalogue</button>}/>
    <Panel className="roadmap-banner"><div><span className="hero-kicker"><Target size={14}/> THE LEARNING PATH</span><h2>From first output to structured algorithms.</h2><p>Follow the topic order and build confidence through increasingly complex flowcharts.</p></div><div className="roadmap-stats"><span><strong>{topics.filter((topic) => topic.problemCount > 0).length}</strong><small>active topics</small></span><span><strong>{topics.reduce((sum, topic) => sum + topic.problemCount, 0)}</strong><small>source exercises</small></span><span><strong>{solved.length}</strong><small>solved</small></span></div></Panel>
    <div className="roadmap-list">{topics.map((topic) => {
      const available = topic.problemCount > 0;
      const isCurrent = topic.id === '01';
      return <button className={`roadmap-row ${available ? 'available' : 'source-pending'}`} key={topic.id} onClick={() => onTopic(topic.id)} disabled={!available}>
        <span className={`roadmap-step ${isCurrent ? 'current' : available ? 'open' : 'locked'}`}>{available ? topic.id : <LockKeyhole size={16}/>}</span>
        <span className="roadmap-connector"/>
        <span className="roadmap-copy"><small>MODULE {topic.id}</small><strong>{topic.titleEn}</strong><span>{topic.subtitleEn}</span></span>
        <span className="roadmap-row-meta"><b>{topic.problemCount || '—'}</b><small>{topic.problemCount ? 'source problems' : 'source needed'}</small></span>
        <span className={`topic-state ${available ? 'ready' : ''}`}>{available ? 'Available' : 'Awaiting source'}</span>
        {available && <ArrowRight size={16}/>}
      </button>;
    })}</div>
  </>;
}

function TopicsPage({ topics, solved, onOpen }: { topics: Topic[]; solved: string[]; onOpen: (id: string) => void }) {
  const total = topics.reduce((sum, topic) => sum + topic.problemCount, 0);
  return <>
    <SectionHeader eyebrow="CURRICULUM CATALOGUE" title="Topics" subtitle="The 12 requested course topics, populated only with problems present in your book." action={<span className="count-chip"><BookOpen size={15}/>{total} imported exercises</span>}/>
    <div className="topic-intro"><div><strong>One curriculum. Twelve milestones.</strong><p>The currently uploaded book supplies 8 topic areas. String, Array, Mixed and Exam remain visible but contain no invented exercises.</p></div><img src="/mascot.svg" alt="Mirae Flow mascot"/></div>
    <div className="topic-grid">{topics.map((topic) => {
      const available = topic.problemCount > 0;
      const done = solved.filter((id) => id.startsWith(topicPrefix(topic.id))).length;
      return <button className={`topic-card ${available ? 'topic-card-open' : 'topic-card-pending'}`} key={topic.id} onClick={() => onOpen(topic.id)} disabled={!available}>
        <div className="topic-card-top"><span className="topic-card-num">{topic.id}</span><span className={`topic-card-status ${available ? 'ready' : ''}`}>{available ? 'Available' : 'Source needed'}</span></div>
        <span className="topic-card-symbol"><TopicSymbol topicId={topic.id}/></span><strong>{topic.titleEn}</strong><p>{topic.subtitleEn}</p>
        <div className="topic-card-foot"><span>{topic.problemCount ? `${topic.problemCount} exercises` : 'No source exercises yet'}</span>{available ? <span>{done} solved <ArrowRight size={14}/></span> : <LockKeyhole size={15}/>}</div>
      </button>;
    })}</div>
    <div className="source-note"><ShieldCheck size={15}/> Problems are from MIRAE_Flowgorithm_Tolik_Toplam.docx. Topic titles and mapping follow your requested 12-topic curriculum.</div>
  </>;
}

function topicPrefix(topicId: string) {
  return ({ '01': 'BAS-', '02': 'INP-', '03': 'TYP-', '04': 'STR-', '05': 'IF-', '06': 'NIF-', '07': 'FOR-', '08': 'WHL-', '09': 'NFR-', '10': 'ARR-', '11': 'MIX-', '12': 'EXM-' } as Record<string, string>)[topicId] ?? '';
}

function TopicSymbol({ topicId }: { topicId: string }) {
  const map: Record<string, ReactNode> = {
    '01': <Code2 size={22}/>, '02': <Download size={22}/>, '03': <BarChart3 size={22}/>, '04': <BookOpen size={22}/>,
    '05': <Compass size={22}/>, '06': <Layers3 size={22}/>, '07': <Activity size={22}/>, '08': <Workflow size={22}/>,
    '09': <Target size={22}/>, '10': <Layers3 size={22}/>, '11': <Sparkles size={22}/>, '12': <Award size={22}/>,
  };
  return <>{map[topicId]}</>;
}

function ProblemLibrary({ problems, topics, solved, query, setQuery, searchRef, topicFilter, setTopicFilter, setFilter, setSetFilter, levelFilter, setLevelFilter, statusFilter, setStatusFilter, sortOrder, setSortOrder, onOpen }: {
  problems: Problem[]; topics: Topic[]; solved: string[]; query: string; setQuery: (value: string) => void;
  searchRef: RefObject<HTMLInputElement | null>; topicFilter: string; setTopicFilter: (value: string) => void;
  setFilter: FilterSet; setSetFilter: (value: FilterSet) => void; levelFilter: FilterLevel; setLevelFilter: (value: FilterLevel) => void;
  statusFilter: FilterStatus; setStatusFilter: (value: FilterStatus) => void; sortOrder: 'sequence' | 'difficulty'; setSortOrder: (value: 'sequence' | 'difficulty') => void;
  onOpen: (id: string) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const clear = () => { setTopicFilter('all'); setSetFilter('all'); setLevelFilter('all'); setStatusFilter('all'); setQuery(''); };
  return <>
    <SectionHeader eyebrow="PRACTICE ARENA · SOURCE LIBRARY" title="Problemset" subtitle="Browse, filter and open each exercise in its own submission workspace." action={<div className="library-total"><strong>444</strong><span>book exercises</span></div>}/>
    <div className="problemset-toolbar"><label className="problem-searchbox"><Search size={18}/><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, ID or statement…"/><kbd>⌘ K</kbd></label><div className="problemset-toolbar-actions"><button className="button-secondary filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}><ListFilter size={16}/> Filters <ChevronDown size={14}/></button><label className="sort-select"><span>Sort</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as 'sequence' | 'difficulty')}><option value="sequence">Course order</option><option value="difficulty">Difficulty</option></select></label></div></div>
    <div className={`problemset-layout ${filtersOpen ? '' : 'filters-collapsed'}`}>
      {filtersOpen && <aside className="filters-panel">
        <div className="filters-heading"><strong>Filters</strong><button onClick={clear}>Reset</button></div>
        <FilterGroup label="TOPIC"><select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)}><option value="all">All topics</option>{topics.map((topic) => <option value={topic.id} key={topic.id}>{topic.id} · {topic.titleEn} ({topic.problemCount})</option>)}</select></FilterGroup>
        <FilterGroup label="DIFFICULTY"><div className="filter-button-stack">{([['all','All levels'],['beginner','Easy'],['middle','Medium'],['finish','Hard']] as [FilterLevel,string][]).map(([value,label]) => <button key={value} className={levelFilter === value ? 'selected' : ''} onClick={() => setLevelFilter(value)}>{label}</button>)}</div></FilterGroup>
        <FilterGroup label="STATUS"><div className="filter-button-stack">{([['all','All problems'],['solved','Solved'],['unsolved','Unsolved'],['judge-ready','Judge ready']] as [FilterStatus,string][]).map(([value,label]) => <button key={value} className={statusFilter === value ? 'selected' : ''} onClick={() => setStatusFilter(value)}>{label}</button>)}</div></FilterGroup>
        <FilterGroup label="ASSIGNMENT"><div className="filter-button-stack">{([['all','All sets'],['classwork','Classwork'],['homework','Homework'],['mastery','Mastery']] as [FilterSet,string][]).map(([value,label]) => <button key={value} className={setFilter === value ? 'selected' : ''} onClick={() => setSetFilter(value)}>{label}</button>)}</div></FilterGroup>
        <div className="filter-source-note"><ShieldCheck size={14}/><span>Assignment sets and difficulty are Mirae's learning progression. Exercise wording comes from the book.</span></div>
      </aside>}
      <section className="problemset-results panel">
        <div className="problemset-results-head"><div><span className="eyebrow-small">MIRAE PROBLEM COLLECTION</span><h2>{problems.length} <span>results</span></h2></div><span className="results-progress"><CheckCircle2 size={14}/>{solved.length} solved</span></div>
        <div className="problem-table-head"><span>STATUS</span><span>TITLE</span><span>TOPIC</span><span>DIFFICULTY</span><span>XP</span><span/></div>
        <div className="problem-table-body">{problems.map((problem) => <button className="problem-table-row" key={problem.id} onClick={() => onOpen(problem.id)}>
          <span className={`problem-status ${solved.includes(problem.id) ? 'done' : ''}`}>{solved.includes(problem.id) ? <Check size={14}/> : <CircleDot size={14}/>}</span>
          <span className="problem-title-cell"><strong>{problem.titleUz}</strong><small>{problem.id} · Book #{problem.sourceProblemNo}</small></span>
          <span className="problem-topic-cell">{problem.topicId} · {problem.topicTitleEn}</span>
          <span><i className={`difficulty-dot ${problem.difficulty}`}/><em className={`difficulty-text ${problem.difficulty}`}>{difficultyLabel(problem.difficulty)}</em></span>
          <span className="xp-cell">+{problem.xp}</span><ArrowRight size={15} className="problem-row-arrow"/>
        </button>)}{problems.length === 0 && <div className="empty-results"><Search size={28}/><strong>No problems match those filters</strong><p>Try clearing one or more filters.</p><button className="button-secondary" onClick={clear}>Clear filters</button></div>}</div>
        <div className="problemset-results-foot"><span>Showing {problems.length} matching source problems</span><span>Only problems with a published checker can be submitted online.</span></div>
      </section>
    </div>
  </>;
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return <div className="filter-group"><span>{label}</span>{children}</div>;
}

function ProblemWorkspace({ problem, user, apiOnline, onSubmit, onLogin, onBack, onNext }: {
  problem: Problem; user: ApiUser | null; apiOnline: boolean;
  onSubmit: (problem: Problem, source: string) => Promise<ApiSubmission | null>;
  onLogin: () => void; onBack: () => void; onNext: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'submissions'>('description');
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [source, setSource] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading'>('idle');
  const [result, setResult] = useState<ApiSubmission | null>(null);
  const [pastSubmissions, setPastSubmissions] = useState<ApiSubmission[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveTab('description'); setFileName(''); setSource(''); setFileError(''); setDragActive(false); setResult(null); setSubmitError(''); setSubmitState('idle');
  }, [problem.id]);

  useEffect(() => {
    let active = true;
    setPastSubmissions([]); setHistoryError('');
    if (!user) { setHistoryLoading(false); return () => { active = false; }; }
    setHistoryLoading(true);
    api.problemSubmissions(problem.id, 1, 20)
      .then((response) => { if (active) setPastSubmissions(response.items); })
      .catch((error) => { if (active) setHistoryError(error instanceof Error ? error.message : 'Could not load submission history.'); })
      .finally(() => { if (active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [problem.id, user?.id]);

  const loadFile = async (file: File) => {
    setFileError(''); setSubmitError(''); setResult(null);
    if (!file.name.toLowerCase().endsWith('.fprg')) { setFileError('Only Flowgorithm .fprg files are accepted.'); return; }
    if (file.size > 750_000) { setFileError('File must be 750 KB or smaller.'); return; }
    try {
      const text = await file.text();
      if (!text.toLowerCase().includes('<flowgorithm')) throw new Error('This file does not look like a Flowgorithm project.');
      setFileName(file.name); setSource(text);
    } catch (error) { setFileError(error instanceof Error ? error.message : 'Could not read the file.'); }
  };

  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) await loadFile(file);
    event.target.value = '';
  };

  const submit = async () => {
    if (!source || !problem.judgeReady || submitState === 'loading') return;
    setSubmitState('loading'); setSubmitError(''); setResult(null);
    try {
      const submission = await onSubmit(problem, source);
      if (submission) {
        setResult(submission); setPastSubmissions((items) => [submission, ...items.filter((item) => item.id !== submission.id)].slice(0, 20));
        setActiveTab('submissions');
      }
    } catch (error) { setSubmitError(error instanceof Error ? error.message : 'Submission failed.'); }
    finally { setSubmitState('idle'); }
  };

  const sourceLines = source.split('\n').slice(0, 12).join('\n');
  return <>
    <div className="workspace-breadcrumb"><button onClick={onBack}><ArrowLeft size={15}/> Problemset</button><ChevronRight size={13}/><span>{problem.topicTitleEn}</span><ChevronRight size={13}/><strong>{problem.id}</strong><button className="next-problem" onClick={onNext}>Next problem <ArrowRight size={14}/></button></div>
    <div className="workspace-heading"><div><div className="problem-number-line"><span>{problem.id}</span><span>·</span><span>{problem.topicTitleEn}</span><span>·</span><span>Problem {problem.topicSequenceNo}</span></div><h1>{problem.titleUz}</h1><div className="workspace-badges"><span className={`difficulty-pill ${problem.difficulty}`}>{difficultyLabel(problem.difficulty)}</span><span className="tag-pill">{problem.set}</span><span className="tag-pill"><Zap size={12}/>{problem.xp} XP</span><span className="tag-pill source-tag"><BookOpen size={12}/> Book source #{problem.sourceProblemNo}</span></div></div><div className="workspace-judge-state">{problem.judgeReady ? <span className="judge-live"><i/> Online judge enabled</span> : <span className="judge-pending"><Clock3 size={13}/> Checker in preparation</span>}</div></div>
    <div className="workspace-grid">
      <section className="statement-column panel">
        <div className="workspace-tabs"><button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>Description</button><button className={activeTab === 'hints' ? 'active' : ''} onClick={() => setActiveTab('hints')}>Guidance</button><button className={activeTab === 'submissions' ? 'active' : ''} onClick={() => setActiveTab('submissions')}>Result</button></div>
        {activeTab === 'description' && <div className="statement-content"><div className="source-attribution"><ShieldCheck size={14}/><span>{problem.sourceBook} · {problem.sourceSection} · #{problem.sourceProblemNo}</span></div><h2>Problem statement</h2><p className="original-statement">{problem.statementUz}</p>{problem.examples && problem.examples.length > 0 && <div className="examples-block"><strong>Namuna / Examples</strong>{problem.examples.map((ex, i) => <div className="example-pair" key={i}><div><span>INPUT</span><pre>{ex.input || '—'}</pre></div><div><span>OUTPUT</span><pre>{ex.output || '—'}</pre></div></div>)}</div>}<div className="statement-rules"><strong>Flowgorithm requirements</strong><ul>{problem.topicId === '01' ? <><li>Use the Start and End shapes.</li><li>Use Assign and Output shapes only.</li><li>Do not use Input in this topic.</li></> : <><li>Create the algorithm using Flowgorithm flowchart shapes.</li><li>Follow the input and output requirements in the original statement.</li><li>Submit a native .fprg file exported from Flowgorithm.</li></>}</ul></div><div className="statement-info-grid"><div><span>INPUT</span><strong>{problem.topicId === '01' ? 'No input' : 'As stated in the exercise'}</strong></div><div><span>OUTPUT</span><strong>Match the requested result</strong></div><div><span>TIME LIMIT</span><strong>1 second</strong></div><div><span>SOURCE</span><strong>Original book</strong></div></div><div className="source-citation"><BookMarked size={15}/><span>Original exercise wording is preserved from the uploaded MIRAE Flowgorithm problem collection.</span></div></div>}
        {activeTab === 'hints' && <div className="statement-content"><h2>How to approach this problem</h2><p>This section gives structural guidance without creating a replacement problem or revealing the completed flowchart.</p><div className="hint-step"><span>01</span><div><strong>Read the requirements</strong><p>Identify the values already given and the exact output the exercise asks for.</p></div></div><div className="hint-step"><span>02</span><div><strong>Build the flowchart</strong><p>Use the Flowgorithm shape types covered by this topic. Keep the sequence easy to follow.</p></div></div><div className="hint-step"><span>03</span><div><strong>Run and inspect</strong><p>Run your flowchart in Flowgorithm before uploading the saved .fprg file.</p></div></div></div>}
        {activeTab === 'submissions' && <div className="statement-content">{historyLoading && <div className="empty-inline"><span className="spinner-small"/> Loading your submissions…</div>}{historyError && <p className="field-error">{historyError}</p>}{pastSubmissions.length ? <div className="problem-history-list">{pastSubmissions.map((item) => <details className="problem-history-item" key={item.id}><summary><span className={`verdict-label ${verdictTone(item.verdict)}`}>{item.verdict === 'Accepted' ? <CheckCircle2 size={14}/> : <CircleX size={14}/>} {item.verdict}</span><span>{new Date(item.createdAt).toLocaleString()}</span><small>{item.runtimeMs} ms</small></summary><SubmissionResult submission={item}/></details>)}</div> : !historyLoading && <div className="empty-results"><FileCode2 size={28}/><strong>No submissions yet</strong><p>Your submissions for this problem will appear here.</p></div>}</div>}
      </section>
      <aside className="submit-column">
        <section className="panel submit-panel"><div className="submit-panel-head"><div><span className="eyebrow-small">SOLUTION WORKSPACE</span><h2>Submit your flowchart</h2></div><span className="fprg-badge">.FPRG</span></div>
          <p className="submit-intro">Create the flowchart in Flowgorithm, save it as a native .fprg file, then upload it here for judging.</p>
          <input ref={inputRef} type="file" accept=".fprg,application/xml,text/xml" hidden onChange={chooseFile}/>
          <button className={`upload-dropzone ${fileName ? 'has-file' : ''} ${dragActive ? 'drag-active' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(event) => { event.preventDefault(); setDragActive(false); const file = event.dataTransfer.files[0]; if (file) void loadFile(file); }}><span className="upload-symbol">{fileName ? <FileCode2 size={22}/> : <UploadCloud size={23}/>}</span><strong>{fileName || 'Choose a .fprg file'}</strong><small>{fileName ? 'File loaded and ready to submit' : 'Drop your file here or browse · Max 750 KB'}</small><span className="browse-file">Browse files</span></button>
          {fileError && <p className="field-error"><CircleAlert size={14}/>{fileError}</p>}
          {source && <div className="file-preview"><div><FileCode2 size={14}/><span>FPRG preview</span><small>{source.length.toLocaleString()} chars</small></div><pre>{sourceLines}</pre></div>}
          {!problem.judgeReady && <div className="judge-disabled-note"><LockKeyhole size={15}/><span><strong>Online checker not published yet</strong>The statement is available, but this problem's test contract has not been prepared. No fake verdict will be returned.</span></div>}
          {!user && <div className="sign-in-note"><UserRound size={15}/><span>Sign in to submit and save results to your account.</span><button onClick={onLogin}>Sign in</button></div>}
          {submitError && <p className="field-error"><CircleX size={14}/>{submitError}</p>}
          <button className="button-primary submit-button" onClick={() => void submit()} disabled={!fileName || !problem.judgeReady || submitState === 'loading' || !apiOnline || !user}>{submitState === 'loading' ? <><span className="spinner-small"/> Judging…</> : <><UploadCloud size={16}/> Submit solution</>}</button>
          <div className="submit-meta-row"><span><ShieldCheck size={13}/> Server-side evaluation</span><span><Clock3 size={13}/> bounded execution</span></div>
          {result && <SubmissionResult submission={result}/>}
        </section>
        <section className="panel submit-help"><span className="help-icon"><CircleHelp size={16}/></span><div><strong>Need help with Flowgorithm?</strong><p>Read the official shape documentation and make sure your file is saved in .fprg format.</p><a href="https://www.flowgorithm.org/documentation/" target="_blank" rel="noreferrer">Open documentation <ExternalLink size={12}/></a></div></section>
      </aside>
    </div>
  </>;
}

function SubmissionResult({ submission }: { submission: ApiSubmission }) {
  const accepted = submission.verdict === 'Accepted';
  return <div className={`submission-result ${accepted ? 'success' : 'failure'}`}><div className="submission-result-heading">{accepted ? <CheckCircle2 size={20}/> : <CircleX size={20}/>}<div><strong>{submission.verdict}</strong><small>{submission.message}</small></div></div><div className="submission-result-stats"><span><small>Runtime</small><b>{submission.runtimeMs} ms</b></span><span><small>Language</small><b>Flowgorithm</b></span><span><small>Submission</small><b>{submission.id.slice(0, 8)}</b></span></div><div className="result-output-grid"><div><span>YOUR OUTPUT</span><pre>{submission.output || '(empty)'}</pre></div><div><span>JUDGE FEEDBACK</span><pre>{accepted ? 'The published checker accepted your output.' : 'The output did not match the published reference.'}</pre></div></div></div>;
}

function SubmissionsPage({ user, submissions, onLogin, onProblem }: { user: ApiUser | null; submissions: ApiSubmission[]; onLogin: () => void; onProblem: (id: string) => void }) {
  return <>
    <SectionHeader eyebrow="YOUR CODE HISTORY" title="Submissions" subtitle="Every online attempt, verdict and runtime in one place." action={user ? <span className="count-chip"><Activity size={15}/>{submissions.length} recent submissions</span> : undefined}/>
    {!user ? <Panel className="auth-required"><LockKeyhole size={26}/><h3>Sign in to view submissions</h3><p>Your account keeps submission history across devices.</p><button className="button-primary" onClick={onLogin}><LogIn size={15}/> Sign in</button></Panel> : submissions.length === 0 ? <Panel className="empty-results"><FileCode2 size={28}/><strong>No submissions yet</strong><p>Open a judge-enabled problem and submit your first .fprg solution.</p></Panel> : <Panel className="table-panel"><div className="submission-table-head"><span>VERDICT</span><span>PROBLEM</span><span>TIME</span><span>RUNTIME</span><span>SUBMISSION ID</span></div>{submissions.map((item) => <button className="submission-table-row" key={item.id} onClick={() => onProblem(item.problemId)}><span className={`verdict-label ${verdictTone(item.verdict)}`}>{item.verdict === 'Accepted' ? <CheckCircle2 size={14}/> : <CircleX size={14}/>} {item.verdict}</span><strong>{item.problemId}</strong><span>{new Date(item.createdAt).toLocaleString()}</span><span>{item.runtimeMs} ms</span><code>{item.id.slice(0, 10)}</code></button>)}</Panel>}
  </>;
}

function LeaderboardPage({ entries, user }: { entries: ApiLeaderboardEntry[]; user: ApiUser | null }) {
  return <>
    <SectionHeader eyebrow="MIRAE COMMUNITY" title="Leaderboard" subtitle="Students ranked by unique accepted problems." action={<span className="count-chip"><Trophy size={15}/> All-time ranking</span>}/>
    <Panel className="leaderboard-hero"><div className="leaderboard-cup"><Trophy size={34}/></div><div><span className="eyebrow-small">THE MOST IMPORTANT SCORE</span><h2>Consistency beats speed.</h2><p>Earn your place by solving problems and improving your algorithms.</p></div></Panel>
    {entries.length ? <Panel className="table-panel"><div className="leaderboard-table-head"><span>RANK</span><span>STUDENT</span><span>SOLVED</span><span>STATUS</span></div>{entries.map((entry) => <div className={`leaderboard-row ${entry.userId === user?.id ? 'is-you' : ''}`} key={entry.userId}><strong className={`rank-number rank-${entry.rank}`}>{entry.rank <= 3 ? <Trophy size={15}/> : `#${entry.rank}`}</strong><span className="leaderboard-user"><i>{initials(entry.displayName)}</i><b>{entry.displayName}{entry.userId === user?.id && <small>YOU</small>}</b></span><strong className="solved-count">{entry.solved}</strong><span className="leader-status">Active</span></div>)}</Panel> : <Panel className="empty-results"><Users size={28}/><strong>No ranked students yet</strong><p>The leaderboard will fill as students submit accepted solutions.</p></Panel>}
  </>;
}

function AccountPage({ user, onAuth }: { user: ApiUser | null; apiOnline: boolean; onAuth: (user: ApiUser) => void; onLogout: () => void }) {
  const [name, setName] = useState(user?.displayName ?? '');
  const [note, setNote] = useState('');
  const save = async () => { try { const r = await api.register(name, user?.email ?? '', ''); onAuth(r.user); setNote('Saqlandi ✓'); } catch (err) { setNote(err instanceof Error ? err.message : 'Xato'); } };
  const download = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([api.exportProgress()], { type: 'application/json' })); a.download = 'mirae-flow-progress.json'; a.click(); URL.revokeObjectURL(a.href); };
  const upload = async (file?: File) => { if (!file) return; try { api.importProgress(await file.text()); setNote('Import qilindi ✓ — sahifani yangilang (F5)'); } catch { setNote('Fayl noto‘g‘ri'); } };
  const reset = () => { if (window.confirm('Barcha natijalar o‘chiriladi. Davom etasizmi?')) { api.resetProgress(); setNote('Tozalandi — sahifani yangilang (F5)'); } };
  return <>
    <SectionHeader eyebrow="MIRAE PROFIL" title="Profil" subtitle="Ma’lumotlar faqat shu qurilmada saqlanadi — internet shart emas."/>
    <Panel className="profile-panel"><div className="profile-avatar-large">{initials(user?.displayName ?? 'T')}</div><div className="profile-main"><span className="eyebrow-small">LOCAL PROFILE</span><h2>{user?.displayName ?? 'Talaba'}</h2>
      <label className="profile-field"><span>Ism / Name</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={40}/></label>
      <div className="profile-actions"><button className="button-primary" onClick={() => void save()}>Saqlash</button><button className="button-secondary" onClick={download}>Natijalarni yuklab olish</button><label className="button-secondary file-pick">Import<input type="file" accept="application/json" hidden onChange={(event) => void upload(event.target.files?.[0])}/></label><button className="button-secondary" onClick={reset}>Tozalash</button></div>
      {note && <p className="profile-note" role="status">{note}</p>}</div></Panel>
  </>;
}

function SettingsPage({ theme, language, zoom, setTheme, setLanguage, setZoom }: {
  theme: ThemeMode; language: 'uz' | 'en'; zoom: number; setTheme: (value: ThemeMode) => void;
  setLanguage: (value: 'uz' | 'en') => void; setZoom: (value: number) => void;
}) {
  return <>
    <SectionHeader eyebrow="PREFERENCES" title="Settings" subtitle="Tune the learning environment to your needs."/>
    <div className="settings-layout"><Panel><div className="setting-heading"><span className="setting-icon violet"><Sun size={18}/></span><div><h3>Appearance</h3><p>Use light, dark or follow your operating system.</p></div></div><div className="settings-options">{(['light','dark','system'] as ThemeMode[]).map((value) => <button key={value} className={theme === value ? 'selected' : ''} onClick={() => setTheme(value)}><span className={`theme-swatch ${value}`}>{value === 'light' ? <Sun size={16}/> : value === 'dark' ? <Moon size={16}/> : <><Sun size={13}/><Moon size={13}/></>}</span><b>{value[0].toUpperCase() + value.slice(1)}</b>{theme === value && <CheckCircle2 size={15}/>}</button>)}</div></Panel>
      <Panel><div className="setting-heading"><span className="setting-icon orange"><Languages size={18}/></span><div><h3>Language</h3><p>Choose interface language. Original exercises remain in Uzbek.</p></div></div><div className="settings-options">{(['uz','en'] as const).map((value) => <button key={value} className={language === value ? 'selected' : ''} onClick={() => setLanguage(value)}><span className="theme-swatch language-swatch">{value.toUpperCase()}</span><b>{value === 'uz' ? 'O‘zbekcha' : 'English'}</b>{language === value && <CheckCircle2 size={15}/>}</button>)}</div></Panel>
      <Panel className="settings-wide"><div className="setting-heading"><span className="setting-icon blue"><ZoomIn size={18}/></span><div><h3>Interface zoom</h3><p>Scale the interface from 85% to 125%.</p></div><strong className="setting-value">{zoom}%</strong></div><div className="zoom-range-row"><button className="icon-btn" onClick={() => setZoom(zoom - 5)}><ZoomOut size={16}/></button><input type="range" min="85" max="125" step="5" value={zoom} onChange={(event) => setZoom(Number(event.target.value))}/><button className="icon-btn" onClick={() => setZoom(zoom + 5)}><ZoomIn size={16}/></button></div></Panel>
      <Panel className="settings-wide"><div className="setting-heading"><span className="setting-icon green"><ShieldCheck size={18}/></span><div><h3>Web platform & judging</h3><p>Mirae Flow uses a server-side judge for online submissions. Browser-side checks are not treated as official verdicts.</p></div></div><div className="platform-info-grid"><div><strong>444</strong><span>book exercises imported</span></div><div><strong>65</strong><span>Topic 1 judge-enabled</span></div><div><strong>8 / 12</strong><span>topics have source questions</span></div></div></Panel>
    </div>
  </>;
}

export default App;
