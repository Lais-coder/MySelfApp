/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          light: '#DC8DF2',
          medium: '#CA6DF2',
          dark: '#8836BF',
          darker: '#56208C',
          darkest: '#100126',
          lilac: '#7c64a4',
          lilac2: '#7668A6',
        },
        green: {
          light: '#ecfcf6',
          medium: '#43834c',
          dark: '#718C35',
          darkGreen: '#40804B',
        },
        yellow: {
          light: '#e4fc84',
        },
        cream: '#D9D5A0',
      },
      fontFamily: {
        marcellus: ['Marcellus', 'serif'],
        circular: ['Circular', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
