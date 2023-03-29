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
    </Head>
  )
}
