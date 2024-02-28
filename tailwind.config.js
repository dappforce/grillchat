const { themeVariants, prefersLight, prefersDark } = require('tailwindcss-theme-variants');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateRows: {
        0: 'repeat(1, minmax(0, 0fr))',
      },
      screens: {
        'medium': '924px',
      },
      fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        unbounded: 'Unbounded, sans-serif',
      },
      fontSize: {
        base: ['1rem', '1.35'],
        '4.5xl': '2.5rem',
      },
      padding: {
        4.5: '1.125rem',
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
        'text-secondary-light':
          'rgb(var(--text-secondary-light) / <alpha-value>)',
        'text-dark': 'rgb(var(--text-dark) / <alpha-value>)',
        'text-warning': 'rgb(var(--text-warning) / <alpha-value>)',
        'text-red': 'rgb(var(--text-red) / <alpha-value>)',

        'border-gray': 'rgb(var(--border-gray) / <alpha-value>)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwindcss-touch')(),
    themeVariants({
      themes: {
        light: {
          mediaQuery: prefersLight /* "@media (prefers-color-scheme: light)" */,
        },
        dark: {
          mediaQuery: prefersDark /* "@media (prefers-color-scheme: dark)" */,
        },
      },
    }),
  ],
}
