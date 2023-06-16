const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--source-sans-pro)', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '4.5xl': '2.5rem',
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        'background-light': 'rgb(var(--background-light) / <alpha-value>)',
        'background-lighter': 'rgb(var(--background-lighter) / <alpha-value>)',
        'background-lightest':
          'rgb(var(--background-lightest) / <alpha-value>)',
        'background-primary': 'rgb(var(--background-primary) / <alpha-value>)',
        'background-primary-light':
          'rgb(var(--background-primary-light) / <alpha-value>)',
        'background-warning': 'rgb(var(--background-warning) / <alpha-value>)',
        'background-info': 'rgb(var(--background-info) / <alpha-value>)',
        'background-accent': 'rgb(var(--background-accent) / <alpha-value>)',
        'background-red': 'rgb(var(--background-red) / <alpha-value>)',

        text: 'rgb(var(--text) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
        'text-on-primary': 'rgb(var(--text-on-primary) / <alpha-value>)',
        'text-muted-on-primary':
          'rgb(var(--text-muted-on-primary) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-dark': 'rgb(var(--text-dark) / <alpha-value>)',
        'text-warning': 'rgb(var(--text-warning) / <alpha-value>)',
        'text-red': 'rgb(var(--text-red) / <alpha-value>)',

        'border-gray': 'rgb(var(--border-gray) / <alpha-value>)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
}
