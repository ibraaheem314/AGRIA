/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: 'rgb(32, 32, 30)',
        darker: 'rgb(24, 24, 22)',
        primary: {
          DEFAULT: 'rgb(97, 167, 43)',
          50: '#f6fbf1',
          100: '#e9f5e1',
          200: '#d3ecc3',
          300: '#b0dd96',
          400: '#88c761',
          500: '#68ad3c',
          600: '#5b9b2f',
          700: '#477a27',
          800: '#3a6123',
          900: '#315120',
          950: '#172c0d',
        },
        secondary: {
          DEFAULT: 'rgb(58, 93, 121)',
          50: '#f4f7fa',
          100: '#e9eff5',
          200: '#d2dfe9',
          300: '#b0c5d7',
          400: '#89a5c0',
          500: '#6b87a9',
          600: '#546e8e',
          700: '#435872',
          800: '#3a4c60',
          900: '#334051',
          950: '#1e2835',
        },
        accent: {
          DEFAULT: 'rgb(232, 137, 26)',
          50: '#fef8ed',
          100: '#fdefd6',
          200: '#fadcac',
          300: '#f7c477',
          400: '#f3a43d',
          500: '#ea831e',
          600: '#cd6416',
          700: '#aa4915',
          800: '#893a17',
          900: '#723217',
          950: '#3f1809',
        },
        season: {
          spring: 'rgb(141, 196, 89)',
          summer: 'rgb(245, 180, 0)',
          autumn: 'rgb(204, 90, 40)',
          winter: 'rgb(86, 137, 162)',
        },
        soil: {
          DEFAULT: 'rgb(112, 84, 62)',
          light: 'rgb(156, 132, 105)',
          dark: 'rgb(76, 58, 42)',
        },
        harvest: {
          DEFAULT: 'rgb(194, 126, 61)',
          light: 'rgb(224, 178, 132)',
        },
        success: {
          DEFAULT: '#5fa832',
          600: '#4a8c21',
        },
        neutral: {
          750: 'rgb(70, 69, 64)',
          800: 'rgb(55, 54, 50)',
          850: 'rgb(45, 44, 40)',
          900: 'rgb(35, 34, 31)',
          950: 'rgb(25, 24, 22)',
        },
        surface: {
          DEFAULT: 'rgb(42, 41, 38)',
          2: 'rgb(52, 51, 48)',
        },
        text: {
          DEFAULT: 'rgb(255, 252, 245)',
          secondary: 'rgb(230, 227, 220)',
          tertiary: 'rgb(190, 187, 180)',
        },
        code: {
          DEFAULT: 'rgb(242, 240, 235)',
          bg: 'rgb(40, 38, 35)',
          highlight: 'rgb(97, 167, 43)',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(97, 167, 43, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(97, 167, 43, 0.05) 1px, transparent 1px)',
        'hex-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5.5l21.65 12.5v25L30 55.5 8.35 43V18L30 5.5z\' fill=\'none\' stroke=\'%2361a72b20\' stroke-width=\'1\'/%3E%3C/svg%3E")',
        'garden-pattern': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' viewBox=\'0 0 100 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10 l100 0\' stroke=\'%2361a72b20\' stroke-width=\'0.8\' stroke-dasharray=\'4 6\' /%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg width=\'20\' height=\'100\' viewBox=\'0 0 20 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 0 l0 100\' stroke=\'%2361a72b20\' stroke-width=\'0.8\' stroke-dasharray=\'4 7\' /%3E%3C/svg%3E")',
        'soil-texture': 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2370543e20\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 12V8zm0 4L52 0h2L40 16v-4zm0 4L56 0h2L40 20v-4zm0 4L60 0h2L40 24v-4zm0 4L64 0h2L40 28v-4zm0 4L68 0h2L40 32v-4zm0 4L72 0h2L40 36v-4zm0 4L76 0h2L40 40v-4zm4 0L80 0v2L44 40h-4zm4 0L80 4v2L48 40h-4zm4 0L80 8v2L52 40h-4zm4 0L80 12v2L56 40h-4zm4 0L80 16v2L60 40h-4zm4 0L80 20v2L64 40h-4zm4 0L80 24v2L68 40h-4zm4 0L80 28v2L72 40h-4zm4 0L80 32v2L76 40h-4zm4 0L80 36v2L80 40h-4zM4 40l36-36h2L2 40H0v-2l36-36h2L0 40v-2l36-36h2L0 38v-2l36-36h2L0 36v-2l36-36h2L0 34v-2l36-36h2L0 32v-2l36-36h2L0 30v-2l36-36h2L0 28v-2l36-36h2L0 26v-2l36-36h2L0 24v-2l36-36h2L0 22v-2l36-36h2L0 20v-2l36-36h2L0 18v-2l36-36h2L0 16v-2l36-36h2L0 14v-2l36-36h2L0 12v-2l36-36h2L0 10V8l36-36h2L0 8V6l36-36h2L0 6V4l36-36h2L0 4V2l36-36h2L0 2V0l36-36h2L0 0v2zm24 66l-12-12 12-12 12 12-12 12zm28-6L40 48l12-12 12 12-12 12zm0 16l-12-12 12-12 12 12-12 12z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        'wave-pattern': 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'50px\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,25 C150,60 350,-10 500,25 L500,50 L0,50 Z\' fill=\'%2370543e15\'/%3E%3C/svg%3E")',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(97, 167, 43, 0.3)',
        'glow-sm': '0 0 12px rgba(97, 167, 43, 0.2)',
        'glow-accent': '0 0 15px rgba(232, 137, 26, 0.25)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 6px 16px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'growth': 'growth 10s ease-in-out infinite',
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
        growth: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
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
            color: 'rgb(255, 252, 245)',
            h1: {
              color: 'rgb(255, 252, 245)',
              fontWeight: '500',
              letterSpacing: '0.025em',
            },
            h2: {
              color: 'rgb(255, 252, 245)',
              fontWeight: '500',
              letterSpacing: '0.015em',
            },
            h3: {
              color: 'rgb(255, 252, 245)',
              fontWeight: '500',
            },
            strong: {
              color: 'rgb(255, 252, 245)',
            },
            a: {
              color: 'rgb(97, 167, 43)',
            },
            code: {
              color: 'rgb(97, 167, 43)',
              backgroundColor: 'rgb(40, 38, 35)',
              padding: '0.25rem',
              borderRadius: '0.25rem',
            },
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        display: ['Montserrat', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
};
