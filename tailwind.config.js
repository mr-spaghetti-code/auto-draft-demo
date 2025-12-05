/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Amazon Ember', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        // Amazon-style colors
        amazon: {
          orange: '#ff9900',
          teal: '#007185',
          'teal-dark': '#005f6b',
        },
        // Status colors
        status: {
          needs: '#d13212',
          draft: '#3b82f6',
          responded: '#067d68',
        },
      },
    },
  },
  plugins: [],
}
