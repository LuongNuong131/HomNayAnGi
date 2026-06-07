/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette – warm ivory + deep berry + blush
        'ivory':       '#FAF7F2',
        'ivory-dark':  '#F2EDE4',
        'blush':       '#F5C4CF',
        'blush-light': '#FDE8ED',
        'rose':        '#E8899A',
        'rose-deep':   '#C45B6E',
        'berry':       '#7A2D45',
        'berry-dark':  '#5A1F30',
        'plum':        '#3D1A26',
        'gold':        '#C9A96E',
        'gold-light':  '#F0DEB8',
        'sage':        '#8DAA8C',
        'mist':        '#EAE6F0',
      },
      fontFamily: {
        // Display: elegant serif
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Body: refined sans
        body:    ['"DM Sans"', 'sans-serif'],
        // Accent: italic script feel
        accent:  ['"Cormorant"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card':    '0 4px 24px rgba(90,31,48,0.07), 0 1px 4px rgba(90,31,48,0.05)',
        'card-hover': '0 12px 48px rgba(90,31,48,0.14), 0 2px 8px rgba(90,31,48,0.08)',
        'modal':   '0 32px 80px rgba(61,26,38,0.25)',
        'glow':    '0 0 40px rgba(232,137,154,0.35)',
        'float':   '0 16px 48px rgba(90,31,48,0.18)',
      },
      backgroundImage: {
        'petal':   'radial-gradient(ellipse at 20% 0%, #FDE8ED 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #F5C4CF 0%, transparent 60%)',
        'berry-glow': 'radial-gradient(ellipse at 50% 0%, rgba(196,91,110,0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        'xl2': '20px',
        'xl3': '28px',
        'xl4': '36px',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'pop':        'pop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':    'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(-8px) rotate(1.5deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pop: {
          '0%':   { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(28px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}