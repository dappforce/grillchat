import { env } from '@/env.mjs'
import { Head, Html, Main, NextScript } from 'next/document'
import urlJoin from 'url-join'
export default function Document() {
  return (
    <Html lang='en' className='bg-transparent'>
      <Head>
        <link
          rel='icon'
          href={urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/favicon.ico')}
        />
        <link
          rel='shortcut icon'
          href={urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/favicon.ico')}
        />

        <link
          rel='apple-touch-icon'
          sizes='192x192'
          href={urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/apple-touch-icon.png')}
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href={urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/favicon-32x32.png')}
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href={urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/favicon-16x16.png')}
        />
        <link
          rel='manifest'
          href={urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/manifest.json')}
        />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#111729' />
        <meta name='theme-color' content='#111729' />

        <meta name='application-name' content='Epic' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Epic' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta
          name='msapplication-config'
          content={urlJoin(env.NEXT_PUBLIC_BASE_PATH, '/browserconfig.xml')}
        />
        <meta name='msapplication-tap-highlight' content='no' />

        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Unbounded:wght@200;300;400;500;600;700;800;900&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body className='text-text'>
        <Main />
        <NextScript />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MQZ9PG2W" height="0" width="0" style="display: none; visibility: hidden;" />`,
          }}
        />
      </body>
    </Html>
  )
}
