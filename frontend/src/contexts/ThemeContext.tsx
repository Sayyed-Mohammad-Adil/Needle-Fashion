'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDefaultTheme, getThemes, Theme } from '@/lib/api/theme.service';

interface ThemeContextType {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  loadDefaultTheme: () => Promise<void>;
  toggleTheme: () => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | null>(null);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('customTheme', JSON.stringify(newTheme));
  };

  const applyTheme = (themeData: Theme) => {
    // Apply CSS variables to document
    const root = document.documentElement;

    // Set data-theme attribute for CSS selectors
    const isDark = themeData.name === 'Dark';
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    // Toggle 'dark' class for Tailwind dark mode
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (themeData.colors) {
      // Set Tailwind variables
      root.style.setProperty('--color-primary', themeData.colors.primary);
      root.style.setProperty('--color-secondary', themeData.colors.secondary);
      root.style.setProperty('--color-accent', themeData.colors.accent);
      root.style.setProperty('--color-background', themeData.colors.background);
      root.style.setProperty('--color-text', themeData.colors.text);
      root.style.setProperty('--color-border', themeData.colors.border);

      // Set Base variables (used in globals.css)
      root.style.setProperty('--primary', themeData.colors.primary);
      root.style.setProperty('--secondary', themeData.colors.secondary);
      root.style.setProperty('--accent', themeData.colors.accent);
      root.style.setProperty('--background', themeData.colors.background);
      root.style.setProperty('--foreground', themeData.colors.text); // Map text to foreground
      root.style.setProperty('--border', themeData.colors.border);
      root.style.setProperty('--card', isDark ? '#191B22' : '#FFFFFF');
      root.style.setProperty('--card-foreground', themeData.colors.text);
    }

    if (themeData.fonts) {
      root.style.setProperty('--font-heading', themeData.fonts.heading);
      root.style.setProperty('--font-body', themeData.fonts.body);
    }

    if (themeData.layout) {
      root.style.setProperty('--border-radius', themeData.layout.borderRadius);
      root.style.setProperty('--spacing', themeData.layout.spacing);
    }
  };

  const [themes, setThemes] = useState<Theme[]>([]);

  const loadDefaultTheme = async () => {
    try {
      // Load all available themes first
      const allThemes = await getThemes();
      setThemes(allThemes);

      // Check for saved custom theme
      const savedTheme = localStorage.getItem('customTheme');
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme);
          // If the cached theme has the old yellow #FFD700 or generic blue #3b82f6, refresh it to luxury gold
          if (parsedTheme?.colors?.primary === '#FFD700' || parsedTheme?.colors?.primary === '#3b82f6') {
            localStorage.removeItem('customTheme');
          } else {
            setThemeState(parsedTheme);
            applyTheme(parsedTheme);
            return;
          }
        } catch {
          localStorage.removeItem('customTheme');
        }
      }

      // Load default theme from backend or use luxury fallback
      try {
        const defaultTheme = await getDefaultTheme();
        if (defaultTheme && defaultTheme.colors?.primary !== '#3b82f6') {
          setThemeState(defaultTheme);
          applyTheme(defaultTheme);
          return;
        }
      } catch {
        // Fallback to luxury default theme
      }

      const fallbackTheme: Theme = {
        name: 'Default',
        isDefault: true,
        isActive: true,
        colors: {
          primary: '#C5A059',
          secondary: '#F2EDE4',
          accent: '#C5A059',
          background: '#FAF8F5',
          text: '#18191C',
          border: '#E6DFD3',
        },
        fonts: {
          heading: 'var(--font-serif), Georgia, serif',
          body: 'var(--font-sans), Inter, sans-serif',
        },
        layout: {
          borderRadius: '0.5rem',
          spacing: '4px',
        },
      };
      setThemeState(fallbackTheme);
      applyTheme(fallbackTheme);
    } catch (error) {
      console.error('Failed to load theme:', error);
      const fallbackTheme: Theme = {
        name: 'Default',
        isDefault: true,
        isActive: true,
        colors: {
          primary: '#C5A059',
          secondary: '#F2EDE4',
          accent: '#C5A059',
          background: '#FAF8F5',
          text: '#18191C',
          border: '#E6DFD3',
        },
        fonts: {
          heading: 'var(--font-serif), Georgia, serif',
          body: 'var(--font-sans), Inter, sans-serif',
        },
        layout: {
          borderRadius: '0.5rem',
          spacing: '4px',
        },
      };
      setThemeState(fallbackTheme);
      applyTheme(fallbackTheme);
    }
  };

  const toggleTheme = () => {
    if (!theme) return;

    const isDark = theme.name === 'Dark';
    const targetThemeName = isDark ? 'Default' : 'Dark';

    const targetTheme = themes.find(t => t.name === targetThemeName);

    if (targetTheme) {
      setTheme(targetTheme);
    } else {
      console.warn(`Theme ${targetThemeName} not found`);
      // Fallback: reload default if target not found
      if (isDark) loadDefaultTheme();
    }
  };

  useEffect(() => {
    loadDefaultTheme();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        loadDefaultTheme,
        toggleTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};