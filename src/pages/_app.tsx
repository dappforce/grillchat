import BadgeManager from '@/components/BadgeManager'
import ErrorBoundary from '@/components/ErrorBoundary'
import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import GlobalModals from '@/components/modals/GlobalModals'
import { ReferralUrlChanger } from '@/components/referral/ReferralUrlChanger'
import { PAGES_WITH_LARGER_CONTAINER } from '@/constants/layout'
import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import {
  ConfigProvider,
  useConfigContext,
} from '@/providers/config/ConfigProvider'
import { getAugmentedGaId } from '@/providers/config/utils'
import SolanaProvider from '@/providers/solana/SolanaProvider'
import { useDatahubSubscription } from '@/services/datahub/subscription-aggregator'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/registry'
import '@/styles/github-md.css'
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
        {/* <PWAInstall /> */}
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

  const isPagesWithSidebar = PAGES_WITH_LARGER_CONTAINER.includes(
    router.pathname
  )
  const isUsing16BaseSize =
    router.pathname === '/landing' ||
    PAGES_WITH_LARGER_CONTAINER.includes(router.pathname)

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
      ${isUsing16BaseSize
        ? `
          @media screen and (min-width: 768px) {
            :root {
              font-size: 1rem;
            }
          }
        `
        : ''}
      ${isPagesWithSidebar
        ? `
        :root {
          --background: 248 250 252;
          --background-light: 255 255 255;
          --background-lighter: 248 250 252;
          --background-lightest: 241 245 249;
          --border-gray: 223 229 240;
        }
        .dark {
          --background: 17 23 41;
          --background-light: 32 41 58;
          --background-lighter: 44 56 79;
          --background-lightest: 54 74 102;
          --border-gray: 51 59 74;
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
        <ToasterConfig />
        <ForegroundNotificationHandler />
        <ReferralUrlChanger />
        <NextNProgress
          color='#eb2f95'
          options={{ showSpinner: false }}
          showOnShallow={false}
        />
        <HeadConfig {...head} />
        <GoogleAnalytics trackPageViews gaMeasurementId={getAugmentedGaId()} />
        <GlobalModals />
        <div className={cx('font-sans')}>
          <ErrorBoundary>
            <SolanaProvider>
              <Component {...props} />
            </SolanaProvider>
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
