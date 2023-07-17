import Head from 'next/head'

export type HeadConfigProps = {
  title?: string | null
  isTitleBrandFocused?: boolean
  description?: string | null
  image?: string | null
  disableZoom?: boolean
}

const LIMIT = 45
function summarize(text: string) {
  if (text.length <= LIMIT) return text
  return text.slice(0, LIMIT) + '...'
}

export default function HeadConfig({
  description,
  title,
  disableZoom,
  image,
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

  const usedImage =
    image || 'https://grill.chat/icons/maskable-icon-192x192.png'

  return (
    <Head>
      <title>{usedTitle}</title>
      <meta name='description' content={usedDesc} />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={usedTitle} />
      <meta name='twitter:description' content={usedDesc} />
      <meta name='twitter:image' content={usedImage} />

      <meta property='og:title' content={usedTitle} />
      <meta property='og:description' content={usedDesc} />
      <meta property='og:site_name' content='Grill.chat' />
      <meta property='og:image' content={usedImage} />

      {disableZoom ? (
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
        />
      ) : (
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      )}
    </Head>
  )
}
