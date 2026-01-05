/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage': {
          DEFAULT: '#8A9A5B',
          50: '#f3f6f0',
          100: '#e2e9da',
          200: '#c6d4b3',
          300: '#a4bc88',
          400: '#8a9a5b',
          500: '#6e7e46',
          600: '#566436',
          700: '#46502d',
          800: '#3b4228',
          900: '#323824',
        },
        'off-white': '#F8F8F8',   // Latar belakang bersih
        'charcoal': '#36454F',    // Teks utama
        'accent': '#FFC107',      // Tombol Aksi (Kuning Kunyit)
      }
    },
  },
  plugins: [],
}