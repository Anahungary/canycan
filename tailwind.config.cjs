// tailwind.config.mjs - Configuración completa para tu proyecto
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Paleta de colores PataDigital
        primary: {
          DEFAULT: '#AFC2D5',
          50: '#f0f4f7',
          100: '#dae8ef', 
          200: '#b8d2e1',
          300: '#89b4cb',
          400: '#AFC2D5',
          500: '#7fa3bb',
          600: '#6b8ba5',
          700: '#5a7489',
          800: '#4d6070',
          900: '#425059'
        },
        secondary: {
          DEFAULT: '#F6B89E',
          50: '#fef7f3',
          100: '#fdede5',
          200: '#fad8c6', 
          300: '#F6B89E',
          400: '#f19970',
          500: '#ea7c4a',
          600: '#dc6332',
          700: '#b84d28',
          800: '#923f26',
          900: '#773622'
        },
        accent: '#C8D6B9',
        neutral: '#F4E2D8', 
        dark: '#2E2E2E',
        light: '#FAFAFA'
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}