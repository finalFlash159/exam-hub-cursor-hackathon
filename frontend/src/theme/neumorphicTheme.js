/**
 * Modern Design System - Compact & Professional
 * Complete color palette with semantic tokens
 * Standardized spacing, typography, and utilities
 */

import { createTheme } from '@mui/material/styles';

// ========== MODERN COLOR PALETTE ==========

// Primary Blue - Professional & Trustworthy
const PRIMARY = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  // Main
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
};

// Success Green - Achievement & Positive
const SUCCESS = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#10b981',  // Main
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
};

// Warning Amber - Attention & Caution
const WARNING = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',  // Main
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
};

// Error Red - Danger & Critical
const ERROR = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',  // Main
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
};

// Purple - Premium & Creative
const PURPLE = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',  // Main
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
};

// Indigo - Technology & Innovation
const INDIGO = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',  // Main
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
};

// Gray Scale - Neutral & Text
const GRAY = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Get semantic color with specific shade
 */
const getSemanticColor = (colorName, shade = 500) => {
  const colors = {
    primary: PRIMARY,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    purple: PURPLE,
    indigo: INDIGO,
    gray: GRAY,
  };
  return colors[colorName]?.[shade] || colors.primary[500];
};

/**
 * Create alpha (transparent) color
 */
const alpha = (color, opacity) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// ========== THEME CONFIGURATION ==========

