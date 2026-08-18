/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        clubsin: {
          green: '#1a5c3a',
          'green-light': '#2d8f5a',
          'green-pale': '#e8f5ee',
          gold: '#c9a84c',
          'gold-light': '#f5ecd0',
        },
      },
    },
  },
  plugins: [],
}
