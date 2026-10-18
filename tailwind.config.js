/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'Lora', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        tiffany: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0d9488', // classic rich tiffany/teal
          600: '#0f766e',
          700: '#115e59',
          800: '#134e4a',
          900: '#042f2e',
          950: '#021e1d',
        },
        parchment: {
          50: '#fdfcf9',
          100: '#fbf8f2',
          200: '#f5efe4',
          300: '#ede3d4',
          400: '#dfd1be',
          500: '#caa787',
        },
        hogwarts: {
          50: '#faf6f0',
          100: '#f2e8dc',
          200: '#e5d1bc',
          300: '#d0b395',
          400: '#a6825c',
          500: '#84603a',
          600: '#6b4c2b',
          700: '#52381e',
          800: '#3a2613',
          900: '#26180b',
        },
        academic: {
          950: '#120f0c',
          900: '#1a1512',
          800: '#241e19',
          700: '#322a22',
          600: '#42382e',
        }
      },
      boxShadow: {
        'parchment': '0 2px 10px rgba(74, 52, 28, 0.05)',
        'parchment-md': '0 4px 18px rgba(74, 52, 28, 0.08)',
        'tiffany': '0 4px 15px rgba(13, 148, 136, 0.15)',
      }
    },
  },
  plugins: [],
}
