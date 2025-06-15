
import { useState, useEffect } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    emergency: boolean;
    updates: boolean;
    reminders: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    quickActions: string[];
    widgets: string[];
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    emergency: true,
    updates: true,
    reminders: true,
  },
  dashboard: {
    layout: 'grid',
    quickActions: ['emergency', 'safety-timer', 'reports'],
    widgets: ['weather', 'alerts', 'recent-activity'],
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
  },
};

export const usePersonalization = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences from localStorage
    const loadPreferences = () => {
      try {
        const saved = localStorage.getItem('user-preferences');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPreferences({ ...defaultPreferences, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    
    try {
      localStorage.setItem('user-preferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  };

  const updateNestedPreference = <T extends keyof UserPreferences>(
    category: T,
    updates: Partial<UserPreferences[T]>
  ) => {
    updatePreferences({
      [category]: { ...preferences[category], ...updates }
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('user-preferences');
  };

  // Helper functions for common preference checks
  const isDarkMode = () => {
    if (preferences.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return preferences.theme === 'dark';
  };

  const shouldReduceMotion = () => {
    return preferences.accessibility.reducedMotion || 
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  const getFontSizeClass = () => {
    const sizeMap = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };
    return sizeMap[preferences.accessibility.fontSize];
  };

  return {
    preferences,
    updatePreferences,
    updateNestedPreference,
    resetPreferences,
    isLoading,
    isDarkMode,
    shouldReduceMotion,
    getFontSizeClass,
  };
};
