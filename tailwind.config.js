/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: '#eaf5fd',
          100: '#cfe7fb',
          200: '#a8d3f5',
          400: '#5aa8e9',
          500: '#4ba0e8',
          600: '#3a8cd4',
          700: '#2d70ac',
          800: '#275c8c',
          900: '#1f4a70'
        },
        trust: {
          50: '#eef8ec',
          100: '#d9f0d4',
          200: '#bfe6b7',
          400: '#8ed17e',
          500: '#7bc767',
          600: '#6fbf52',
          700: '#559a3d',
          800: '#447a31',
          900: '#386328'
        }
      },
      fontFamily: {
        sans: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        heading: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
