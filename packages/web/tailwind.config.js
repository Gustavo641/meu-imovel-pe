/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0284C7',
          dark: '#1E293B',
          light: '#F4F6F9',
          cta: '#F97316',
          success: '#10B981',
        },
      },
      backgroundColor: {
        'dark': '#0F172A',
        'dark-secondary': '#1E293B',
      },
    },
  },
  plugins: [],
}
