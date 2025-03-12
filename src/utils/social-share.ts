export const openNewWindow = (url: string) =>
  window.open(
    url,
    '_blank',
    'toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=500,height=400'
  )

type OptionsType = {
  tags?: string[]
}

export const subsocialUrl = (url: string) =>
  typeof window !== undefined ? `${window.location.origin}${url}` : ''

export const twitterShareUrl = (
  url: string,
  text?: string,
  options?: OptionsType
) => {
  const tags = options?.tags
  const textVal = text ? `text=${encodeURIComponent(text)}` : ''

  return `https://twitter.com/intent/tweet?${textVal}&url=${encodeURIComponent(
    '\n' + url + '\n\n'
  )}&hashtags=${[...(tags || [])]}&original_referer=${url}`
}

export const linkedInShareUrl = (
  url: string,
  title?: string,
  summary?: string
) => {
  const titleVal = title ? `title=${title}` : ''
  const summaryVal = summary ? `summary=${summary}` : ''

  return encodeURI(
    `https://www.linkedin.com/shareArticle?mini=true&url=${subsocialUrl(
      url
    )}&${titleVal}&${summaryVal}`
  )
}

export const facebookShareUrl = (url: string) =>
  encodeURI(`https://www.facebook.com/sharer/sharer.php?u=${subsocialUrl(url)}`)

export const redditShareUrl = (url: string, title?: string) => {
  const titleVal = title ? `title=${title}` : ''

  return encodeURI(
    `http://www.reddit.com/submit?url=${subsocialUrl(url)}&${titleVal}`
  )
}
