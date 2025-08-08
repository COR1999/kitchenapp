// Theme exports
export {
  defaultTheme,
  purpleTheme,
  currentTheme,
  getThemeColor,
  buildBgClass,
  buildTextClass,
  buildBorderClass,
  buildHoverBgClass,
  buildHoverTextClass
} from './theme';

export {
  colors,
  getStatusColor as getColorStatusColor,
  getConfidenceColor as getColorConfidenceColor,
  getSeverityColor as getColorSeverityColor
} from './colors';

// Export theme functions with priority
export {
  getStatusColor,
  getSeverityColor,
  getConfidenceColor
} from './theme';

// Utility function to apply theme classes
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};