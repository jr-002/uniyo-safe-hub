
import React, { createContext, useContext, useEffect } from 'react';
import { usePersonalization } from '@/hooks/usePersonalization';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  isDarkMode: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'uniuyo-ui-theme',
  ...props
}: ThemeProviderProps) {
  const { preferences, updateNestedPreference, isDarkMode } = usePersonalization();

  const setTheme = (theme: Theme) => {
    updateNestedPreference('theme', theme as any);
  };

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (preferences.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(preferences.theme);
  }, [preferences.theme]);

  const value = {
    theme: preferences.theme as Theme,
    setTheme,
    isDarkMode: isDarkMode(),
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode() ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
