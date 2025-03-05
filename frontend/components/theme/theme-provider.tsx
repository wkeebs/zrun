'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useThemeStore } from '@/lib/stores/theme-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeStore();
  
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem
    >
      {children}
    </NextThemesProvider>
  );
}