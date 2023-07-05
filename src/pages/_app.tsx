import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import useIsInIframe from '@/hooks/useIsInIframe'
import { ConfigProvider, useConfigContext } from '@/providers/ConfigProvider'
import EvmProvider from '@/providers/evm/EvmProvider'
import { QueryProvider } from '@/services/provider'
import { useSendEvent } from '@/stores/analytics'
import { initAllStores } from '@/stores/registry'
import '@/styles/globals.css'
import { cx } from '@/utils/class-names'
import { getGaId } from '@/utils/env/client'
import '@khmyznikov/pwa-install'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { Source_Sans_Pro } from 'next/font/google'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['pwa-install']: any
    }
  }
}

export type AppCommonProps = {
  alwaysShowScrollbarOffset?: boolean
  head?: HeadConfigProps
  dehydratedState?: any
}

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
})

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
        html {
          --source-sans-pro: ${sourceSansPro.style.fontFamily};
        }

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

      <pwa-install id='pwa-install' manifest-url='/manifest.json'></pwa-install>
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

  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()
  useEffect(() => {
    if (!isInIframe) return
    sendEvent('loaded in iframe')
  }, [isInIframe, sendEvent])

  return (
    <ThemeProvider attribute='class' forcedTheme={theme}>
      <QueryProvider dehydratedState={dehydratedState}>
        <ToasterConfig />
        <NextNProgress
          color='#4d46dc'
          options={{ showSpinner: false }}
          showOnShallow={false}
        />
        <HeadConfig {...head} />
        <GoogleAnalytics trackPageViews gaMeasurementId={getGaId()} />
        <EvmProvider>
          <div className={cx('font-sans')}>
            <Component {...props} />
          </div>
        </EvmProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

function ToasterConfig() {
  return <Toaster position='top-center' />
}
