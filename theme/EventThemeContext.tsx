import { createContext, ReactNode, useContext, useMemo } from 'react';

import { getCelebrationTheme, ThemePalette } from '@/theme/celebrations';
import { colors as globalColors } from '@/theme/colors';
import { CelebrationThemeId } from '@/types/models';

type EventThemeContextValue = {
  themeId: CelebrationThemeId;
  colors: ThemePalette;
  backgroundImage: ReturnType<typeof getCelebrationTheme>['backgroundImage'];
  overlayColors: [string, string];
  icon: ReturnType<typeof getCelebrationTheme>['icon'];
};

const EventThemeContext = createContext<EventThemeContextValue | null>(null);

export function EventThemeProvider({
  themeId,
  children,
}: {
  themeId: CelebrationThemeId;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const theme = getCelebrationTheme(themeId);
    return {
      themeId: theme.id,
      colors: theme.colors,
      backgroundImage: theme.backgroundImage,
      overlayColors: theme.overlayColors,
      icon: theme.icon,
    };
  }, [themeId]);

  return (
    <EventThemeContext.Provider value={value}>{children}</EventThemeContext.Provider>
  );
}

export function useEventTheme(): EventThemeContextValue | null {
  return useContext(EventThemeContext);
}

export function useThemeColors(): ThemePalette {
  const eventTheme = useEventTheme();
  return eventTheme?.colors ?? globalColors;
}
