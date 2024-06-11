import ErrorBoundary from '@/components/ErrorBoundary'
import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import OauthLoadingModal from '@/components/auth/OauthLoadingModal'
import GlobalModals from '@/components/modals/GlobalModals'
import { ReferralUrlChanger } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { ConfigProvider } from '@/providers/config/ConfigProvider'
import NeynarLoginProvider from '@/providers/config/NeynarLoginProvider'
import TelegramLoginProvider from '@/providers/config/TelegramLoginProvider'
import EvmProvider from '@/providers/evm/EvmProvider'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useDatahubSubscription } from '@/services/datahub/subscription-aggregator'
import { QueryProvider } from '@/services/provider'
import {
  useMyAccount,
  useMyGrillAddress,
  useMyMainAddress,
} from '@/stores/my-account'
import { initAllStores } from '@/stores/registry'
import '@/styles/globals.css'
import { cx } from '@/utils/class-names'
import '@rainbow-me/rainbowkit/styles.css'
import { SDKProvider } from '@tma.js/sdk-react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
// import { GoogleAnalytics } from 'nextjs-google-analytics'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import urlJoin from 'url-join'

export type AppCommonProps = {
  alwaysShowScrollbarOffset?: boolean
  head?: HeadConfigProps
  dehydratedState?: any
  session?: any
}

export default function App(props: AppProps<AppCommonProps>) {
  useEffect(() => {
    import('eruda').then((eruda) => eruda.default.init())
  })

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
        <SDKProvider>
          <AppContent {...props} />
        </SDKProvider>
      </ConfigProvider>
    </SessionProvider>
  )
}

function Styles({
  alwaysShowScrollbarOffset,
}: {
  alwaysShowScrollbarOffset?: boolean
}) {
  const isInIframe = useIsInIframe()

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
      ${scrollbarStyling}
    `}</style>
  )
}

function AppContent({ Component, pageProps }: AppProps<AppCommonProps>) {
  const { head, dehydratedState, ...props } = pageProps

  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true
    initAllStores()
  }, [])

  useEffect(() => {
    const telegram = window.Telegram as any

    const webApp = telegram?.WebApp

    webApp?.expand()
  })

  return (
    <ThemeProvider attribute='class' defaultTheme='dark' forcedTheme='dark'>
      <QueryProvider dehydratedState={dehydratedState}>
        <TelegramLoginProvider>
          <NeynarLoginProvider>
            <DatahubSubscriber />
            <ToasterConfig />
            <ReferralUrlChanger />
            {/* <NextNProgress
            color='#eb2f95'
            options={{ showSpinner: false }}
            showOnShallow={false}
          /> */}
            <HeadConfig {...head} />
            <Script id='gtm' strategy='afterInteractive'>
              {`
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','GTM-MQZ9PG2W');
                `}
            </Script>
            {/* <GoogleAnalytics
            trackPageViews
            gaMeasurementId={getAugmentedGaId()}
          /> */}
            <GlobalModals />
            <SessionAccountChecker />
            <OauthLoadingModal />
            <div className={cx('font-sans')}>
              <ErrorBoundary>
                <EvmProvider>
                  <Component {...props} />
                </EvmProvider>
              </ErrorBoundary>
            </div>
          </NeynarLoginProvider>
        </TelegramLoginProvider>
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

function SessionAccountChecker() {
  const grillAddress = useMyGrillAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  const mainAddress = useMyMainAddress()

  useEffect(() => {
    if (linkedIdentity && linkedIdentity.mainAddress !== mainAddress) {
      useMyAccount.getState().saveProxyAddress(linkedIdentity.mainAddress)
    }
  }, [linkedIdentity, mainAddress])

  return null
}
