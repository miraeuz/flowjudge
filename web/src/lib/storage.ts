import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'uz' | 'en';
export type NavigationPage = 'dashboard' | 'roadmap' | 'topics' | 'problems' | 'problem' | 'submissions' | 'leaderboard' | 'account' | 'settings';

interface MiraeState {
  theme: ThemeMode;
  language: Language;
  zoom: number;
  telegramNotifications: boolean;
  activePage: NavigationPage;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setZoom: (zoom: number) => void;
  setTelegramNotifications: (enabled: boolean) => void;
  setActivePage: (page: NavigationPage) => void;
}

export const useMiraeStore = create<MiraeState>()(persist((set) => ({
  theme: 'system',
  language: 'uz',
  zoom: 100,
  telegramNotifications: true,
  activePage: 'dashboard',
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setZoom: (zoom) => set({ zoom: Math.min(125, Math.max(85, zoom)) }),
  setTelegramNotifications: (telegramNotifications) => set({ telegramNotifications }),
  setActivePage: (activePage) => set({ activePage }),
}), { name: 'mirae-flow-web-preferences-v1' }));
