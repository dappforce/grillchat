import BadgeManager from '@/components/BadgeManager'
import ErrorBoundary from '@/components/ErrorBoundary'
import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import { ReferralUrlChanger } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import useNetworkStatus from '@/hooks/useNetworkStatus'
import {
  ConfigProvider,
  useConfigContext,
} from '@/providers/config/ConfigProvider'
import { getAugmentedGaId } from '@/providers/config/utils'
import EvmProvider from '@/providers/evm/EvmProvider'
import { useDatahubSubscription } from '@/services/datahub/subscription-aggregator'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/registry'
import { useTransactions } from '@/stores/transactions'
import '@/styles/globals.css'
import { cx } from '@/utils/class-names'
import '@rainbow-me/rainbowkit/styles.css'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import urlJoin from 'url-join'

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
  return (
    <SessionProvider
      basePath={
        env.NEXT_PUBLIC_BASE_PATH
          ? urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/api/auth')
          : undefined
      }
      session={props.pageProps.session}
    >
      <ConfigProvider>
        <Styles
          alwaysShowScrollbarOffset={props.pageProps.alwaysShowScrollbarOffset}
        />
        <AppContent {...props} />
        <PWAInstall />
      </ConfigProvider>
    </SessionProvider>
  )
}

function Styles({
  alwaysShowScrollbarOffset,
}: {
  alwaysShowScrollbarOffset?: boolean
}) {
  const router = useRouter()
  const isInIframe = useIsInIframe()

  const isLandingPage = router.pathname === '/landing'

  const scrollbarSelector = isInIframe ? 'body' : 'html'
  const scrollbarStyling = alwaysShowScrollbarOffset
    ? `
      ${scrollbarSelector} {
        overflow-y: scroll;
      }
    `
    : ''

  return (
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
      ${isLandingPage
        ? `
          @media screen and (min-width: 768px) {
            :root {
              font-size: 1rem;
            }
          }
        `
        : ''}

      ${scrollbarStyling}
    `}</style>
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
    <ThemeProvider attribute='class' defaultTheme='light' forcedTheme={theme}>
      <QueryProvider dehydratedState={dehydratedState}>
        <DatahubSubscriber />
        <BadgeManager />
        <SubsocialApiReconnect />
        <ToasterConfig />
        <ForegroundNotificationHandler />
        <ReferralUrlChanger />
        <NextNProgress
          color='#4d46dc'
          options={{ showSpinner: false }}
          showOnShallow={false}
        />
        <HeadConfig {...head} />
        <GoogleAnalytics trackPageViews gaMeasurementId={getAugmentedGaId()} />
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
