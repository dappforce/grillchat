import { AnalyticProvider } from '@/analytics'
import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import { useBreakpointThreshold } from '@/hooks/useBreakpointThreshold'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/utils'
import '@/styles/globals.css'
import { getGaId } from '@/utils/env/client'
import type { AppProps } from 'next/app'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

export type AppCommonProps = {
  head?: HeadConfigProps
  dehydratedState?: any
}

export default function App({
  Component,
  pageProps,
}: AppProps<AppCommonProps>) {
  const { head, dehydratedState, ...props } = pageProps
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true
    initAllStores()
  }, [])

  return (
    <QueryProvider dehydratedState={dehydratedState}>
      <ToasterConfig />
      <NextNProgress color='#4d46dc' />
      <HeadConfig {...head} />
      <GoogleAnalytics trackPageViews gaMeasurementId={getGaId()} />
      <AnalyticProvider>
        <Component {...props} />
      </AnalyticProvider>
    </QueryProvider>
  )
}

function ToasterConfig() {
  const mdUp = useBreakpointThreshold('md')
  return <Toaster position={mdUp ? 'bottom-right' : 'top-center'} />
}
