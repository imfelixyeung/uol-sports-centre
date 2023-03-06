// eslint-disable-next-line node/no-unpublished-require

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#DFFF48',
        secondary: '#EEEEEE',
        'base-100': '#1A1A1A',
        'base-content': '#EEEEEE',
      },
    },
  },
  plugins: [],
};
