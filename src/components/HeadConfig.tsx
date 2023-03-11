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
  const usedTitle = 'GrillChat' + (title ? ` | ${title}` : '')
  const usedDesc = description || 'Chat app powered by Subsocial'

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
