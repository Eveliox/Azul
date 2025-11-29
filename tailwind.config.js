/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-blue': '#2563EB',
        'azul-light': '#3B82F6',
        'azul-dark': '#1E40AF',
      },
    },
  },
  plugins: [],
}

