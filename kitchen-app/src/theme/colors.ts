// Centralized color palette for consistent theming
export const colors = {
  // Primary brand colors
  primary: {
    50: 'bg-blue-50',
    100: 'bg-blue-100',
    500: 'bg-blue-500',
    600: 'bg-blue-600',
    700: 'bg-blue-700',
    text: {
      50: 'text-blue-50',
      100: 'text-blue-100', 
      500: 'text-blue-500',
      600: 'text-blue-600',
      700: 'text-blue-700',
      800: 'text-blue-800',
    },
    border: {
      200: 'border-blue-200',
      300: 'border-blue-300',
      500: 'border-blue-500',
    }
  },

  // Success colors (green)
  success: {
    50: 'bg-green-50',
    100: 'bg-green-100',
    500: 'bg-green-500',
    600: 'bg-green-600',
    text: {
      600: 'text-green-600',
      700: 'text-green-700',
      800: 'text-green-800',
    },
    border: {
      200: 'border-green-200',
      500: 'border-green-500',
    }
  },

  // Warning colors (yellow)
  warning: {
    50: 'bg-yellow-50',
    100: 'bg-yellow-100',
    500: 'bg-yellow-500',
    600: 'bg-yellow-600',
    text: {
      600: 'text-yellow-600',
      700: 'text-yellow-700',
      800: 'text-yellow-800',
    },
    border: {
      200: 'border-yellow-200',
    }
  },

  // Danger colors (red)
  danger: {
    50: 'bg-red-50',
    100: 'bg-red-100',
    500: 'bg-red-500',
    600: 'bg-red-600',
    text: {
      500: 'text-red-500',
      600: 'text-red-600',
      700: 'text-red-700',
      800: 'text-red-800',
    },
    border: {
      200: 'border-red-200',
      300: 'border-red-300',
      500: 'border-red-500',
    }
  },

  // Info colors (orange)
  info: {
    100: 'bg-orange-100',
    500: 'bg-orange-500',
    600: 'bg-orange-600',
    text: {
      600: 'text-orange-600',
      700: 'text-orange-700',
      800: 'text-orange-800',
    },
    border: {
      200: 'border-orange-200',
    }
  },

  // Neutral colors (gray)
  neutral: {
    50: 'bg-gray-50',
    100: 'bg-gray-100',
    200: 'bg-gray-200',
    300: 'bg-gray-300',
    500: 'bg-gray-500',
    600: 'bg-gray-600',
    text: {
      400: 'text-gray-400',
      500: 'text-gray-500',
      600: 'text-gray-600',
      700: 'text-gray-700',
      800: 'text-gray-800',
      900: 'text-gray-900',
    },
    border: {
      200: 'border-gray-200',
      300: 'border-gray-300',
    }
  },

  // Common UI colors
  background: {
    page: 'bg-gray-50',
    card: 'bg-white',
    modal: 'bg-black bg-opacity-50',
  },

  // Status-specific colors
  status: {
    pending: 'bg-yellow-100 text-yellow-800',
    partiallyDelivered: 'bg-orange-100 text-orange-800', 
    fullyDelivered: 'bg-green-100 text-green-800',
    applied: 'bg-green-100 text-green-800',
    unapplied: 'bg-yellow-100 text-yellow-800',
  },

  // Confidence levels
  confidence: {
    high: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-blue-600 bg-blue-50 border-blue-200',
  },

  // Severity levels
  severity: {
    minor: 'bg-yellow-50 text-yellow-800',
    major: 'bg-orange-50 text-orange-800',
    total_loss: 'bg-red-50 text-red-800',
  }
} as const;

// Helper functions for consistent color application
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return colors.status.pending;
    case 'partially_delivered':
      return colors.status.partiallyDelivered;
    case 'fully_delivered':
      return colors.status.fullyDelivered;
    case 'applied':
      return colors.status.applied;
    case 'unapplied':
      return colors.status.unapplied;
    default:
      return colors.neutral[100];
  }
};

export const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return colors.confidence.high;
  if (confidence >= 0.6) return colors.confidence.medium;
  return colors.confidence.low;
};

export const getSeverityColor = (severity: 'minor' | 'major' | 'total_loss') => {
  return colors.severity[severity];
};