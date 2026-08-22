import { useEffect, useState } from 'react';

export const BRAND_COLOR_DM = '#7CB3FF';
export const BRAND_COLOR_ALPHA_DM = 'rgba(124, 179, 255, 0.4)';

export const BRAND_COLOR_LM = '#2563EB';
export const BRAND_COLOR_ALPHA_LM = 'rgba(37, 99, 235, 0.4)';

export const brandColor = () => (isDarkThemeEnabled() ? BRAND_COLOR_DM : BRAND_COLOR_LM);
export const brandColorAlpha = () => (isDarkThemeEnabled() ? BRAND_COLOR_ALPHA_DM : BRAND_COLOR_ALPHA_LM);

export const HIGHLIGHTED_COLOR = '#f77f28';
export const HIGHLIGHTED_COLOR_ALPHA = 'rgba(247, 127, 40, 0.4)';

export const PRIMARY_LIGHT_COLOR = 'white';
export const PRIMARY_DARK_COLOR = '#161b22';

export type Theme = 'dark' | 'light';

export const changeThemeInMarkup = (theme: Theme) => document.querySelector('html')?.setAttribute('data-theme', theme);

export const isDarkThemeEnabled = (): boolean => document.querySelector('html')?.getAttribute('data-theme') === 'dark';

export const getSystemPreferredTheme = (_matchMedia = window.matchMedia.bind(window)): Theme =>
  _matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const useTheme = (initialTheme?: Theme) => {
  const [theme, setTheme] = useState(() => initialTheme ?? getSystemPreferredTheme());

  useEffect(() => {
    changeThemeInMarkup(theme);
  }, [theme]);

  return [theme, setTheme] as const;
};
