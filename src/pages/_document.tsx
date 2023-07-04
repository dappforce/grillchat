import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='shortcut icon' href='/favicon.ico' />

        <link
          rel='apple-touch-icon'
          sizes='180x180'
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

        <meta name='application-name' content='Grill.chat' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Grill.chat' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-config' content='/browserconfig.xml' />
        <meta name='msapplication-tap-highlight' content='no' />

        <link
          href='splashscreens/iphone5_splash.png'
          media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/iphone6_splash.png'
          media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/iphoneplus_splash.png'
          media='(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/iphonex_splash.png'
          media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/iphonexr_splash.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/iphonexsmax_splash.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/ipad_splash.png'
          media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/ipadpro1_splash.png'
          media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/ipadpro3_splash.png'
          media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)'
          rel='apple-touch-startup-image'
        />
        <link
          href='splashscreens/ipadpro2_splash.png'
          media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)'
          rel='apple-touch-startup-image'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
