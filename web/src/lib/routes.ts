import type { NavigationPage } from './storage';

export interface AppRoute {
  page: NavigationPage;
  problemId?: string;
}

export function resolveRoute(pathname: string): AppRoute {
  const path = pathname.replace(/\/+$/, '') || '/';
  const problem = path.match(/^\/problems\/([a-z0-9-]+)$/i);
  if (problem) return { page: 'problem', problemId: problem[1].toUpperCase() };
  if (path === '/roadmap') return { page: 'roadmap' };
  if (path === '/topics') return { page: 'topics' };
  if (path === '/problems') return { page: 'problems' };
  if (path === '/submissions') return { page: 'submissions' };
  if (path === '/leaderboard') return { page: 'leaderboard' };
  if (path === '/account') return { page: 'account' };
  if (path === '/settings') return { page: 'settings' };
  return { page: 'dashboard' };
}

export function routePath(page: NavigationPage, problemId?: string): string {
  if (page === 'problem' && problemId) return `/problems/${encodeURIComponent(problemId)}`;
  const paths: Record<NavigationPage, string> = {
    dashboard: '/', roadmap: '/roadmap', topics: '/topics', problems: '/problems',
    problem: '/problems', submissions: '/submissions', leaderboard: '/leaderboard',
    account: '/account', settings: '/settings',
  };
  return paths[page];
}

/** Hash routing keeps the site working offline, from file:// and under any sub-path. */
export const currentPath = (): string => window.location.hash.replace(/^#/, '') || '/';
