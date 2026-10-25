'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  // Switch between themes
  const switchTheme = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={switchTheme}
      className="relative inline-flex h-5 w-9 lg:h-6 lg:w-11 items-center rounded-full bg-muted transition-colors duration-300 hover:bg-muted/80"
      aria-label="Switch theme"
    >
      <span
        className={`
          inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-primary-foreground transition-transform duration-300
          ${theme?.name === 'dark' ? 'translate-x-5 lg:translate-x-6' : 'translate-x-1'}
        `}
      />
      <span className="sr-only">
        Switch theme
      </span>

      {/* Sun and Moon Icons */}
      <SunIcon
        className="absolute left-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 lg:h-3 lg:w-3 text-primary"
        aria-hidden="true"
      />
      <MoonIcon
        className="absolute right-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 lg:h-3 lg:w-3 text-muted-foreground"
        aria-hidden="true"
      />
    </button>
  );
};

export default ThemeToggle;