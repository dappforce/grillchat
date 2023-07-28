import { withThemeByClassName } from '@storybook/addon-styling'
import type { Preview } from '@storybook/react'
import React from 'react'
import { sourceSans3 } from '../src/fonts'

/* TODO: update import to your tailwind styles file. If you're using Angular, inject this through your angular.json config instead */
import '../src/styles/globals.css'

type A = React.Component

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <div
        className={`${sourceSans3.className}`}
        style={{ fontFamily: '"Source Sans 3"' }}
      >
        <Story />
      </div>
    ),
  ],
}

export default preview
