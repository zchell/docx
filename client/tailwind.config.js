/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'microsoft': ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'microsoft-blue': '#0078d4',
        'microsoft-blue-hover': '#106ebe',
        'microsoft-green': '#107c10',
        'microsoft-orange': '#ff8c00',
        'microsoft-red': '#d13438',
        'microsoft-purple': '#5c2d91',
        'microsoft-gray': {
          50: '#f8f9fa',
          100: '#f3f2f1',
          200: '#edebe9',
          300: '#e1dfdd',
          400: '#d2d0ce',
          500: '#b3b0ad',
          600: '#979593',
          700: '#797775',
          800: '#605e5c',
          900: '#323130',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}