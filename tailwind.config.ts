/**
 * TAILWINDCSS CONFIGURATION
 *
 * Custom theme configuration for Tailwind CSS.
 * Extends default colors, fonts, and spacing with brand design system.
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Exact Figma Green palette
        primary: {
          DEFAULT: '#36b15e', // green-500
          light: '#5ccc80',   // green-400
          dark: '#22733d',    // green-700
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
        // Exact Figma Cool Red/Pink palette
        secondary: {
          DEFAULT: '#ec4751', // coolRed-500
          light: '#f5777b',   // coolRed-400
          dark: '#b61a2e',    // coolRed-700
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
        // Exact Figma Neutral/Grayscale palette
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
        // Cool Red/Pink palette (alias for secondary)
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
        // Green palette (alias for primary)
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
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};

export default config;
