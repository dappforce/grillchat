import { env } from '@/env.mjs'
import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
export default function Document() {
  return (
    <Html lang='en' className='bg-transparent'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='shortcut icon' href='/favicon.ico' />

        <link
          rel='apple-touch-icon'
          sizes='192x192'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#111729' />
        <meta name='theme-color' content='#111729' />

        <meta name='application-name' content='Epic' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Epic' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-config' content='/browserconfig.xml' />
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
        <Script id='app_launched_start' strategy='beforeInteractive'>
          {`
            let deviceId = null
            if (typeof window !== 'undefined') {
              const keys = Object.keys(localStorage)
              for (let i = 0; i < keys.length; i++) {
                if (keys[i].startsWith('AMP_')) {
                  const value = window.localStorage.getItem(keys[i])
                  try {
                    const parsed = JSON.parse(value)
                    if (parsed && parsed.deviceId) {
                      deviceId = parsed.deviceId
                      break
                    }
                  } catch {}
                }
              }
            }
            fetch('https://api2.amplitude.com/2/httpapi', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
              },
              body: JSON.stringify({
                api_key: '${env.NEXT_PUBLIC_AMP_ID}',
                events: [
                  {
                    event_type: 'app_launch_started',
                    device_id: deviceId
                  },
                ],
              }),
            })
              .then((response) => response.json())
              .then((data) => console.log('APP_LAUNCHED_START', deviceId))
              .catch((error) => console.error('ERROR_APP_LAUNCHED_START', error))
          `}
        </Script>
      </body>
    </Html>
  )
}
