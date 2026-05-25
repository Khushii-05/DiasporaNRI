/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          primary: '#8CC0EB',
          secondary: '#BFDDF0',
          accent1: '#FFEBCC',
          accent2: '#FFF9D2',
        }
      }
    },
  },
  plugins: [],
}
