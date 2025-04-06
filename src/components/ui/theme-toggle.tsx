'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center px-1 py-2 w-full animate-pulse gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-muted rounded-full" /> {/* Icon placeholder */}
        </div>
        <div className="w-9 h-5 bg-muted rounded-full" /> {/* Switch placeholder */}
      </div>
    );
  }

  const isDarkMode = theme === 'dark';

  return (
    <div className="flex items-center px-1 py-2 w-full gap-4">
      <div className="flex items-center gap-2">
        <div className="relative w-5 h-5 flex items-center justify-center text-muted-foreground">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </div>
      </div>
      <Switch
        checked={isDarkMode}
        onCheckedChange={() => setTheme(isDarkMode ? 'light' : 'dark')}
        aria-label="Toggle theme"
      />
    </div>
  );
} 