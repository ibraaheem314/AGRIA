/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: 'rgb(8, 15, 12)',
        darker: 'rgb(5, 10, 8)',
        primary: {
          DEFAULT: 'rgb(46, 160, 87)',
          50: '#f0fbf4',
          100: '#dcf7e8',
          200: '#b9efd1',
          300: '#87e0b0',
          400: '#4ccb85',
          500: '#2ea057',
          600: '#1f8549',
          700: '#1b6b3c',
          800: '#195533',
          900: '#17472d',
          950: '#0a2718',
        },
        secondary: {
          DEFAULT: 'rgb(58, 124, 151)',
          50: '#f0f7fb',
          100: '#dceef5',
          200: '#bfdfec',
          300: '#92c7dc',
          400: '#5da7c7',
          500: '#3a7c97',
          600: '#316b86',
          700: '#2c5c71',
          800: '#294d5d',
          900: '#26404f',
          950: '#172a35',
        },
        accent: {
          DEFAULT: 'rgb(235, 137, 52)',
          50: '#fef6ee',
          100: '#fdead8',
          200: '#f9d2b0',
          300: '#f4b279',
          400: '#eb8934',
          500: '#e86e1e',
          600: '#d75416',
          700: '#b33d15',
          800: '#91331a',
          900: '#762d18',
          950: '#40150c',
        },
        success: {
          DEFAULT: '#36a269',
          600: '#2c7e51',
        },
        info: {
          DEFAULT: '#3b89c5',
          600: '#2a6da7',
        },
        warning: {
          DEFAULT: '#f59e0b',
          600: '#d88705',
        },
        danger: {
          DEFAULT: '#ef4444',
          600: '#dc2626',
        },
        neutral: {
          750: 'rgb(55, 70, 60)',
          800: 'rgb(30, 40, 35)',
          850: 'rgb(25, 35, 30)',
          900: 'rgb(20, 30, 25)',
          950: 'rgb(12, 20, 16)',
        },
        surface: {
          DEFAULT: 'rgb(22, 32, 27)',
          2: 'rgb(28, 38, 33)',
          3: 'rgb(35, 45, 40)',
        },
        text: {
          DEFAULT: 'rgb(250, 250, 250)',
          secondary: 'rgb(210, 230, 220)',
          tertiary: 'rgb(150, 180, 165)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(46, 160, 87, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(46, 160, 87, 0.05) 1px, transparent 1px)',
        'dashboard-pattern': 'repeating-linear-gradient(45deg, rgba(46, 160, 87, 0.02) 0, rgba(46, 160, 87, 0.02) 1px, transparent 0, transparent 50%)',
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(46, 160, 87, 0.25)',
        'glow-sm': '0 0 15px rgba(46, 160, 87, 0.15)',
        'glow-accent': '0 0 20px rgba(235, 137, 52, 0.25)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 20px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: 'rgb(250, 250, 250)',
            h1: {
              color: 'rgb(250, 250, 250)',
              fontWeight: '500',
              letterSpacing: '0.025em',
            },
            h2: {
              color: 'rgb(250, 250, 250)',
              fontWeight: '400',
              letterSpacing: '0.015em',
            },
            h3: {
              color: 'rgb(250, 250, 250)',
              fontWeight: '400',
            },
            strong: {
              color: 'rgb(250, 250, 250)',
              fontWeight: '600',
            },
            a: {
              color: 'rgb(46, 160, 87)',
              '&:hover': {
                color: 'rgb(87, 191, 124)',
              },
            },
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Rubik', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
};
