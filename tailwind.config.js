/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream-white': '#FFF9F9',
        'soft-pink': '#FFD1DA',
        'pastel-rose': '#F4A6B8',
        'warm-purple': '#8B6283',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Dùng cho các tiêu đề lãng mạn
      }
    },
  },
  plugins: [],
}