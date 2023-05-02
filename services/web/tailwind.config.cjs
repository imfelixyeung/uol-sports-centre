/* eslint-disable node/no-unpublished-require */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

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
      xl: '1280px',
    },
    extend: {
      colors: {
        primary: '#E0FE10',
        secondary: '#EEEEEE',
        black: '#1A1A1A',
        white: '#EEEEEE',
        danger: '#D32F2F',
      },
      fontFamily: {
        body: ['Saira', ...defaultTheme.fontFamily.sans],
        display: ['Saira Condensed', 'Saira', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        auth: "url('/assets/images/patterns/auth.svg')",
        'card-alt': "url('/assets/images/patterns/card-alt.svg')",
        'card-red': "url('/assets/images/patterns/card-red.svg')",
        card: "url('/assets/images/patterns/card.svg')",
        hero: "url('/assets/images/patterns/hero.svg')",
      },
      boxShadow: {
        card: '0px 1px 6px 0px #00000040',
      },
    },
  },
  plugins: [
    plugin(({addUtilities, theme}) => {
      addUtilities({
        '.typography-display1': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '900',
          fontSize: '8rem',
          lineHeight: '6.25rem',
          letterSpacing: '0.025em',
        },
        '.typography-display2': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '900',
          fontSize: '5rem',
          lineHeight: '4rem',
          letterSpacing: '0.025em',
        },
        '.typography-subtext': {
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400',
          fontSize: '1rem',
          lineHeight: '1.15375rem',
          letterSpacing: '0.025em',
        },
        '.typography-h1': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '900',
          fontSize: '3.25rem',
          lineHeight: '3.125rem',
          letterSpacing: '0em',
        },
        '.typography-h2': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '900',
          fontSize: '2rem',
          lineHeight: '2.25rem',
          letterSpacing: '0em',
        },
        '.typography-h3': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '900',
          fontSize: '1.5rem',
          lineHeight: '1.75rem',
          letterSpacing: '0em',
        },
        '.typography-p': {
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400',
          fontSize: '1.25rem',
          lineHeight: '2rem',
          letterSpacing: '0em',
        },
        '.typography-p-small': {
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400',
          fontSize: '0.875rem',
          lineHeight: '0.875rem',
          letterSpacing: '0em',
        },
        '.typography-link-nav': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '700',
          fontSize: '1.25rem',
          lineHeight: '2rem',
          letterSpacing: '0em',
        },
        '.typography-link-footer': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '700',
          fontSize: '2.25rem',
          lineHeight: '2.25rem',
          letterSpacing: '0em',
        },
        '.typography-button': {
          fontFamily: theme('fontFamily.display'),
          fontWeight: '700',
          fontSize: '1.25rem',
          lineHeight: '1.875rem',
          letterSpacing: '0em',
        },
        '.typography-data': {
          fontFamily: theme('fontFamily.body'),
          fontWeight: '400',
          fontSize: '0.875rem',
          lineHeight: '1.375rem',
          letterSpacing: '0em',
        },
      });
    }),
  ],
};
