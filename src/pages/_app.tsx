import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import { cx } from '@/utils/className'
import { Source_Sans_Pro } from '@next/font/google'
import type { AppProps } from 'next/app'

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={cx(
        'min-h-screen bg-background text-text',
        sourceSansPro.className
      )}
    >
      <Navbar />
    </div>
  )
}
