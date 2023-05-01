import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import { ConfigProvider, useConfigContext } from '@/contexts/ConfigContext'
import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/utils'
import '@/styles/globals.css'
import { getGaId } from '@/utils/env/client'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

export type AppCommonProps = {
  head?: HeadConfigProps
  dehydratedState?: any
}

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
        <Component {...props} />
      </QueryProvider>
    </ThemeProvider>
  )
}

function ToasterConfig() {
  const mdUp = useBreakpointThreshold('md')
  return <Toaster position={mdUp ? 'bottom-right' : 'top-center'} />
}
