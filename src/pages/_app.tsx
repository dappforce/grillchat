import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import Navbar from '@/components/navbar/Navbar'
import { useBreakpointThreshold } from '@/hooks/useBreakpointThreshold'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/utils'
import '@/styles/globals.css'
import { cx } from '@/utils/class-names'
import type { AppProps } from 'next/app'
import { Source_Sans_Pro } from 'next/font/google'
import NextNProgress from 'nextjs-progressbar'
import { useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600'],
  subsets: ['latin'],
})

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
      <NextNProgress color='#4d46dc' />
      <ToasterConfig />
      <HeadConfig {...head} />
      <div
        className={cx(
          'flex h-screen flex-col bg-background text-text',
          sourceSansPro.className
        )}
        style={{ height: '100dvh' }}
      >
        <Navbar />
        <Component {...props} />
      </div>
    </QueryProvider>
  )
}

function ToasterConfig() {
  const mdUp = useBreakpointThreshold('md')
  return <Toaster position={mdUp ? 'bottom-right' : 'top-center'} />
}
