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
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/icons/maskable-icon-192x192.png'
          )}
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
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            `/manifest${env.NEXT_PUBLIC_BASE_PATH.substring(1)}.json`
          )}
        />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#111729' />
        <meta name='theme-color' content='#111729' />

        <meta name='application-name' content='Grill' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Grill' />
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

        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_14_Pro_Max_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_14_Pro_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_11__iPhone_XR_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/12.9__iPad_Pro_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/11__iPad_Pro__10.5__iPad_Pro_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/10.9__iPad_Air_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/10.5__iPad_Air_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/10.2__iPad_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png'
          )}
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href={urlJoin(
            env.NEXT_PUBLIC_BASE_PATH,
            '/splashscreens/8.3__iPad_Mini_portrait.png'
          )}
        />
      </Head>
      <body className='bg-transparent text-text'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
