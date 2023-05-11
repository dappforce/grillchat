import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import { ConfigProvider, useConfigContext } from '@/contexts/ConfigContext'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/utils'
import '@/styles/globals.css'
import { cx } from '@/utils/class-names'
import { getGaId } from '@/utils/env/client'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { Source_Sans_Pro } from 'next/font/google'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

export type AppCommonProps = {
  head?: HeadConfigProps
  dehydratedState?: any
}

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--source-sans-pro',
})

export default function App(props: AppProps<AppCommonProps>) {
  return (
    <ConfigProvider>
      <AppContent {...props} />
    </ConfigProvider>
  )
}

function AppContent({ Component, pageProps }: AppProps<AppCommonProps>) {
  const { head, dehydratedState, ...props } = pageProps
  const isInitialized = useRef(false)
  const { theme } = useConfigContext()

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true
    initAllStores()
  }, [])

  return (
    <ThemeProvider attribute='class' forcedTheme={theme}>
      <QueryProvider dehydratedState={dehydratedState}>
        <ToasterConfig />
        <NextNProgress color='#4d46dc' />
        <HeadConfig {...head} />
        <GoogleAnalytics trackPageViews gaMeasurementId={getGaId()} />
        <div className={cx(sourceSansPro.variable, 'font-sans')}>
          <Component {...props} />
        </div>
      </QueryProvider>
    </ThemeProvider>
  )
}

function ToasterConfig() {
  return <Toaster position='top-center' />
}
