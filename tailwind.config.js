/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro SC"',
          '"SF Pro Text"',
          '"PingFang SC"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#effaf3',
          100: '#d9f2e1',
          200: '#b4e5c6',
          300: '#82d0a3',
          400: '#4fb37e',
          500: '#2f9c66',
          600: '#1f7d50',
          700: '#1a6342',
          800: '#174e37',
          900: '#14402f',
        },
      },
      borderRadius: {
        '2xl': '1.125rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -12px rgba(16,24,40,0.12)',
        'card-lg': '0 2px 6px rgba(16,24,40,0.05), 0 24px 60px -24px rgba(16,24,40,0.22)',
        glow: '0 0 40px -8px rgba(47,156,102,0.45)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pop': {
          '0%': { transform: 'scale(0)' },
          '70%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22,1,0.36,1) both',
        'pop': 'pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'spin-slow': 'spin-slow 18s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
