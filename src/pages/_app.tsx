import ErrorBoundary from '@/components/ErrorBoundary'
import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import useIsInIframe from '@/hooks/useIsInIframe'
import useNetworkStatus from '@/hooks/useNetworkStatus'
import { ConfigProvider, useConfigContext } from '@/providers/ConfigProvider'
import EvmProvider from '@/providers/evm/EvmProvider'
import { useSubscribePosts } from '@/services/datahub/posts/subscription'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/registry'
import '@/styles/globals.css'
import { cx } from '@/utils/class-names'
import { getGaId } from '@/utils/env/client'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

const PWAInstall = dynamic(() => import('@/components/PWAInstall'), {
  ssr: false,
})

export type AppCommonProps = {
  alwaysShowScrollbarOffset?: boolean
  head?: HeadConfigProps
  dehydratedState?: any
}

export default function App(props: AppProps<AppCommonProps>) {
  const isInIframe = useIsInIframe()

  const scrollbarSelector = isInIframe ? 'body' : 'html'
  const scrollbarStyling = props.pageProps.alwaysShowScrollbarOffset
    ? `
      ${scrollbarSelector} {
        overflow-y: scroll;
      }
    `
    : ''

  return (
    <ConfigProvider>
      <style jsx global>{`
        ${isInIframe
          ? // Fix issue with iframe height not calculated correctly in iframe
            `
          html,
          body {
            height: 100%;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
          }
        `
          : ''}

        ${scrollbarStyling}
      `}</style>
      <AppContent {...props} />
      <PWAInstall />
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
        <SubsocialApiReconnect />
        <ToasterConfig />
        <NextNProgress
          color='#4d46dc'
          options={{ showSpinner: false }}
          showOnShallow={false}
        />
        <HeadConfig {...head} />
        <GoogleAnalytics trackPageViews gaMeasurementId={getGaId()} />
        <div className={cx('font-sans')}>
          <ErrorBoundary>
            <EvmProvider>
              <Component {...props} />
            </EvmProvider>
          </ErrorBoundary>
        </div>
        <PostSubscriber />
      </QueryProvider>
    </ThemeProvider>
  )
}

function PostSubscriber() {
  useSubscribePosts()
  return null
}

function ToasterConfig() {
  return <Toaster position='top-center' />
}

function SubsocialApiReconnect() {
  const { status, reconnect } = useNetworkStatus()
  const isConnected = status === 'connected'

  useEffect(() => {
    if (!isConnected && document.visibilityState === 'visible') {
      reconnect()
    }
  }, [isConnected, reconnect])

  return null
}
