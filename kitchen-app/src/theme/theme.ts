// Main theme configuration - change colors here to update entire app theme
export interface ThemeConfig {
  colors: {
    primary: string;
    primaryHover: string;
    success: string;
    successHover: string;
    warning: string;
    warningHover: string;
    danger: string;
    dangerHover: string;
    secondary: string;
    secondaryHover: string;
    // Background colors
    pageBackground: string;
    cardBackground: string;
    modalOverlay: string;
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    // Border colors
    borderLight: string;
    borderMedium: string;
  };
  statusColors: {
    pending: string;
    partiallyDelivered: string;
    fullyDelivered: string;
    applied: string;
    unapplied: string;
  };
  severityColors: {
    minor: string;
    major: string;
    totalLoss: string;
  };
  confidenceColors: {
    high: string;
    medium: string;
    low: string;
  };
}

// Default theme (current blue theme)
export const defaultTheme: ThemeConfig = {
  colors: {
    primary: 'blue-500',
    primaryHover: 'blue-600',
    success: 'green-500',
    successHover: 'green-600',
    warning: 'yellow-500',
    warningHover: 'yellow-600', 
    danger: 'red-500',
    dangerHover: 'red-600',
    secondary: 'gray-500',
    secondaryHover: 'gray-600',
    pageBackground: 'gray-50',
    cardBackground: 'white',
    modalOverlay: 'black bg-opacity-50',
    textPrimary: 'gray-900',
    textSecondary: 'gray-700',
    textMuted: 'gray-500',
    borderLight: 'gray-200',
    borderMedium: 'gray-300',
  },
  statusColors: {
    pending: 'yellow-100 text-yellow-800',
    partiallyDelivered: 'orange-100 text-orange-800',
    fullyDelivered: 'green-100 text-green-800',
    applied: 'green-100 text-green-800',
    unapplied: 'yellow-100 text-yellow-800',
  },
  severityColors: {
    minor: 'yellow-50 text-yellow-800',
    major: 'orange-50 text-orange-800', 
    totalLoss: 'red-50 text-red-800',
  },
  confidenceColors: {
    high: 'green-600 bg-green-50 border-green-200',
    medium: 'yellow-600 bg-yellow-50 border-yellow-200',
    low: 'blue-600 bg-blue-50 border-blue-200',
  },
};

// Alternative purple theme example
export const purpleTheme: ThemeConfig = {
  colors: {
    primary: 'purple-500',
    primaryHover: 'purple-600',
    success: 'emerald-500',
    successHover: 'emerald-600',
    warning: 'amber-500',
    warningHover: 'amber-600',
    danger: 'rose-500',
    dangerHover: 'rose-600',
    secondary: 'slate-500',
    secondaryHover: 'slate-600',
    pageBackground: 'slate-50',
    cardBackground: 'white',
    modalOverlay: 'black bg-opacity-50',
    textPrimary: 'slate-900',
    textSecondary: 'slate-700',
    textMuted: 'slate-500',
    borderLight: 'slate-200',
    borderMedium: 'slate-300',
  },
  statusColors: {
    pending: 'amber-100 text-amber-800',
    partiallyDelivered: 'orange-100 text-orange-800',
    fullyDelivered: 'emerald-100 text-emerald-800',
    applied: 'emerald-100 text-emerald-800',
    unapplied: 'amber-100 text-amber-800',
  },
  severityColors: {
    minor: 'amber-50 text-amber-800',
    major: 'orange-50 text-orange-800',
    totalLoss: 'rose-50 text-rose-800',
  },
  confidenceColors: {
    high: 'emerald-600 bg-emerald-50 border-emerald-200',
    medium: 'amber-600 bg-amber-50 border-amber-200', 
    low: 'purple-600 bg-purple-50 border-purple-200',
  },
};

// Current theme - change this to switch themes globally
export const currentTheme = defaultTheme;  // Original blue theme
// export const currentTheme = purpleTheme;  // Switch to purple theme for demo

// Helper functions to get theme colors
export const getThemeColor = (colorKey: keyof ThemeConfig['colors']) => {
  return currentTheme.colors[colorKey];
};

export const getStatusColor = (status: keyof ThemeConfig['statusColors']) => {
  return currentTheme.statusColors[status];
};

export const getSeverityColor = (severity: keyof ThemeConfig['severityColors']) => {
  return currentTheme.severityColors[severity];
};

export const getConfidenceColor = (confidenceLevel: keyof ThemeConfig['confidenceColors']) => {
  return currentTheme.confidenceColors[confidenceLevel];
};

// CSS class builder functions
export const buildBgClass = (color: string) => `bg-${color}`;
export const buildTextClass = (color: string) => `text-${color}`;
export const buildBorderClass = (color: string) => `border-${color}`;
export const buildHoverBgClass = (color: string) => `hover:bg-${color}`;
export const buildHoverTextClass = (color: string) => `hover:text-${color}`;