import { withThemeFromJSXProvider } from '@storybook/addon-styling'
import type { Preview } from '@storybook/react'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { ThemeProvider, useTheme } from 'next-themes'
import React, { useEffect } from 'react'
import { sourceSans3 } from '../src/fonts'
import { QueryProvider } from '../src/services/provider'

initialize()

import '../src/styles/globals.css'
import './styles.css'

// To make prettier plugin organize imports not delete react import
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
  loaders: [mswLoader],

  decorators: [
    // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    withThemeFromJSXProvider({
      themes: {
        light: { name: 'light' },
        dark: { name: 'dark' },
      },
      Provider: ThemeProviderWrapper,
      defaultTheme: 'light',
    }),
    (Story) => (
      <QueryProvider dehydratedState={{}}>
        <div
          className={`${sourceSans3.className}`}
          style={{ fontFamily: '"Source Sans 3"' }}
        >
          <Story />
        </div>
      </QueryProvider>
    ),
  ],
}

function ThemeProviderWrapper({ theme, children }) {
  return (
    <ThemeProvider attribute='class'>
      <ThemeSwitcher theme={theme} />
      {children}
    </ThemeProvider>
  )
}
function ThemeSwitcher({ theme }) {
  const { setTheme } = useTheme()
  useEffect(() => {
    setTheme(theme.name)
  }, [theme.name])

  return null
}

export default preview
