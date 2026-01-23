'use client';

import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'system') {
      return '💻';
    }
    return resolvedTheme === 'dark' ? '🌙' : '☀️';
  };

  const getLabel = () => {
    if (theme === 'light') return 'สว่าง';
    if (theme === 'dark') return 'มืด';
    return 'ระบบ';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className="gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
      title={`Theme: ${getLabel()}`}
    >
      <span className="text-base transition-transform hover:scale-110">
        {getIcon()}
      </span>
      <span className="hidden sm:inline text-xs">{getLabel()}</span>
    </Button>
  );
}
