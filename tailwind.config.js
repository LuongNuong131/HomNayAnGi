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
        'ios-bg': '#F2F2F7', // Màu nền chuẩn iOS
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'ios': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'ios-float': '0 10px 40px rgba(139, 98, 131, 0.15)',
      }
    },
  },
  plugins: [],
}