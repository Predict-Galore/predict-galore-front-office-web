// theme/index.ts
/**
 * MUI Theme Configuration
 *
 * Simplified theme with essential brand colors, typography, and component customizations
 */
'use client';

import { createTheme } from '@mui/material/styles';

// Extend palette to include full color scales from Figma
declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      0: string;
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    warmRed: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    coolRed: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    green: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
  }
  interface PaletteOptions {
    neutral?: {
      0?: string;
      50?: string;
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
      950?: string;
    };
    warmRed?: {
      50?: string;
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
      950?: string;
    };
    coolRed?: {
      50?: string;
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
      950?: string;
    };
    green?: {
      50?: string;
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
      950?: string;
    };
  }
}

// Exact Figma color palette
const colors = {
  // Grayscale/Neutral palette from Figma
  neutral: {
    0: '#ffffff',
    50: '#f7f7f8',
    100: '#eeeef0',
    200: '#d9d9de',
    300: '#b8b9c1',
    400: '#91939f',
    500: '#737584',
    600: '#5d5e6c',
    700: '#4c4d58',
    800: '#41414b',
    900: '#393941',
    950: '#101012',
  },
  // Warm Red/Orange palette from Figma
  warmRed: {
    50: '#fefde8',
    100: '#fffcc2',
    200: '#fff687',
    300: '#ffe943',
    400: '#ffd60a',
    500: '#efbe03',
    600: '#ce9300',
    700: '#a46804',
    800: '#88510b',
    900: '#734210',
    950: '#432205',
  },
  // Cool Red/Pink palette from Figma
  coolRed: {
    50: '#fef2f2',
    100: '#fee6e5',
    200: '#fccfd0',
    300: '#f9a8a8',
    400: '#f5777b',
    500: '#ec4751',
    600: '#d72638',
    700: '#b61a2e',
    800: '#98192d',
    900: '#83182c',
    950: '#490812',
  },
  // Green palette from Figma
  green: {
    50: '#f2fbf5',
    100: '#e0f8e7',
    200: '#c2f0d0',
    300: '#93e2ad',
    400: '#5ccc80',
    500: '#36b15e',
    600: '#28914b',
    700: '#22733d',
    800: '#1e5631',
    900: '#1c4b2d',
    950: '#0a2916',
  },
  // Primary colors mapped from Figma
  primary: {
    main: '#36b15e', // green-500 from Figma
    light: '#5ccc80', // green-400
    dark: '#22733d', // green-700 (active state)
    contrastText: '#fff',
  },
  // Secondary/Error colors mapped from Figma
  secondary: {
    main: '#ec4751', // coolRed-500
    light: '#f5777b', // coolRed-400
    dark: '#b61a2e', // coolRed-700
    contrastText: '#fff',
  },
  // Additional semantic colors
  gradients: {
    hero: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(234, 88, 12, 0.9) 50%, rgba(163, 230, 53, 0.9) 100%)',
    contact: 'linear-gradient(180deg, #DC2626 0%, #EA580C 100%)',
    primary: 'linear-gradient(135deg, #36b15e 0%, #22733d 100%)',
    secondary: 'linear-gradient(135deg, #ec4751 0%, #b61a2e 100%)',
  },
};

