/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coastal: {
          'dark-teal': '#4EA292',
          'light-teal': '#7AB4A8',
          'dark-grey': '#C0C1B3',
          'sand': '#E1CEA6',
          'light-grey': '#E5E8E1',
          'sand-light': '#EDDDC3',
        },
      },
    },
  },
  plugins: [],
} 