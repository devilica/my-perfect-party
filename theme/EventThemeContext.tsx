import { createContext, ReactNode, useContext, useMemo } from 'react';

import { getCelebrationTheme, ThemePalette } from '@/theme/celebrations';
import { colors as globalColors } from '@/theme/colors';
import { CelebrationThemeId } from '@/types/models';

export type ThemeContextValue = {
  themeId: CelebrationThemeId;
  colors: ThemePalette;
  backgroundImage: ReturnType<typeof getCelebrationTheme>['backgroundImage'];
  overlayColors: [string, string];
  icon: ReturnType<typeof getCelebrationTheme>['icon'];
};

const EventThemeContext = createContext<ThemeContextValue | null>(null);
const AppThemeContext = createContext<ThemeContextValue | null>(null);

function buildThemeValue(themeId: CelebrationThemeId): ThemeContextValue {
  const theme = getCelebrationTheme(themeId);
  return {
    themeId: theme.id,
    colors: theme.colors,
    backgroundImage: theme.backgroundImage,
    overlayColors: theme.overlayColors,
    icon: theme.icon,
  };
}

export function EventThemeProvider({
  themeId,
  children,
}: {
  themeId: CelebrationThemeId;
  children: ReactNode;
}) {
  const value = useMemo(() => buildThemeValue(themeId), [themeId]);

  return (
    <EventThemeContext.Provider value={value}>{children}</EventThemeContext.Provider>
  );
}

export function AppThemeProvider({
  themeId,
  children,
}: {
  themeId: CelebrationThemeId;
  children: ReactNode;
}) {
  const value = useMemo(() => buildThemeValue(themeId), [themeId]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useEventTheme(): ThemeContextValue | null {
  return useContext(EventThemeContext);
}

export function useAppTheme(): ThemeContextValue | null {
  return useContext(AppThemeContext);
}

export function useActiveTheme(): ThemeContextValue | null {
  return useEventTheme() ?? useAppTheme();
}

export function useThemeColors(): ThemePalette {
  const eventTheme = useEventTheme();
  const appTheme = useAppTheme();
  return eventTheme?.colors ?? appTheme?.colors ?? globalColors;
}
