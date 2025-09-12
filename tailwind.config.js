/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage': '#8A9A5B',        // Hijau Sage
        'off-white': '#F8F8F8',   // Latar belakang bersih
        'charcoal': '#36454F',    // Teks utama
        'accent': '#FFC107',      // Tombol Aksi (Kuning Kunyit)
      }
    },
  },
  plugins: [],
}