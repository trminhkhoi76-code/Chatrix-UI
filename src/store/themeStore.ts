import { create } from 'zustand';

export type Theme = 'midnight' | 'daylight' | 'candy';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'midnight',
  setTheme: (theme) => {
    document.documentElement.dataset.theme = theme;
    set({ theme });
  },
}));
