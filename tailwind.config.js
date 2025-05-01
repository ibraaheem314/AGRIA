/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#131716',
        darker: '#0A0D0C',
        primary: {
          DEFAULT: '#2C5F4E',
          50: '#EFF8F4',
          100: '#D8EBE2',
          200: '#B1D7C5',
          300: '#8AC2A8',
          400: '#63AD8B',
          500: '#5D8A72',
          600: '#2C5F4E',
          700: '#254B3E',
          800: '#1E372E',
          900: '#17241F',
          950: '#0F1A16',
        },
        secondary: {
          DEFAULT: '#B98D55',
          50: '#F9F4EA',
          100: '#F2E8D5',
          200: '#E6D1AF',
          300: '#D9BA88',
          400: '#CCA362',
          500: '#B98D55',
          600: '#997544',
          700: '#785C36',
          800: '#574227',
          900: '#362919',
          950: '#251C11',
        },
        accent: {
          DEFAULT: '#366A75',
          50: '#EBF4F6',
          100: '#D7E9EC',
          200: '#AFD2DA',
          300: '#87BBC7',
          400: '#5FA4B5',
          500: '#366A75',
          600: '#2D5762',
          700: '#24444F',
          800: '#1B323B',
          900: '#121F28',
          950: '#0A1318',
        },
        success: {
          DEFAULT: '#3AAA6F',
          600: '#2D8456',
        },
        neutral: {
          750: '#2a2a2a',
          800: '#1A211F',
          850: '#17201D',
          900: '#15201D',
          950: '#0F1512',
        },
        surface: {
          DEFAULT: '#17201D',
          2: '#1A2320',
        },
        text: {
          DEFAULT: '#F5F5F5',
          secondary: '#A3B8B2',
          tertiary: '#708A82',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.07\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(44, 95, 78, 0.15)',
        'glow-sm': '0 0 12px rgba(44, 95, 78, 0.08)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#F5F5F5',
            h1: {
              color: '#F5F5F5',
              fontWeight: '600',
              letterSpacing: '0.025em',
            },
            h2: {
              color: '#F5F5F5',
              fontWeight: '600',
              letterSpacing: '0.015em',
            },
            h3: {
              color: '#F5F5F5',
              fontWeight: '500',
            },
            strong: {
              color: '#F5F5F5',
            },
            a: {
              color: '#5D8A72',
            },
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
};