// Create and customize MUI theme
const theme = createTheme({
  // Color system - Exact Figma colors
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
    error: {
      main: colors.coolRed[500], // #ec4751
      light: colors.coolRed[100], // #fee6e5 (light background)
      dark: colors.coolRed[700], // #b61a2e
    },
    success: {
      main: colors.green[500], // #36b15e
      light: colors.green[100], // #e0f8e7 (light background)
      dark: colors.green[700], // #22733d
    },
    warning: {
      main: colors.warmRed[500], // #efbe03
      light: colors.warmRed[100], // #fffcc2 (light background)
      dark: colors.warmRed[700], // #a46804
    },
    info: {
      main: colors.neutral[600], // #5d5e6c
      light: colors.neutral[100], // #eeeef0 (light background)
      dark: colors.neutral[700], // #4c4d58
    },
    background: {
      default: colors.neutral[0], // #ffffff
      paper: colors.neutral[0], // #ffffff
    },
    text: {
      primary: colors.neutral[900], // #393941
      secondary: colors.neutral[600], // #5d5e6c
      disabled: colors.neutral[400], // #91939f
    },
    // Full color scales from Figma
    neutral: colors.neutral,
    warmRed: colors.warmRed,
    coolRed: colors.coolRed,
    green: colors.green,
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

  // Global shape - Match Figma rounded corners
  shape: {
    borderRadius: 12, // Rounded-xl from Figma (8-12px)
  },

  // Component customizations - Match Figma exactly
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12, // Match Figma rounded-xl
          padding: '12px 24px',
          minHeight: '48px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          backgroundColor: colors.green[500], // #36b15e
          color: '#fff',
          '&:hover': {
            backgroundColor: colors.green[700], // #22733d (active state)
          },
          '&:active': {
            backgroundColor: colors.green[700], // #22733d
          },
          '&.Mui-disabled': {
            backgroundColor: colors.green[200], // #c2f0d0 (light green for disabled)
            color: colors.green[300], // #93e2ad (muted green text)
            opacity: 1,
          },
        },
        outlined: {
          borderColor: colors.green[500], // #36b15e
          borderWidth: 2,
          color: colors.green[500],
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: colors.green[700], // #22733d
            backgroundColor: 'transparent',
            color: colors.green[700],
          },
          '&:active': {
            borderColor: colors.green[700],
            color: colors.green[700],
          },
          '&.Mui-disabled': {
            borderColor: colors.green[200], // #c2f0d0
            color: colors.green[300], // #93e2ad
          },
        },
        text: {
          color: colors.neutral[700], // #4c4d58
          '&:hover': {
            backgroundColor: colors.neutral[100], // #eeeef0
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          minHeight: '36px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '16px 32px',
          minHeight: '56px',
          fontSize: '1rem',
        },
        // Icon button styles
        startIcon: {
          marginRight: '8px',
          marginLeft: 0,
        },
        endIcon: {
          marginLeft: '8px',
          marginRight: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px',
          minWidth: '48px',
          minHeight: '48px',
          '&.Mui-disabled': {
            backgroundColor: colors.neutral[100], // #eeeef0
            color: colors.neutral[400], // #91939f
          },
        },
        colorPrimary: {
          backgroundColor: colors.green[500],
          color: '#fff',
          '&:hover': {
            backgroundColor: colors.green[700],
          },
        },
        colorSecondary: {
          backgroundColor: 'transparent',
          border: `2px solid ${colors.green[500]}`,
          color: colors.green[500],
          '&:hover': {
            backgroundColor: 'transparent',
            borderColor: colors.green[700],
            color: colors.green[700],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12, // Match Figma rounded-xl
            backgroundColor: '#fff',
            '& fieldset': {
              borderColor: colors.neutral[200], // #d9d9de (default border)
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: colors.neutral[300], // #b8b9c1 (hover border)
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.green[500], // #36b15e (focused/success border)
              borderWidth: 2,
            },
            '&.Mui-error fieldset': {
              borderColor: colors.coolRed[500], // #ec4751 (error border)
            },
            '&.Mui-disabled': {
              backgroundColor: colors.neutral[100], // #eeeef0
              '& fieldset': {
                borderColor: colors.neutral[200], // #d9d9de
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: colors.neutral[700], // #4c4d58
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '8px',
            '&.Mui-focused': {
              color: colors.green[500],
            },
            '&.Mui-error': {
              color: colors.coolRed[500],
            },
            '&.Mui-disabled': {
              color: colors.neutral[400], // #91939f
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 16px',
            fontSize: '1rem',
            color: colors.neutral[900], // #393941
            '&::placeholder': {
              color: colors.neutral[400], // #91939f
              opacity: 1,
            },
            '&.Mui-disabled': {
              color: colors.neutral[400], // #91939f
              WebkitTextFillColor: colors.neutral[400],
            },
          },
          '& .MuiFormHelperText-root': {
            marginTop: '8px',
            fontSize: '0.875rem',
            '&.Mui-error': {
              color: colors.coolRed[500], // #ec4751
            },
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '8px',
          fontSize: '0.875rem',
          '&.Mui-error': {
            color: colors.coolRed[500], // #ec4751
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.green[500], // Success/focused state
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
          border: `1px solid ${colors.neutral[200]}`, // #d9d9de
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Slightly rounded corners
          padding: '8px',
          color: colors.neutral[300], // #b8b9c1
          '&.Mui-checked': {
            color: colors.green[500], // #36b15e
            '&:hover': {
              backgroundColor: `${colors.green[50]}33`, // Light green with opacity
            },
          },
          '&:hover': {
            backgroundColor: `${colors.neutral[100]}33`, // Light gray with opacity
          },
          '&.Mui-disabled': {
            color: colors.neutral[200], // #d9d9de
            backgroundColor: colors.neutral[100], // #eeeef0
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
          },
        },
        paper: {
          borderRadius: 12,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
