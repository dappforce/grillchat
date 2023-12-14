import BadgeManager from '@/components/BadgeManager'
import ErrorBoundary from '@/components/ErrorBoundary'
import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import useIsInIframe from '@/hooks/useIsInIframe'
import useNetworkStatus from '@/hooks/useNetworkStatus'
import { ConfigProvider, useConfigContext } from '@/providers/ConfigProvider'
import EvmProvider from '@/providers/evm/EvmProvider'
import { useDatahubSubscription } from '@/services/datahub/subscription-aggregator'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/registry'
import { useTransactions } from '@/stores/transactions'
import '@/styles/globals.css'
import { cx } from '@/utils/class-names'
import { getGaId } from '@/utils/env/client'
import '@rainbow-me/rainbowkit/styles.css'
import { SessionProvider } from 'next-auth/react'
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
const ForegroundNotificationHandler = dynamic(
  () => import('@/components/ForegroundNotificationHandler'),
  { ssr: false }
)

export type AppCommonProps = {
  alwaysShowScrollbarOffset?: boolean
  head?: HeadConfigProps
  dehydratedState?: any
  session?: any
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
    <SessionProvider session={props.pageProps.session}>
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
    </SessionProvider>
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
        <DatahubSubscriber />
        <BadgeManager />
        <SubsocialApiReconnect />
        <ToasterConfig />
        <ForegroundNotificationHandler />
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
      </QueryProvider>
    </ThemeProvider>
  )
}

function DatahubSubscriber() {
  useDatahubSubscription()
  return null
}

function ToasterConfig() {
  return <Toaster position='top-center' />
}

function SubsocialApiReconnect() {
  const subscriptionState = useTransactions((state) => state.subscriptionState)
  const { status, reconnect, disconnect, connect } = useNetworkStatus()
  const isConnected = status === 'connected'

  useEffect(() => {
    if (!isConnected && document.visibilityState === 'visible') {
      reconnect()
    }
  }, [isConnected, reconnect])

  useEffect(() => {
    if (subscriptionState === 'always-sub') {
      connect()
    }
  }, [subscriptionState, connect])

  useEffect(() => {
    const listener = () => {
      if (document.visibilityState === 'visible') connect()
      else disconnect()
    }
    document.addEventListener('visibilitychange', listener)
    return () => document.removeEventListener('visibilitychange', listener)
  }, [connect, disconnect])

  return null
}
