/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: '#2C1810',
        growth: '#4A7C59',
        harvest: '#D4A373',
        water: '#3A86FF',
        sun: '#FFBE0B',
        surface: {
          DEFAULT: '#1A1A1A',
          light: '#2D2D2D',
          dark: '#0D0D0D',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A3A3A3',
          tertiary: '#666666',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'growth-pattern': "url('/patterns/growth.svg')",
        'soil-pattern': "url('/patterns/soil.svg')",
        'leaf-pattern': "url('/patterns/leaf.svg')",
      },
      animation: {
        'growth': 'growth 2s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        growth: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
