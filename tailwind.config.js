/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: { DEFAULT: '#C41E3A', light: '#E8354F', deep: '#8B0000' },
        gold:    { DEFAULT: '#C9A84C', light: '#F0C96E', pale: '#FDF3DC' },
        seagreen:{ DEFAULT: '#2E8B6E', light: '#3DAA87' },
        seablue: { DEFAULT: '#1B6CA8', light: '#2585CC' },
        ivory:   '#FAF7F0',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        cinzel: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
}
