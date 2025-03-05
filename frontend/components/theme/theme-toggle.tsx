// components/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useThemeStore } from '@/lib/stores/theme-store';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme: setNextTheme, theme: nextTheme, resolvedTheme } = useTheme();
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  
  // Only render the toggle client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Sync next-themes with our store when the component mounts
  useEffect(() => {
    if (mounted && nextTheme) {
      if (nextTheme === 'light' || nextTheme === 'dark') {
        setTheme(nextTheme);
      }
    }
  }, [nextTheme, setTheme, mounted]);
  
  // Sync our store with next-themes when the store changes
  useEffect(() => {
    if (mounted && theme) {
      setNextTheme(theme);
    }
  }, [theme, setNextTheme, mounted]);
  
  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder with same dimensions
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
      className="relative"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        resolvedTheme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
      }`} />
      <Moon className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        resolvedTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
      }`} />
    </Button>
  );
}