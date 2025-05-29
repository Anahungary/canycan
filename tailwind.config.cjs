/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          500: '#AFC2D5',
          900: '#334455',
        },
        secondary: {
          50: '#fef7f0', 
          500: '#F6B89E',
          900: '#c1523a',
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}