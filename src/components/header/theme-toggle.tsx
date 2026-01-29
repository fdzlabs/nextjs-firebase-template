'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (resolvedTheme ?? theme) === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      aria-label={
        mounted
          ? isDark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
          : 'Toggle theme'
      }
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative"
      suppressHydrationWarning
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}
