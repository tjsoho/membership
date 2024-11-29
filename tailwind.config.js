/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coastal: {
          sand: '#f5e6d3',
          sandDark: '#e6d5bb',
          ocean: '#2c5282',
          oceanLight: '#4299e1',
          teal: '#2c7a7b',
          tealLight: '#4fd1c5',
          shell: '#fff5f5',
        },
      },
    },
  },
  plugins: [],
} 