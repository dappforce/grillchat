import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import { ConfigProvider, useConfigContext } from '@/contexts/ConfigContext'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/utils'
import '@/styles/globals.css'
import { getGaId } from '@/utils/env/client'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

const EvmProvider = dynamic(import('@/components/modals/login/EvmProvider'), { ssr: false })

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
        <EvmProvider>
          <Component {...props} />
        </EvmProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

function ToasterConfig() {
  return <Toaster position='top-center' />
}
