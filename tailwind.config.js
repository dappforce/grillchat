/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        'background-light': 'rgb(var(--background-light) / <alpha-value>)',
        'background-primary': 'rgb(var(--background-primary) / <alpha-value>)',
        'background-warning': 'rgb(var(--background-warning) / <alpha-value>)',

        text: 'rgb(var(--text) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-dark': 'rgb(var(--text-dark) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
