import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Google Sans Code', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gray: {
          50: '#f7f7f5',
          100: '#e3e3e0',
          200: '#c8c8c5',
          300: '#a8a8a5',
          400: '#8a8a87',
          500: '#6e6e6b',
          600: '#545452',
          700: '#3e3e3c', // Surface
          800: '#2b2b2a', // Background
          900: '#1c1c1b', // Darker Background
          950: '#141413',
        },
        indigo: {
          50: '#f2f5f7',
          100: '#e1e8ed',
          200: '#c4d1d9',
          300: '#9fb3c2',
          400: '#7a95ab',
          500: '#5e7a91', // Morandi Blue
          600: '#4a6175',
          700: '#394b5c',
          800: '#2b3845',
          900: '#202a33',
        },
        green: {
          500: '#8da399', // Morandi Green (Sage)
          600: '#738a80',
        },
        yellow: {
          500: '#d9c88c', // Morandi Yellow (Ochre)
          600: '#bfae76',
        },
        red: {
          500: '#c48a8a', // Morandi Red (Dusty Pink/Red)
          600: '#a87373',
        },
        orange: {
          500: '#d1a68c', // Morandi Orange (Terracotta)
          600: '#b58d75',
        },
        purple: {
          500: '#a69cc4', // Morandi Purple
          600: '#8d83a8',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            p: {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
            'h1, h2, h3, h4, h5, h6': {
              marginTop: '0.5em',
              marginBottom: '0.25em',
            },
            h1: { color: '#5e7a91' }, // Morandi Blue
            h2: { color: '#8da399' }, // Morandi Green
            h3: { color: '#d9c88c' }, // Morandi Yellow
            h4: { color: '#c48a8a' }, // Morandi Red
            h5: { color: '#d1a68c' }, // Morandi Orange
            h6: { color: '#a69cc4' }, // Morandi Purple
            li: {
              marginTop: '0.1em',
              marginBottom: '0.1em',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}
