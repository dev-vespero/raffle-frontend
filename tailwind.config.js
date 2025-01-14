/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c5010e',
        secondary: '#f8cc13',
        dark: '#73141c',
        'header-bg': '#610b10',
      },
      fontFamily: {
        jaro: ['Jaro', 'sans-serif'],
      },
    },
  },
  plugins: [],
}