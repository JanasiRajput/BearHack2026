/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        phase: {
          menstrual: {
            bg: "#FFF5F5",
            accent: "#FEB2B2",
            text: "#C53030",
          },
          follicular: {
            bg: "#F0FFF4",
            accent: "#9AE6B4",
            text: "#276749",
          },
          ovulation: {
            bg: "#FFFFF0",
            accent: "#FAF089",
            text: "#744210",
          },
          luteal: {
            bg: "#FAF5FF",
            accent: "#D6BCFA",
            text: "#553C9A",
          }
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
