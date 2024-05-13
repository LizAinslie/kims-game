/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Bellota Text', 'sans-serif'],
      display: ['Bellota', 'cursive'],
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
