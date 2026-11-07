/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        roseGold: {
          50: '#fdf6f6',
          100: '#fbebed',
          200: '#f7d7dc',
          300: '#f1b5bf',
          400: '#e78a9c',
          500: '#d75871',
          600: '#c03855',
          700: '#a12b44',
          800: '#86273c',
          900: '#722537',
        },
        gold: {
          400: '#eab308',
          500: '#ca8a04',
          600: '#a16207',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        cinzel: ['Cinzel', 'Playfair Display', 'serif'],
        jost: ['Jost', 'Plus Jakarta Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        script: ['Alex Brush', 'Dancing Script', 'cursive']
      }
    },
  },
  plugins: [],
}

