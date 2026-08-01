/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 4.75rem)', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-sm': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
      },
      colors: {
        'azul-blue': '#2563EB',
        'azul-light': '#3B82F6',
        'azul-dark': '#1E40AF',
        ink: {
          50:  '#FAFAFA',
          100: '#F3F4F6',
          200: '#D1D5DB',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#3F4652',
          600: '#2A2F38',
          700: '#1C2027',
          800: '#14171C',
          900: '#0D0F12',
          950: '#08090B',
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover:   '#60A5FA',
          muted:   '#1E3A8A',
        },
      },
      boxShadow: {
        card:        '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover':'0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.3)',
        'glow-sm':   '0 0 20px rgba(59,130,246,0.15)',
        'glow-md':   '0 0 40px rgba(59,130,246,0.25)',
      },
      spacing: {
        'section-sm': '4rem',
        'section':    '6rem',
        'section-lg': '8rem',
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
}
