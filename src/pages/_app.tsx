import HeadConfig, { HeadConfigProps } from '@/components/HeadConfig'
import Navbar from '@/components/navbar/Navbar'
import client from '@/services/client'
import '@/styles/globals.css'
import { cx } from '@/utils/className'
import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Source_Sans_Pro } from 'next/font/google'

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600'],
  subsets: ['latin'],
})

export type AppCommonProps = {
  head?: HeadConfigProps
}

export default function App({
  Component,
  pageProps,
}: AppProps<AppCommonProps>) {
  const { head } = pageProps

  return (
    <QueryClientProvider client={client}>
      <HeadConfig {...head} />
      <div
        className={cx(
          'flex h-screen flex-col bg-background text-text',
          sourceSansPro.className
        )}
      >
        <Navbar />
        <Component />
      </div>
    </QueryClientProvider>
  )
}
