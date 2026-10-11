/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs principales
        primary: {
          50: '#ecfdf5',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#22c55e',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: '#0ea5e9',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          DEFAULT: '#10b981',
        },
        // Couleurs agricoles spécifiques
        earth: '#8B4513',
        growth: '#22c55e',
        harvest: '#f59e0b',
        water: '#0ea5e9',
        sun: '#fbbf24',
        // Surfaces pour thème clair
        surface: {
          DEFAULT: '#f9fafb',
          light: '#ffffff',
          dark: '#f3f4f6',
        },
        // Textes pour thème clair
        text: {
          primary: '#111827',
          secondary: '#4b5563',
          tertiary: '#6b7280',
          muted: '#9ca3af',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #22c55e, #16a34a)',
        'gradient-secondary': 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b, #d97706)',
      },
      animation: {
        'growth': 'growth 2s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
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
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(34, 197, 94, 0.3)',
        'glow-secondary': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.no-horizontal-scroll': {
          'overflow-x': 'hidden',
          'max-width': '100vw',
        },
        '.safe-absolute': {
          'max-width': '100vw',
          'max-height': '100vh',
        },
        '.safe-transform': {
          'max-width': 'calc(100vw - 20px)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}
