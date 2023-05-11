import { Source_Sans_Pro } from 'next/font/google'
import Head from 'next/head'

export type HeadConfigProps = {
  title?: string | null
  isTitleBrandFocused?: boolean
  description?: string | null
  disableZoom?: boolean
}

const sourceSansPro = Source_Sans_Pro({
  weight: ['400', '600'],
  subsets: ['latin'],
})

const LIMIT = 45
function summarize(text: string) {
  if (text.length <= LIMIT) return text
  return text.slice(0, LIMIT) + '...'
}

export default function HeadConfig({
  description,
  title,
  disableZoom,
  isTitleBrandFocused,
}: HeadConfigProps) {
  const defaultTitle = 'Chat Anonymously On-Chain Without Wallets'
  const summarizedTitle = summarize(title || defaultTitle)

  let usedTitle
  if (isTitleBrandFocused || !title)
    usedTitle = 'Grill.chat: ' + summarizedTitle
  else usedTitle = summarizedTitle + ' | Grill.chat'

  const defaultDesc =
    'Talk with others from around the world and create your own communities about any topic, utilizing our censorship-resistant blockchain and app with anonymous logins.'
  const usedDesc = description || defaultDesc

  return (
    <Head>
      <title>{usedTitle}</title>
      <meta name='description' content={usedDesc} />
      {disableZoom ? (
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        />
      ) : (
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      )}
      <style jsx global>{`
        html {
          --source-sans-pro: ${sourceSansPro.style.fontFamily};
        }
      `}</style>
      <link rel='icon' href='/favicon.ico' />
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
      <link rel='manifest' href='/site.webmanifest' />
      <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
      <meta name='msapplication-TileColor' content='#da532c' />
      <meta name='theme-color' content='#111729' />
    </Head>
  )
}
