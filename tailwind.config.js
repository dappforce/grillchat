const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      },
      fontSize: {
        base: ['1rem', '1.35'],
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
        'text-secondary-light':
          'rgb(var(--text-secondary-light) / <alpha-value>)',
        'text-dark': 'rgb(var(--text-dark) / <alpha-value>)',
        'text-warning': 'rgb(var(--text-warning) / <alpha-value>)',
        'text-red': 'rgb(var(--text-red) / <alpha-value>)',

        'border-gray': 'rgb(var(--border-gray) / <alpha-value>)',
      },
      screens: {
        xs: '250px',
        // => @media (min-width: 250px) { ... }
        sm: '600px',
        // => @media (min-width: 640px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },

      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },

        // my animations

        scaleSlow: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        shakeAndMove: {
          '0%': {
            transform: 'translateX(0) translateY(0) rotate(0deg)',
          },
          '25%': {
            transform: 'translateX(50px) translateY(20px) rotate(5deg)',
          },
          '50%': {
            transform: 'translateX(0) translateY(0) rotate(-5deg)',
          },
          '75%': {
            transform: 'translateX(-50px) translateY(-20px) rotate(5deg)',
          },
          '100%': {
            transform: 'translateX(0) translateY(0) rotate(0deg)',
          },
        },

        slideAndFade: {
          from: {
            transform: 'translateY(20px)',
            opacity: '0.6',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        fromDownFade: {
          from: {
            transform: 'translateY(30px)',
            opacity: '0.7',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },

        cardAnimation: {
          '0%': {
            transform: 'translateY(0%)',
            zIndex: '10',
          },
          '40%': {
            transform: 'translateY(-40%)',
            zIndex: '10',
          },
          '50%': {
            transform: 'translateY(-40%)',
            zIndex: '20',
          },
          '100%': {
            transform: 'translateY(0%)',
            zIndex: '20',
          },
        },
        xcardAnimation: {
          '0%': {
            transform: 'translateY(0%)',
            zIndex: '10',
          },
          '40%': {
            transform: 'translateX(-50%)',
            zIndex: '10',
          },
          '50%': {
            transform: 'translateX(-50%)',
            zIndex: '20',
          },
          '100%': {
            transform: 'translateX(0%)',
            zIndex: '20',
          },
        },
        cardsContainerAnimation: {
          '0%': {
            transform: 'translateY(0%)',
            //zIndex: '10',
          },
          '40%': {
            transform: 'translateY(-10%)',
            //zIndex: '10',
          },
          '50%': {
            transform: 'translateY(-10%)',
            zIndex: '0',
          },
          '100%': {
            transform: 'translateY(0%)',
            //zIndex: '20',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        scaleSlow: 'scaleSlow 2.1s ease-in-out',
        shakeAndMove: 'shakeAndMove 4.2s ease-in-out',
        slideAndFade: 'slideAndFade 2s ease-in-out',
        fromDownFade: 'fromDownFade 1s ease-inout',
        cardAnimation: 'cardAnimation 5s ease-in-out',
        xcardAnimation: 'xcardAnimation 10s ease-in-out',
        cardsContainerAnimation: 'cardsContainerAnimation 3s ease-in-out',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
}
