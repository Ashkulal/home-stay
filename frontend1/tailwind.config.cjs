/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f5f0',
          100: '#d4e8d4',
          200: '#a8d1a8',
          300: '#7cba7c',
          400: '#50a350',
          500: '#1a3a1a',
          600: '#143014',
          700: '#0f260f',
          800: '#0a1c0a',
          900: '#051205',
          950: '#020a02',
        },
        gold: {
          50: '#fdf8ed',
          100: '#f9edcc',
          200: '#f3d994',
          300: '#edc55c',
          400: '#e6b030',
          500: '#D4AF37',
          600: '#b8931f',
          700: '#8f721a',
          800: '#6b5516',
          900: '#4a3b12',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}
