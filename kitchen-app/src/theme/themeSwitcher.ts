// Theme Switcher Utility
// This demonstrates how easy it is to change the entire app's color scheme

import { ThemeConfig, defaultTheme, purpleTheme } from './theme';

// Available themes
export const themes = {
  default: defaultTheme,
  purple: purpleTheme,
  // Add more themes here as needed
  emerald: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: 'emerald-500',
      primaryHover: 'emerald-600',
      success: 'green-500',
      successHover: 'green-600',
    }
  } as ThemeConfig,
  rose: {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors, 
      primary: 'rose-500',
      primaryHover: 'rose-600',
      danger: 'red-500',
      dangerHover: 'red-600',
    }
  } as ThemeConfig,
} as const;

export type ThemeName = keyof typeof themes;

// Function to switch themes (would be used with React context or state management)
export const switchTheme = (themeName: ThemeName): ThemeConfig => {
  return themes[themeName];
};

// Helper function to demonstrate theme switching
export const getAllThemeNames = (): ThemeName[] => {
  return Object.keys(themes) as ThemeName[];
};

// Example usage:
// To switch to purple theme, change the import in theme.ts:
// export const currentTheme = purpleTheme; // instead of defaultTheme
//
// Or use with React state:
// const [currentTheme, setCurrentTheme] = useState(themes.default);
// setCurrentTheme(themes.purple); // switches entire app to purple theme