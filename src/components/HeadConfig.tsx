import Head from 'next/head'

export type HeadConfigProps = {
  title?: string
  description?: string
  disableZoom?: boolean
}

export default function HeadConfig({
  description,
  title,
  disableZoom,
}: HeadConfigProps) {
  const defaultTitle = 'Chat Anonymously On-Chain Without Wallets'
  const usedTitle = 'GrillChat | ' + (title || defaultTitle)

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
