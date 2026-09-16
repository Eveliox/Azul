/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'azul-blue': '#2563EB',
        'azul-light': '#3B82F6',
        'azul-dark': '#1E40AF',
        ink: {
          50: '#FAFAFA', 100: '#F3F4F6', 200: '#D1D5DB', 300: '#9CA3AF',
          400: '#6B7280', 500: '#3F4652', 600: '#2A2F38', 700: '#1C2027',
          800: '#14171C', 900: '#0D0F12', 950: '#08090B',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
}
