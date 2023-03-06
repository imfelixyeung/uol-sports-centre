/* eslint-disable node/no-unpublished-require */
const defaultTheme = require('tailwindcss/defaultTheme');

// eslint-disable-next-line node/no-unpublished-require

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    screens: {
      sm: '640px',
      md: '720px',
      lg: '1024px',
    },
    extend: {
      colors: {
        primary: '#E0FE10',
        secondary: '#EEEEEE',
        black: '#1A1A1A',
        white: '#EEEEEE',
      },
      fontFamily: {
        body: ['var(--font-saira)', ...defaultTheme.fontFamily.sans],
        display: [
          'var(--font-saira-condensed)',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
};
