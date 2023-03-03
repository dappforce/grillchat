import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import Navbar from '@/components/navbar/Navbar'
import { QueryProvider } from '@/services/provider'
import { initAllStores } from '@/stores/utils'
import '@/styles/globals.css'
import { cx } from '@/utils/className'
import type { AppProps } from 'next/app'
import { Source_Sans_Pro } from 'next/font/google'
import { useEffect } from 'react'

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

  useEffect(() => {
    initAllStores()
  }, [])

  return (
    <QueryProvider dehydratedState={dehydratedState}>
      <HeadConfig {...head} />
      <div
        className={cx(
          'flex h-screen flex-col bg-background text-text',
          sourceSansPro.className
        )}
      >
        <Navbar />
        <Component {...props} />
      </div>
    </QueryProvider>
  )
}
