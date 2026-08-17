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
          primary: '#0284C7',
          dark: '#1E293B',
          light: '#F4F6F9',
          cta: '#F97316',
          success: '#10B981',
        },
      },
    },
  },
  plugins: [],
}
