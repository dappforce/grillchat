import Head from 'next/head'

export type HeadConfigProps = {
  title?: string | null
  isTitleBrandFocused?: boolean
  description?: string | null
  image?: string | null
  disableZoom?: boolean
  cardFormat?: 'summary' | 'summary_large_image'
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
  cardFormat = 'summary_large_image',
}: HeadConfigProps) {
  const defaultTitle = 'EPIC - A Meme-to-Earn Platform'
  const summarizedTitle = summarize(title || defaultTitle)

  let usedTitle
  if (isTitleBrandFocused || !title) usedTitle = 'Epic: ' + summarizedTitle
  else usedTitle = summarizedTitle + ' | Epic'

  const defaultDesc = 'Earn meme coins 💰 by posting and liking memes 🤣'
  const usedDesc = description || defaultDesc

  const usedImage = image || 'https://epicapp.net/cover.png'

  return (
    <Head>
      <title>{usedTitle}</title>
      <meta name='description' content={usedDesc} />

      <meta name='twitter:card' content={cardFormat} />
      <meta name='twitter:title' content={usedTitle} />
      <meta name='twitter:description' content={usedDesc} />
      <meta name='twitter:image' content={usedImage} />

      <meta property='og:title' content={usedTitle} />
      <meta property='og:description' content={usedDesc} />
      <meta property='og:site_name' content='Grill' />
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