export const neumorphicTheme = createTheme({
  palette: {
    mode: 'light',
    
    // Primary - Blue
    primary: {
      50: PRIMARY[50],
      100: PRIMARY[100],
      200: PRIMARY[200],
      300: PRIMARY[300],
      400: PRIMARY[400],
      500: PRIMARY[500],
      600: PRIMARY[600],
      700: PRIMARY[700],
      800: PRIMARY[800],
      900: PRIMARY[900],
      main: PRIMARY[500],
      light: PRIMARY[400],
      dark: PRIMARY[600],
      contrastText: '#ffffff',
    },
    
    // Secondary - Gray
    secondary: {
      main: GRAY[600],
      light: GRAY[500],
      dark: GRAY[700],
      contrastText: '#ffffff',
    },
    
    // Success - Green
    success: {
      50: SUCCESS[50],
      100: SUCCESS[100],
      200: SUCCESS[200],
      300: SUCCESS[300],
      400: SUCCESS[400],
      500: SUCCESS[500],
      600: SUCCESS[600],
      700: SUCCESS[700],
      800: SUCCESS[800],
      900: SUCCESS[900],
      main: SUCCESS[500],
      light: SUCCESS[100],
      dark: SUCCESS[700],
      contrastText: '#ffffff',
    },
    
    // Warning - Amber
    warning: {
      50: WARNING[50],
      100: WARNING[100],
      200: WARNING[200],
      300: WARNING[300],
      400: WARNING[400],
      500: WARNING[500],
      600: WARNING[600],
      700: WARNING[700],
      800: WARNING[800],
      900: WARNING[900],
      main: WARNING[500],
      light: WARNING[100],
      dark: WARNING[700],
      contrastText: '#000000',
    },
    
    // Error - Red
    error: {
      50: ERROR[50],
      100: ERROR[100],
      200: ERROR[200],
      300: ERROR[300],
      400: ERROR[400],
      500: ERROR[500],
      600: ERROR[600],
      700: ERROR[700],
      800: ERROR[800],
      900: ERROR[900],
      main: ERROR[500],
      light: ERROR[100],
      dark: ERROR[700],
      contrastText: '#ffffff',
    },
    
    // Info - Indigo
    info: {
      50: INDIGO[50],
      100: INDIGO[100],
      200: INDIGO[200],
      300: INDIGO[300],
      400: INDIGO[400],
      500: INDIGO[500],
      600: INDIGO[600],
      700: INDIGO[700],
      800: INDIGO[800],
      900: INDIGO[900],
      main: INDIGO[500],
      light: INDIGO[100],
      dark: INDIGO[700],
      contrastText: '#ffffff',
    },
    
    // Purple - Custom semantic color
    purple: {
      50: PURPLE[50],
      100: PURPLE[100],
      200: PURPLE[200],
      300: PURPLE[300],
      400: PURPLE[400],
      500: PURPLE[500],
      600: PURPLE[600],
      700: PURPLE[700],
      800: PURPLE[800],
      900: PURPLE[900],
      main: PURPLE[500],
      light: PURPLE[100],
      dark: PURPLE[700],
      contrastText: '#ffffff',
    },
    
    // Backgrounds
    background: {
      default: GRAY[50],     // Light gray background
      paper: '#ffffff',       // Pure white for cards
    },
    
    // Text
    text: {
      primary: GRAY[800],     // Dark text
      secondary: GRAY[600],   // Medium gray
      disabled: GRAY[400],    // Light gray
    },
    
    // Divider
    divider: GRAY[200],
  },
  
  // ========== TYPOGRAPHY - COMPACT SCALE ==========
  typography: {
    fontFamily: 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontSize: 14,  // Compact base
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    
    h1: {
      fontSize: '1.75rem',  // 28px - compact
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',   // 24px
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem',  // 20px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem',     // 16px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem', // 14px - compact
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.813rem', // 13px - smaller
      fontWeight: 500,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: 0,
    },
    caption: {
      fontSize: '0.75rem',  // 12px - small
      fontWeight: 500,
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.688rem', // 11px - tiny
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
  
  // ========== SHAPE & SPACING ==========
  shape: {
    borderRadius: 6,  // Subtle rounded corners
  },
  
  spacing: 8,  // Base spacing unit (1 = 8px)
  
  // ========== COMPONENT OVERRIDES ==========
  components: {
    // ========== SURFACES & CONTAINERS ==========
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          border: `1px solid ${GRAY[200]}`,
        },
        elevation0: {
          backgroundColor: '#ffffff',
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${GRAY[200]}`,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          backgroundColor: '#ffffff',
          borderRadius: 6,
        },
      },
    },

    // ========== BUTTONS - COMPACT ==========
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 6,
          boxShadow: 'none',
          textTransform: 'none',
          padding: '8px 16px',  // Compact
          fontSize: '0.875rem',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: PRIMARY[500],
          color: 'white',
          '&:hover': {
            backgroundColor: PRIMARY[600],
          },
          '&:active': {
            backgroundColor: PRIMARY[700],
          },
          '&:disabled': {
            backgroundColor: GRAY[200],
            color: GRAY[400],
          },
        },
        outlined: {
          borderColor: PRIMARY[500],
          color: PRIMARY[500],
          '&:hover': {
            backgroundColor: PRIMARY[50],
            borderColor: PRIMARY[600],
          },
          '&:disabled': {
            borderColor: GRAY[300],
            color: GRAY[400],
          },
        },
        text: {
          color: PRIMARY[500],
          '&:hover': {
            backgroundColor: PRIMARY[50],
          },
          '&:disabled': {
            color: GRAY[400],
          },
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.813rem',
        },
        sizeMedium: {
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '1rem',
        },
      },
    },

    // ========== TEXT FIELDS - COMPACT ==========
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: GRAY[50],
            borderRadius: 6,
            '& fieldset': {
              borderColor: GRAY[200],
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: GRAY[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: PRIMARY[500],
              borderWidth: '1px',  // Thinner
            },
            '&.Mui-error fieldset': {
              borderColor: ERROR[500],
            },
          },
          '& .MuiOutlinedInput-input': {
            color: GRAY[800],
            fontSize: '0.875rem',  // Compact
            padding: '10px 14px',   // Compact
            '&::placeholder': {
              color: GRAY[400],
              opacity: 1,
            },
          },
          '& .MuiInputBase-input:disabled': {
            backgroundColor: GRAY[100],
            color: GRAY[400],
            '-webkit-text-fill-color': GRAY[400],
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: GRAY[50],
          '&:hover': {
            backgroundColor: GRAY[100],
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: GRAY[200],
          },
          '&:hover:before': {
            borderBottomColor: GRAY[300],
          },
          '&.Mui-focused:after': {
            borderBottomColor: PRIMARY[500],
          },
        },
      },
    },

    // ========== FORM CONTROLS - COMPACT ==========
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '6px',  // Compact
          '&.Mui-checked': {
            color: PRIMARY[500],
          },
          '&:hover': {
            backgroundColor: PRIMARY[50],
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: '6px',  // Compact
          '&.Mui-checked': {
            color: PRIMARY[500],
          },
          '&:hover': {
            backgroundColor: PRIMARY[50],
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: PRIMARY[500],
            '& + .MuiSwitch-track': {
              backgroundColor: PRIMARY[500],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.813rem',  // Compact
          height: 'auto',
          padding: '4px 10px',   // Compact
          border: `1px solid ${GRAY[200]}`,
          backgroundColor: GRAY[50],
          color: GRAY[800],
        },
        sizeSmall: {
          fontSize: '0.75rem',
          padding: '2px 8px',
        },
        filled: {
          backgroundColor: PRIMARY[100],
          color: PRIMARY[700],
          border: 'none',
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: GRAY[200],
        },
        colorPrimary: {
          backgroundColor: PRIMARY[100],
          color: PRIMARY[700],
          border: 'none',
        },
        colorSuccess: {
          backgroundColor: SUCCESS[100],
          color: SUCCESS[700],
          border: 'none',
        },
        colorWarning: {
          backgroundColor: WARNING[100],
          color: WARNING[700],
          border: 'none',
        },
        colorError: {
          backgroundColor: ERROR[100],
          color: ERROR[700],
          border: 'none',
        },
      },
    },

    // ========== PROGRESS & INDICATORS - COMPACT ==========
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 6,  // Thinner
          backgroundColor: GRAY[200],
        },
        bar: {
          borderRadius: 6,
          backgroundColor: PRIMARY[500],
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: PRIMARY[500],
        },
        circle: {
          strokeLinecap: 'round',
        },
      },
    },

    // ========== DIALOGS & POPOVERS ==========
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: `1px solid ${GRAY[200]}`,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: `1px solid ${GRAY[200]}`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },

    // ========== LISTS & TABLES - COMPACT ==========
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '8px 12px',  // Compact
          '&.Mui-selected': {
            backgroundColor: PRIMARY[50],
            '&:hover': {
              backgroundColor: PRIMARY[100],
            },
          },
          '&:hover': {
            backgroundColor: GRAY[50],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: GRAY[50],
          color: GRAY[800],
          fontWeight: 600,
          fontSize: '0.813rem',  // Compact
          padding: '10px 12px',   // Compact
          borderColor: GRAY[200],
        },
        body: {
          fontSize: '0.875rem',  // Compact
          padding: '10px 12px',   // Compact
          borderColor: GRAY[100],
          color: GRAY[800],
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: GRAY[50],
          },
          '&.Mui-selected': {
            backgroundColor: PRIMARY[50],
            '&:hover': {
              backgroundColor: PRIMARY[100],
            },
          },
        },
      },
    },

    // ========== ALERTS & NOTIFICATIONS - COMPACT ==========
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',  // Compact
          padding: '8px 12px',    // Compact
          borderRadius: 6,
        },
        standardSuccess: {
          backgroundColor: SUCCESS[50],
          color: SUCCESS[700],
          border: `1px solid ${SUCCESS[200]}`,
        },
        standardWarning: {
          backgroundColor: WARNING[50],
          color: WARNING[700],
          border: `1px solid ${WARNING[200]}`,
        },
        standardError: {
          backgroundColor: ERROR[50],
          color: ERROR[700],
          border: `1px solid ${ERROR[200]}`,
        },
        standardInfo: {
          backgroundColor: INDIGO[50],
          color: INDIGO[700],
          border: `1px solid ${INDIGO[200]}`,
        },
      },
    },

    // ========== MISC ==========
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY[500],
          color: 'white',
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: PRIMARY[500],
          textDecoration: 'none',
          fontWeight: 600,
          '&:hover': {
            textDecoration: 'underline',
            color: PRIMARY[600],
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          color: GRAY[800],
          borderBottom: `1px solid ${GRAY[200]}`,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

// ========== EXPORTS ==========

/**
 * Export full color palettes
 */
export const colorPalettes = {
  primary: PRIMARY,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  purple: PURPLE,
  indigo: INDIGO,
  gray: GRAY,
};

/**
 * Export utility functions
 */
export { getSemanticColor, alpha };

/**
 * Legacy exports for backward compatibility
 */
export const neumorphicColors = {
  // Primary colors
  primary: PRIMARY[500],
  primaryLight: PRIMARY[100],
  primaryDark: PRIMARY[700],
  
  // Success colors
  success: SUCCESS[500],
  successLight: SUCCESS[100],
  successDark: SUCCESS[700],
  
  // Warning colors
  warning: WARNING[500],
  warningLight: WARNING[100],
  warningDark: WARNING[700],
  
  // Error colors
  error: ERROR[500],
  errorLight: ERROR[100],
  errorDark: ERROR[700],
  
  // Info colors
  info: INDIGO[500],
  infoLight: INDIGO[100],
  infoDark: INDIGO[700],
  
  // Purple colors
  purple: PURPLE[500],
  purpleLight: PURPLE[100],
  purpleDark: PURPLE[700],
  
  // Full palettes
  PRIMARY,
  SUCCESS,
  WARNING,
  ERROR,
  PURPLE,
  INDIGO,
  GRAY,
};

/**
 * Spacing scale constants
 */
export const spacing = {
  // Page padding
  pagePx: { xs: 1.5, md: 2 },
  pagePy: { xs: 1.5, md: 2 },
  
  // Card padding
  cardCompact: 1.25,
  cardNormal: 2,
  cardLarge: 3,
  
  // Section spacing
  sectionMb: 2,
  sectionGap: 1.5,
  
  // Element spacing
  elementGap: 1,
  elementMb: 0.75,
};

export default neumorphicTheme;
