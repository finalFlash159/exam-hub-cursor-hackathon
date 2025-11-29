/**
 * Dark Theme Configuration
 * Complements the light neumorphicTheme
 */

import { createTheme } from '@mui/material/styles';

// Dark theme colors
const DARK_PRIMARY = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c3d66',
};

const DARK_BACKGROUND = {
  default: '#0f172a',
  paper: '#1e293b',
};

const DARK_TEXT = {
  primary: '#f1f5f9',
  secondary: '#cbd5e1',
  disabled: '#64748b',
};

const DARK_GRAY = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

const DARK_SUCCESS = {
  main: '#10b981',
  light: '#d1fae5',
  dark: '#047857',
};

const DARK_WARNING = {
  main: '#f59e0b',
  light: '#fef3c7',
  dark: '#d97706',
};

const DARK_ERROR = {
  main: '#ef4444',
  light: '#fee2e2',
  dark: '#dc2626',
};

const DARK_INFO = {
  main: '#06b6d4',
  light: '#cffafe',
  dark: '#0891b2',
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: DARK_PRIMARY[500],
      light: DARK_PRIMARY[400],
      dark: DARK_PRIMARY[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: DARK_GRAY[600],
      light: DARK_GRAY[500],
      dark: DARK_GRAY[700],
      contrastText: '#ffffff',
    },
    success: {
      main: DARK_SUCCESS.main,
      light: DARK_SUCCESS.light,
      dark: DARK_SUCCESS.dark,
      contrastText: '#ffffff',
    },
    warning: {
      main: DARK_WARNING.main,
      light: DARK_WARNING.light,
      dark: DARK_WARNING.dark,
      contrastText: '#000000',
    },
    error: {
      main: DARK_ERROR.main,
      light: DARK_ERROR.light,
      dark: DARK_ERROR.dark,
      contrastText: '#ffffff',
    },
    info: {
      main: DARK_INFO.main,
      light: DARK_INFO.light,
      dark: DARK_INFO.dark,
      contrastText: '#ffffff',
    },
    background: DARK_BACKGROUND,
    text: DARK_TEXT,
    divider: DARK_GRAY[700],
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: DARK_TEXT.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: DARK_TEXT.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: DARK_TEXT.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: DARK_TEXT.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: DARK_TEXT.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: DARK_TEXT.primary,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: DARK_TEXT.primary,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: DARK_TEXT.secondary,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '1rem',
    },
    caption: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: DARK_TEXT.secondary,
    },
  },
  shape: {
    borderRadius: 6,
  },
  spacing: 8,
  components: {
    // ========== SURFACES & CONTAINERS ==========
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: DARK_BACKGROUND.paper,
          border: `1px solid ${DARK_GRAY[700]}`,
        },
        elevation0: {
          backgroundColor: DARK_BACKGROUND.paper,
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          backgroundColor: DARK_BACKGROUND.paper,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${DARK_GRAY[700]}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          backgroundColor: DARK_BACKGROUND.paper,
          borderRadius: 6,
        },
      },
    },

    // ========== BUTTONS ==========
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
          boxShadow: 'none',
          textTransform: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: DARK_PRIMARY[500],
          color: 'white',
          '&:hover': {
            backgroundColor: DARK_PRIMARY[600],
          },
          '&:active': {
            backgroundColor: DARK_PRIMARY[700],
          },
          '&:disabled': {
            backgroundColor: DARK_GRAY[700],
            color: DARK_TEXT.disabled,
          },
        },
        outlined: {
          borderColor: DARK_PRIMARY[500],
          color: DARK_PRIMARY[400],
          '&:hover': {
            backgroundColor: `${DARK_PRIMARY[500]}15`,
            borderColor: DARK_PRIMARY[400],
          },
          '&:disabled': {
            borderColor: DARK_GRAY[700],
            color: DARK_TEXT.disabled,
          },
        },
        text: {
          color: DARK_PRIMARY[400],
          '&:hover': {
            backgroundColor: `${DARK_PRIMARY[500]}15`,
          },
          '&:disabled': {
            color: DARK_TEXT.disabled,
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.875rem',
        },
        sizeMedium: {
          padding: '10px 20px',
          fontSize: '1rem',
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1.125rem',
        },
      },
    },

    // ========== TEXT FIELDS ==========
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: DARK_GRAY[800],
            borderRadius: 6,
            '& fieldset': {
              borderColor: DARK_GRAY[700],
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: DARK_GRAY[600],
            },
            '&.Mui-focused fieldset': {
              borderColor: DARK_PRIMARY[500],
              borderWidth: '2px',
            },
            '&.Mui-error fieldset': {
              borderColor: DARK_ERROR.main,
            },
          },
          '& .MuiOutlinedInput-input': {
            color: DARK_TEXT.primary,
            '&::placeholder': {
              color: DARK_TEXT.disabled,
              opacity: 1,
            },
          },
          '& .MuiInputBase-input:disabled': {
            backgroundColor: DARK_GRAY[900],
            color: DARK_TEXT.disabled,
            '-webkit-text-fill-color': DARK_TEXT.disabled,
          },
        },
      },
    },

    // ========== FORM CONTROLS ==========
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: DARK_PRIMARY[500],
          },
          '&:hover': {
            backgroundColor: `${DARK_PRIMARY[500]}15`,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: DARK_PRIMARY[500],
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: DARK_PRIMARY[500],
            '& + .MuiSwitch-track': {
              backgroundColor: DARK_PRIMARY[500],
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          border: `1px solid ${DARK_GRAY[700]}`,
          backgroundColor: DARK_GRAY[800],
          color: DARK_TEXT.primary,
        },
        filled: {
          backgroundColor: DARK_PRIMARY[900],
          color: DARK_PRIMARY[200],
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: DARK_GRAY[700],
        },
      },
    },

    // ========== DIALOGS & POPOVERS ==========
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: `1px solid ${DARK_GRAY[700]}`,
          backgroundColor: DARK_BACKGROUND.paper,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          border: `1px solid ${DARK_GRAY[700]}`,
          backgroundColor: DARK_BACKGROUND.paper,
        },
      },
    },

    // ========== LISTS & TABLES ==========
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: `${DARK_PRIMARY[500]}25`,
            '&:hover': {
              backgroundColor: `${DARK_PRIMARY[500]}35`,
            },
          },
          '&:hover': {
            backgroundColor: DARK_GRAY[800],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: DARK_GRAY[800],
          color: DARK_TEXT.primary,
          fontWeight: 600,
          borderColor: DARK_GRAY[700],
        },
        body: {
          borderColor: DARK_GRAY[700],
          color: DARK_TEXT.primary,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: DARK_GRAY[800],
          },
          '&.Mui-selected': {
            backgroundColor: `${DARK_PRIMARY[500]}25`,
            '&:hover': {
              backgroundColor: `${DARK_PRIMARY[500]}35`,
            },
          },
        },
      },
    },

    // ========== ALERTS & NOTIFICATIONS ==========
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: `${DARK_SUCCESS.main}15`,
          color: DARK_SUCCESS.light,
          border: `1px solid ${DARK_SUCCESS.main}`,
        },
        standardWarning: {
          backgroundColor: `${DARK_WARNING.main}15`,
          color: DARK_WARNING.light,
          border: `1px solid ${DARK_WARNING.main}`,
        },
        standardError: {
          backgroundColor: `${DARK_ERROR.main}15`,
          color: DARK_ERROR.light,
          border: `1px solid ${DARK_ERROR.main}`,
        },
        standardInfo: {
          backgroundColor: `${DARK_INFO.main}15`,
          color: DARK_INFO.light,
          border: `1px solid ${DARK_INFO.main}`,
        },
      },
    },

    // ========== MISC ==========
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: DARK_PRIMARY[500],
          color: 'white',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: DARK_PRIMARY[400],
          textDecoration: 'none',
          fontWeight: 500,
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: DARK_BACKGROUND.paper,
          color: DARK_TEXT.primary,
          borderBottom: `1px solid ${DARK_GRAY[700]}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

export default darkTheme;
