// theme/index.ts
/**
 * MUI Theme Configuration
 *
 * Simplified theme with essential brand colors, typography, and component customizations
 */
'use client';

import { createTheme } from '@mui/material/styles';

// Extend palette to include neutral colors
declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      50: string;
      200: string;
      400: string;
      600: string;
      900: string;
    };
  }
  interface PaletteOptions {
    neutral: {
      50: string;
      200: string;
      400: string;
      600: string;
      900: string;
    };
  }
}

// Core color palette - Comprehensive design system
const colors = {
  primary: {
    main: '#42A605', // Brand green
    light: '#5ccc80', // Hover/light states
    dark: '#22733d', // Active/pressed states
    darker: '#166534', // Darker variant for CTAs
    contrastText: '#fff',
  },
  secondary: {
    main: '#e72838', // Brand red for secondary actions
    light: '#f5777e', // Light error/warning
    dark: '#b61a2e', // Critical actions
    darker: '#991b1b', // Footer/darker red variant
    darkest: '#7f1d1d', // Darkest red variant
    contrastText: '#fff',
  },
  neutral: {
    50: '#f8fafc', // Light backgrounds
    100: '#f1f5f9', // Very light backgrounds
    200: '#e2e8f0', // Borders, dividers
    300: '#cbd5e1', // Light borders
    400: '#94a3b8', // Disabled text
    500: '#64748b', // Medium text
    600: '#475569', // Secondary text
    700: '#334155', // Dark text
    800: '#1e293b', // Very dark text
    900: '#0f172a', // Primary text
  },
  // Additional semantic colors
  gradients: {
    hero: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(234, 88, 12, 0.9) 50%, rgba(163, 230, 53, 0.9) 100%)',
    contact: 'linear-gradient(180deg, #DC2626 0%, #EA580C 100%)',
    primary: 'linear-gradient(135deg, #42A605 0%, #22733d 100%)',
    secondary: 'linear-gradient(135deg, #e72838 0%, #991b1b 100%)',
  },
};

// Create and customize MUI theme
const theme = createTheme({
  // Color system
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.contrastText,
    },
    error: { main: colors.secondary.main },
    success: { main: colors.primary.main },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      disabled: colors.neutral[400],
    },
    neutral: colors.neutral,
  },

  // Typography - Standard responsive font sizes and weights
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    // Standard font weights
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

    h1: {
      // Min: 40px, Preferred: 5vw, Max: 64px
      fontSize: 'clamp(2.5rem, 5vw + 1rem, 4rem)',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h2: {
      // Min: 32px, Preferred: 4vw, Max: 48px
      fontSize: 'clamp(2rem, 4vw + 1rem, 3rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      // Min: 28px, Preferred: 3vw, Max: 36px
      fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 2.25rem)',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6, // Slightly increased for 2026 readability standards
      color: '#1A1A1A',
    },
    button: {
      fontWeight: 600, // Slightly heavier for better UI affordance
      textTransform: 'none',
      fontSize: '0.9375rem',
    },
  },

  // Global shape
  shape: {
    borderRadius: 8,
  },

  // Component customizations
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: colors.secondary.dark,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#ffffff',
          borderBottom: `1px solid ${colors.neutral[200]}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

// Export colors and theme
export { colors };
export default theme;
